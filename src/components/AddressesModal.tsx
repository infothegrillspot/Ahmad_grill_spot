import React, { useState } from 'react';
import { ChevronLeft, MapPin, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface AddressesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddressesModal: React.FC<AddressesModalProps> = ({ isOpen, onClose }) => {
  const { addresses, saveAddress, deleteAddress, profile } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('Home');
  const [addressText, setAddressText] = useState('');
  const [phone, setPhone] = useState(profile.phoneNumber || '');

  if (!isOpen) return null;

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressText.trim()) return;
    saveAddress({
      title,
      address: addressText,
      phone,
      isDefault: addresses.length === 0,
    });
    setAddressText('');
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl relative overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Red Header */}
        <div className="bg-[#E32626] text-white px-4 py-3.5 flex items-center justify-between shrink-0 shadow-md">
          <button
            onClick={onClose}
            aria-label="Back"
            className="p-1 -ml-1 hover:bg-white/10 rounded-lg active:scale-95 transition-all"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>
          <h1 className="text-lg font-bold tracking-tight">My Addresses</h1>
          <div className="w-6" />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3 pb-24">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="bg-white border border-zinc-200/80 rounded-2xl p-4 shadow-2xs hover:shadow-sm transition-all flex items-start justify-between"
            >
              <div className="flex items-start space-x-3">
                <div className="w-9 h-9 rounded-xl bg-red-50 text-[#E32626] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-zinc-900">{addr.title}</span>
                    {addr.isDefault && (
                      <span className="bg-green-100 text-green-700 font-bold text-[9px] px-1.5 py-0.5 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-600 mt-1 leading-relaxed">{addr.address}</p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Phone: {addr.phone}</p>
                </div>
              </div>

              <button
                onClick={() => deleteAddress(addr.id)}
                className="text-zinc-400 hover:text-red-500 p-1"
                title="Delete address"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {showAddForm ? (
            <form onSubmit={handleAddAddress} className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-700">Add New Address</h3>
              
              <div className="flex space-x-2">
                {['Home', 'Office', 'Other'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTitle(t)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      title === t
                        ? 'bg-[#E32626] text-white'
                        : 'bg-white text-zinc-700 border border-zinc-300'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase">Street Address</label>
                <textarea
                  required
                  rows={2}
                  value={addressText}
                  onChange={(e) => setAddressText(e.target.value)}
                  placeholder="e.g. House 14, Street 2, Phase 5 DHA, Lahore"
                  className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#E32626]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase">Contact Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-zinc-300 bg-white"
                />
              </div>

              <div className="flex space-x-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 bg-[#E32626] text-white text-xs font-bold py-2 rounded-lg"
                >
                  Save Address
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-zinc-200 text-zinc-700 text-xs font-bold px-3 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full bg-red-50 text-[#E32626] hover:bg-red-100 font-bold text-xs py-3 rounded-2xl border border-red-200/80 flex items-center justify-center space-x-2 transition-all active:scale-98"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add New Address</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
