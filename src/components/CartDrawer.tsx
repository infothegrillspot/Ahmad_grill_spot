import React, { useState } from 'react';
import { ChevronLeft, Plus, Minus, Tag, Check, X } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { MENU_ITEMS } from '../data/menuData.ts';
import { MenuItem } from '../types.ts';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
  onOpenBranchPicker: () => void;
  onSelectMenuItem: (item: MenuItem) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onProceedToCheckout,
  onOpenBranchPicker,
  onSelectMenuItem,
}) => {
  const {
    cart,
    selectedBranch,
    orderType,
    updateQuantity,
    removeFromCart,
    subtotal,
    tax,
    grandTotal,
    promoCode,
    promoDiscount,
    promoError,
    applyPromo,
    removePromo,
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [showPromoBox, setShowPromoBox] = useState(false);

  if (!isOpen) return null;

  const popularItems = MENU_ITEMS.filter((i) => i.id !== 'crispy-situation-mint').slice(0, 4);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (applyPromo(promoInput)) {
      setPromoInput('');
      setShowPromoBox(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl relative overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Red Header (matching Screenshot 3) */}
        <div className="bg-[#E32626] text-white px-4 py-3.5 flex items-center justify-between shrink-0 shadow-md">
          <button
            onClick={onClose}
            aria-label="Back"
            className="p-1 -ml-1 hover:bg-white/10 rounded-lg active:scale-95 transition-all"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>
          <h1 className="text-lg font-bold tracking-tight">My Cart</h1>
          <div className="w-6" /> {/* Placeholder to center title */}
        </div>

        {/* Pick-Up From Bar */}
        <div className="px-4 py-3 bg-zinc-50 border-b border-zinc-200/60 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-zinc-500 font-medium">
              {orderType === 'pickup' ? 'Pick-Up From' : 'Delivery To'}
            </div>
            <div className="text-[14px] font-bold text-zinc-900 truncate max-w-[260px]">
              {selectedBranch.name}
            </div>
          </div>
          <button
            onClick={onOpenBranchPicker}
            className="text-[#E32626] font-semibold text-xs hover:underline cursor-pointer"
          >
            Change
          </button>
        </div>

        {/* Scrollable Cart Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
          {cart.length === 0 ? (
            <div className="text-center py-16 px-4">
              <span className="text-4xl block mb-2">🍔</span>
              <h3 className="text-base font-bold text-zinc-800">Your cart is empty</h3>
              <p className="text-xs text-zinc-500 mt-1">
                Explore our mouth-watering grilled burgers and deals!
              </p>
              <button
                onClick={onClose}
                className="mt-4 bg-[#E32626] text-white text-xs font-bold px-4 py-2 rounded-lg"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <>
              {/* Section: Items */}
              <div className="p-4 border-b border-zinc-100">
                <h2 className="text-base font-extrabold text-zinc-900 mb-3">Items</h2>
                <div className="space-y-4">
                  {cart.map((cartItem) => {
                    const choicesSummary = Object.entries(cartItem.selectedChoices)
                      .map(([key, val]) => `${key.replace('-', ' ')}: 1x ${val}`)
                      .join(' • ');

                    const addOnsSummary = cartItem.selectedAddOns
                      .map((a) => `+ ${a.name}`)
                      .join(', ');

                    return (
                      <div
                        key={cartItem.cartId}
                        className="flex items-start justify-between py-2 border-b border-zinc-50 last:border-0"
                      >
                        {/* Thumbnail */}
                        <img
                          src={cartItem.item.image}
                          alt={cartItem.item.name}
                          className="w-16 h-16 rounded-xl object-cover border border-zinc-200 shrink-0 mr-3"
                        />

                        {/* Title & Options */}
                        <div className="flex-1 pr-2">
                          <h3 className="font-bold text-[14px] text-zinc-900 leading-snug">
                            {cartItem.item.name}
                          </h3>
                          {choicesSummary && (
                            <p className="text-[11px] text-zinc-500 line-clamp-2 mt-0.5 capitalize">
                              {choicesSummary}
                            </p>
                          )}
                          {addOnsSummary && (
                            <p className="text-[11px] text-zinc-500 font-medium">
                              {addOnsSummary}
                            </p>
                          )}
                          <div className="font-semibold text-xs text-zinc-900 mt-1">
                            Rs. {(cartItem.totalItemPrice * cartItem.quantity).toFixed(2)}
                          </div>
                        </div>

                        {/* Stepper matching Screenshot 3 */}
                        <div className="flex items-center border border-zinc-300 rounded-lg overflow-hidden bg-white shrink-0">
                          <button
                            type="button"
                            onClick={() => updateQuantity(cartItem.cartId, -1)}
                            className="px-2 py-1 text-[#E32626] hover:bg-zinc-100 active:scale-95 transition-all"
                          >
                            <Minus className="w-3.5 h-3.5 stroke-[2.8]" />
                          </button>
                          <span className="px-2 text-xs font-bold text-zinc-900 min-w-5 text-center">
                            {cartItem.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(cartItem.cartId, 1)}
                            className="px-2 py-1 text-[#E32626] hover:bg-zinc-100 active:scale-95 transition-all"
                          >
                            <Plus className="w-3.5 h-3.5 stroke-[2.8]" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section: Popular items (matching Screenshot 3) */}
              <div className="p-4 border-b border-zinc-100">
                <h2 className="text-base font-extrabold text-zinc-900 mb-3">
                  Popular items
                </h2>
                <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-1">
                  {popularItems.map((popItem) => (
                    <div
                      key={popItem.id}
                      onClick={() => onSelectMenuItem(popItem)}
                      className="w-36 shrink-0 bg-white border border-zinc-200/80 rounded-xl p-2.5 shadow-2xs hover:shadow-sm transition-all cursor-pointer relative"
                    >
                      {/* Badges */}
                      <div className="flex flex-col space-y-1 mb-1.5 items-start">
                        {popItem.discountBadge && (
                          <span className="bg-[#E32626] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm">
                            {popItem.discountBadge}
                          </span>
                        )}
                        {popItem.tagBadge && (
                          <span className="bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm">
                            {popItem.tagBadge}
                          </span>
                        )}
                      </div>

                      {/* Image & Quick Add */}
                      <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-2 bg-zinc-100">
                        <img
                          src={popItem.image}
                          alt={popItem.name}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectMenuItem(popItem);
                          }}
                          className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#E32626] text-white flex items-center justify-center shadow-md active:scale-90"
                        >
                          <Plus className="w-4 h-4 stroke-[3]" />
                        </button>
                      </div>

                      <div className="font-bold text-xs text-zinc-900 truncate">
                        {popItem.name}
                      </div>
                      <div className="text-[10px] text-zinc-500 line-clamp-1">
                        {popItem.description}
                      </div>
                      <div className="mt-1 flex items-center space-x-1">
                        <span className="text-xs font-bold text-zinc-900">
                          Rs. {popItem.price.toFixed(2)}
                        </span>
                        {popItem.originalPrice && (
                          <span className="text-[10px] line-through text-zinc-400">
                            {popItem.originalPrice.toFixed(0)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Promo Code Box (matching Screenshot 3 "+ Apply Promo") */}
              <div className="p-4">
                {promoCode ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Tag className="w-4 h-4 text-green-600" />
                      <div>
                        <div className="text-xs font-bold text-green-800">
                          Promo Applied: {promoCode}
                        </div>
                        <div className="text-[11px] text-green-600">
                          Saved Rs. {promoDiscount.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={removePromo}
                      className="text-xs text-zinc-400 hover:text-red-500 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : showPromoBox ? (
                  <form onSubmit={handleApplyPromo} className="space-y-2">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        placeholder="Enter Promo Code (e.g. GRILL20)"
                        className="flex-1 text-xs border border-zinc-300 rounded-xl px-3 py-2 uppercase font-medium focus:outline-none focus:ring-2 focus:ring-[#E32626]/20 focus:border-[#E32626]"
                      />
                      <button
                        type="submit"
                        className="bg-[#E32626] text-white text-xs font-bold px-4 py-2 rounded-xl"
                      >
                        Apply
                      </button>
                    </div>
                    {promoError && (
                      <p className="text-[11px] text-red-600 font-medium">
                        {promoError}
                      </p>
                    )}
                  </form>
                ) : (
                  <button
                    onClick={() => setShowPromoBox(true)}
                    className="w-full bg-zinc-100/90 hover:bg-zinc-200 active:scale-[0.99] transition-all rounded-xl py-3 px-4 flex items-center justify-center space-x-2 text-zinc-800 font-bold text-xs"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#E32626] text-white flex items-center justify-center">
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span>Apply Promo</span>
                  </button>
                )}
              </div>

              {/* Price Breakdown (matching Screenshot 3) */}
              <div className="px-4 py-3 space-y-2 text-xs border-t border-zinc-100">
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
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>Promo Discount</span>
                    <span>- Rs. {promoDiscount.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Sticky Bottom Total & Proceed to Checkout (matching Screenshot 3) */}
        {cart.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-zinc-200/80 p-4 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-base font-extrabold text-zinc-900">Total</span>
              <span className="text-lg font-black text-zinc-900">
                Rs. {grandTotal.toFixed(2)}
              </span>
            </div>
            <button
              onClick={onProceedToCheckout}
              className="w-full bg-[#E32626] hover:bg-red-700 active:scale-[0.98] transition-all text-white font-bold py-3.5 rounded-xl shadow-lg text-sm"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
