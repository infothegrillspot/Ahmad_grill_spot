import React, { useState } from 'react';
import { 
  ChevronLeft, 
  User, 
  MapPin, 
  CreditCard, 
  Clock, 
  Navigation, 
  Tag, 
  Check, 
  Edit3,
  CheckCircle2,
  AlertCircle,
  Phone,
  LogIn
} from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { db, handleFirestoreError, OperationType } from '../firebase.ts';
import { collection, addDoc } from 'firebase/firestore';
import { OrderRecord } from '../types.ts';
import { d1Service } from '../services/d1Service.ts';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: OrderRecord) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderSuccess,
}) => {
  const { cart, selectedBranch, orderType, subtotal, tax, savings, grandTotal, clearCart } = useCart();
  const { profile, user, updateProfileData, signInWithGoogle } = useAuth();

  const [instructions, setInstructions] = useState('');
  const [showInstructionsInput, setShowInstructionsInput] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [showPaymentPicker, setShowPaymentPicker] = useState(false);
  const [pickupTime, setPickupTime] = useState('ASAP');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Editable customer info
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);
  const [custName, setCustName] = useState(profile.name);
  const [custPhone, setCustPhone] = useState(profile.phoneNumber);
  const [custEmail, setCustEmail] = useState(profile.email);

  React.useEffect(() => {
    setCustName(user ? (profile.name || user.displayName || '') : profile.name);
    setCustPhone(profile.phoneNumber || '');
    setCustEmail(user ? (user.email || profile.email) : profile.email);
  }, [profile, user]);

  if (!isOpen) return null;

  const paymentOptions = [
    { id: 'cod', label: 'Cash on Delivery', desc: 'Pay with physical cash upon arrival' },
    { id: 'card-delivery', label: 'Card on Delivery', desc: 'POS machine brought to you' },
    { id: 'online-card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, UnionPay (HBL 40% Off promo eligible)' },
    { id: 'easypaisa', label: 'EasyPaisa / JazzCash', desc: 'Fast mobile wallet checkout' },
  ];

  const timeOptions = [
    'ASAP (approx. 20-25 mins)',
    'In 45 minutes',
    'In 1 hour',
    'Schedule for later today',
  ];

  const handleSaveCustomerDetails = async () => {
    if (!custPhone.trim()) {
      setErrorMessage("Phone number is mandatory for placing an order.");
      return;
    }
    await updateProfileData({
      name: custName,
      phoneNumber: custPhone,
      email: custEmail,
    });
    setIsEditingCustomer(false);
    setErrorMessage(null);
  };

  const handleConfirmOrder = async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      // Rule 1: Guest customers cannot place order - Google login is mandatory
      if (!user) {
        setErrorMessage("Guest customers cannot place orders. Please sign in with your Google account to complete your order.");
        setIsSubmitting(false);
        try {
          await signInWithGoogle();
        } catch (e) {
          // popup cancelled
        }
        return;
      }

      // Rule 2: Phone number is strictly mandatory
      const cleanPhone = custPhone.trim();
      const digitsOnly = cleanPhone.replace(/[^0-9]/g, '');
      if (!cleanPhone || digitsOnly.length < 9) {
        setErrorMessage("Phone number is mandatory to place your order. Please enter your phone number below so we can contact you.");
        setIsEditingCustomer(true);
        setIsSubmitting(false);
        return;
      }

      // Auto-save phone number to profile in Cloudflare D1 SQL & Firestore
      await updateProfileData({
        name: custName || user.displayName || 'Customer',
        phoneNumber: cleanPhone,
        email: custEmail || user.email || '',
      });

      const orderPayload: OrderRecord = {
        id: `GRILL-${Date.now().toString().slice(-6)}`,
        userId: user.uid,
        customerName: custName || user.displayName || 'Customer',
        phoneNumber: cleanPhone,
        email: custEmail || user.email || '',
        orderType,
        branch: selectedBranch.name,
        branchAddress: selectedBranch.address,
        instructions,
        paymentMethod,
        estimatedTime: pickupTime,
        subtotal,
        tax,
        discount: savings,
        grandTotal,
        status: 'placed',
        items: cart.map((c) => ({
          name: c.item.name,
          quantity: c.quantity,
          price: c.totalItemPrice,
          details: Object.values(c.selectedChoices).join(', '),
        })),
        createdAt: new Date().toISOString(),
      };

      // 1. Persist order directly into Cloudflare D1 SQL
      await d1Service.saveOrder(orderPayload);

      // 2. Also persist to Firestore for Firebase user
      const path = 'orders';
      try {
        await addDoc(collection(db, path), orderPayload);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, path);
      }

      // Also store in localStorage as offline backup
      const existing = JSON.parse(localStorage.getItem('grillspot_orders') || localStorage.getItem('smash_orders') || '[]');
      localStorage.setItem('grillspot_orders', JSON.stringify([orderPayload, ...existing]));

      clearCart();
      onOrderSuccess(orderPayload);
    } catch (err: unknown) {
      console.error('Order placement failed:', err);
      setErrorMessage(err instanceof Error ? err.message : 'Order could not be confirmed. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl relative overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Red Header (matching Screenshot 4) */}
        <div className="bg-[#E32626] text-white px-4 py-3.5 flex items-center justify-between shrink-0 shadow-md">
          <button
            onClick={onClose}
            aria-label="Back"
            className="p-1 -ml-1 hover:bg-white/10 rounded-lg active:scale-95 transition-all"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>
          <h1 className="text-lg font-bold tracking-tight">Checkout</h1>
          <div className="w-6" />
        </div>

        {/* Scrollable Checkout Form */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-5 pb-32">
          {/* Rule: Guest customer cannot place order banner */}
          {!user && (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 space-y-3 shadow-xs">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#E32626] flex items-center justify-center shrink-0">
                  <LogIn className="w-5 h-5 stroke-[2.4]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-zinc-900">Google Login Required</h3>
                  <p className="text-xs text-zinc-600 mt-0.5 leading-relaxed">
                    Guest customers cannot place orders. Please sign in with your Google account and provide your contact phone number to place your order.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={signInWithGoogle}
                className="w-full bg-white border border-zinc-300 hover:bg-zinc-50 text-zinc-800 text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs flex items-center justify-center space-x-2 transition-all active:scale-98"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Sign in with Google</span>
              </button>
            </div>
          )}

          {/* Section: Customer Details (matching Screenshot 4) */}
          <div className="bg-white">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2 text-[#E32626]">
                <User className="w-5 h-5 stroke-[2.2]" />
                <h2 className="text-base font-bold text-zinc-900">Customer Details</h2>
              </div>
              {user && (
                <button
                  type="button"
                  onClick={() => setIsEditingCustomer(!isEditingCustomer)}
                  className="text-xs text-zinc-500 hover:text-[#E32626] flex items-center space-x-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditingCustomer ? 'Cancel' : 'Edit'}</span>
                </button>
              )}
            </div>

            {user ? (
              <div className="space-y-3">
                {isEditingCustomer ? (
                  <div className="bg-zinc-50 p-3 rounded-xl space-y-2 border border-zinc-200">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-zinc-500">Name</label>
                      <input
                        type="text"
                        value={custName}
                        onChange={(e) => setCustName(e.target.value)}
                        className="w-full text-xs bg-white border border-zinc-300 rounded-lg p-2 font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-zinc-500">
                        Phone <span className="text-[#E32626] font-bold">* Mandatory</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={custPhone}
                        onChange={(e) => setCustPhone(e.target.value)}
                        placeholder="+92 3XX XXXXXXX"
                        className="w-full text-xs bg-white border border-zinc-300 rounded-lg p-2 font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-zinc-500">Email</label>
                      <input
                        type="email"
                        value={custEmail}
                        onChange={(e) => setCustEmail(e.target.value)}
                        className="w-full text-xs bg-white border border-zinc-300 rounded-lg p-2 font-medium"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleSaveCustomerDetails}
                      className="bg-[#E32626] text-white text-xs font-bold px-3 py-1.5 rounded-lg w-full mt-1"
                    >
                      Save Details
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-1 text-xs text-zinc-800">
                      <div className="font-semibold text-zinc-900">
                        <span className="font-bold">Name: </span>
                        {custName || user.displayName}
                      </div>
                      <div className="truncate">
                        <span className="font-bold">Email: </span>
                        {custEmail || user.email}
                      </div>
                    </div>

                    {/* Dedicated Mandatory Phone Field */}
                    <div className={`p-3 rounded-2xl border transition-all ${
                      !custPhone.trim() || custPhone.replace(/[^0-9]/g, '').length < 10
                        ? 'bg-red-50/70 border-red-300 ring-2 ring-red-400/20'
                        : 'bg-zinc-50/70 border-zinc-200'
                    }`}>
                      <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="checkout-phone-input" className="text-xs font-bold text-zinc-900 flex items-center space-x-1.5">
                          <Phone className="w-3.5 h-3.5 text-[#E32626]" />
                          <span>Contact Phone Number</span>
                        </label>
                        <span className="text-[10px] font-black uppercase text-[#E32626] bg-red-100 px-2 py-0.5 rounded">
                          * Mandatory
                        </span>
                      </div>
                      <input
                        id="checkout-phone-input"
                        type="tel"
                        required
                        value={custPhone}
                        onChange={(e) => {
                          setCustPhone(e.target.value);
                          if (errorMessage) setErrorMessage(null);
                        }}
                        placeholder="e.g. +92 300 1234567 or 0300 1234567"
                        className="w-full text-xs font-bold p-2.5 rounded-xl border border-zinc-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#E32626] placeholder:font-normal placeholder:text-zinc-400"
                      />
                      {!custPhone.trim() ? (
                        <p className="text-[10px] text-red-600 font-semibold mt-1">
                          ⚠️ Phone number is mandatory for kitchen and rider delivery coordination.
                        </p>
                      ) : custPhone.replace(/[^0-9]/g, '').length < 10 ? (
                        <p className="text-[10px] text-amber-700 font-semibold mt-1">
                          ⚠️ Please enter a complete phone number (at least 10 digits).
                        </p>
                      ) : (
                        <p className="text-[10px] text-emerald-700 font-medium mt-1 flex items-center space-x-1">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Phone number recorded for delivery updates.</span>
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-xs text-zinc-600">
                <span className="font-bold text-zinc-800">Not Logged In: </span>
                Please sign in with Google above to provide your customer details and contact phone number.
              </div>
            )}
          </div>

          {/* Location Card with Map Preview (matching Screenshot 4) */}
          <div className="bg-zinc-50/70 border border-zinc-200/80 rounded-2xl p-3 flex items-center justify-between shadow-2xs">
            <div className="flex items-center space-x-3">
              {/* Map Preview Thumbnail */}
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-800 shrink-0 border border-slate-700 flex items-center justify-center">
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:8px_8px]" />
                <div className="text-[9px] font-mono text-zinc-400 absolute top-1 left-1">Legal</div>
                <div className="text-[9px] font-mono text-zinc-400 absolute bottom-1 left-1">Abba</div>
                <MapPin className="w-6 h-6 text-red-500 fill-red-500 z-10 drop-shadow" />
              </div>

              {/* Text */}
              <div className="flex-1 pr-2">
                <div className="text-xs font-bold text-zinc-900">
                  {orderType === 'pickup' ? 'Pick-Up From' : 'Delivery Address'}
                </div>
                <div className="text-[11px] text-zinc-600 font-medium leading-snug mt-0.5 line-clamp-2">
                  {selectedBranch.address}
                </div>
              </div>
            </div>

            {/* Directions Icon */}
            <div className="w-8 h-8 rounded-lg bg-red-50 text-[#E32626] flex items-center justify-center shrink-0">
              <Navigation className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>

          {/* Instructions Box */}
          <div>
            {showInstructionsInput ? (
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700">Order Instructions</label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. Please pack extra napkins and keep sauces separate"
                  rows={2}
                  className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E32626]/20 focus:border-[#E32626]"
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowInstructionsInput(true)}
                className="text-xs font-semibold text-zinc-700 hover:text-[#E32626] flex items-center space-x-1"
              >
                <span>+ Add any instructions for your order</span>
              </button>
            )}
          </div>

          <div className="border-t border-zinc-100" />

          {/* Section: Payment Method (matching Screenshot 4) */}
          <div>
            <div className="flex items-center space-x-2 text-[#E32626] mb-2">
              <CreditCard className="w-5 h-5 stroke-[2.2]" />
              <h2 className="text-base font-bold text-zinc-900">Payment Method</h2>
            </div>
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center space-x-2 text-xs text-zinc-700 font-medium">
                <CreditCard className="w-4 h-4 text-zinc-400" />
                <span>{paymentMethod}</span>
              </div>
              <button
                type="button"
                onClick={() => setShowPaymentPicker(true)}
                className="bg-[#E32626] text-white text-xs font-bold px-4 py-1.5 rounded-lg active:scale-95 transition-all shadow-xs"
              >
                Choose
              </button>
            </div>
          </div>

          <div className="border-t border-zinc-100" />

          {/* Section: Estimated Pick-Up Time (matching Screenshot 4) */}
          <div>
            <div className="flex items-center space-x-2 text-[#E32626] mb-2">
              <Clock className="w-5 h-5 stroke-[2.2]" />
              <h2 className="text-base font-bold text-zinc-900">Estimated Pick-Up Time</h2>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-xs text-zinc-700 font-semibold">{pickupTime}</span>
              <button
                type="button"
                onClick={() => setShowTimePicker(true)}
                className="bg-[#E32626] text-white text-xs font-bold px-4 py-1.5 rounded-lg active:scale-95 transition-all shadow-xs"
              >
                Choose
              </button>
            </div>
          </div>

          <div className="border-t border-zinc-100" />

          {/* Price Breakdown (matching Screenshot 4) */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-zinc-600">
              <span>Subtotal</span>
              <span className="font-semibold text-zinc-900">
                Rs. {subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-zinc-600">
              <span>TAX (16.0%)</span>
              <span className="font-semibold text-zinc-900">
                Rs. {tax.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-sm font-extrabold text-zinc-900">Grand Total</span>
              <span className="text-base font-black text-zinc-900">
                Rs. {grandTotal.toFixed(2)}
              </span>
            </div>

            {/* Savings Callout matching Screenshot 4: "🏷️ Great! You saved Rs. 245.00" */}
            {savings > 0 && (
              <div className="flex items-center space-x-1.5 text-xs font-bold text-[#E32626] pt-1">
                <Tag className="w-4 h-4 fill-[#E32626] text-white" />
                <span>Great! You saved Rs. {savings.toFixed(2)}</span>
              </div>
            )}
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Sticky Bottom Confirm Order Button (matching Screenshot 4) */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-zinc-200/80 p-4 shadow-2xl">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleConfirmOrder}
            className="w-full bg-[#E32626] hover:bg-red-700 disabled:opacity-50 active:scale-[0.98] transition-all text-white font-bold py-3.5 rounded-xl shadow-lg text-sm flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <span>Placing Order...</span>
            ) : (
              <span>Confirm Order</span>
            )}
          </button>
        </div>

        {/* Payment Method Selector Modal */}
        {showPaymentPicker && (
          <div className="fixed inset-0 z-60 bg-black/50 flex items-end justify-center p-0">
            <div className="w-full max-w-md bg-white rounded-t-3xl p-5 space-y-3 animate-in slide-in-from-bottom">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                <h3 className="font-bold text-base text-zinc-900">Select Payment Method</h3>
                <button
                  onClick={() => setShowPaymentPicker(false)}
                  className="text-xs font-bold text-[#E32626]"
                >
                  Done
                </button>
              </div>
              <div className="space-y-2">
                {paymentOptions.map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => {
                      setPaymentMethod(opt.label);
                      setShowPaymentPicker(false);
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      paymentMethod === opt.label
                        ? 'border-[#E32626] bg-red-50/40'
                        : 'border-zinc-200 hover:bg-zinc-50'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-zinc-900">{opt.label}</div>
                      <div className="text-[10px] text-zinc-500">{opt.desc}</div>
                    </div>
                    {paymentMethod === opt.label && (
                      <CheckCircle2 className="w-5 h-5 text-[#E32626]" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Estimated Time Picker Modal */}
        {showTimePicker && (
          <div className="fixed inset-0 z-60 bg-black/50 flex items-end justify-center p-0">
            <div className="w-full max-w-md bg-white rounded-t-3xl p-5 space-y-3 animate-in slide-in-from-bottom">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                <h3 className="font-bold text-base text-zinc-900">Estimated Pick-Up Time</h3>
                <button
                  onClick={() => setShowTimePicker(false)}
                  className="text-xs font-bold text-[#E32626]"
                >
                  Done
                </button>
              </div>
              <div className="space-y-2">
                {timeOptions.map((t) => (
                  <div
                    key={t}
                    onClick={() => {
                      setPickupTime(t);
                      setShowTimePicker(false);
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      pickupTime === t
                        ? 'border-[#E32626] bg-red-50/40'
                        : 'border-zinc-200 hover:bg-zinc-50'
                    }`}
                  >
                    <span className="text-xs font-bold text-zinc-900">{t}</span>
                    {pickupTime === t && (
                      <Check className="w-4 h-4 text-[#E32626] stroke-[3]" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
