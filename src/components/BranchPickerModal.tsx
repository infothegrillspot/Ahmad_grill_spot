import React from 'react';
import { X, MapPin, Check, Store, Bike, Phone } from 'lucide-react';
import { BRANCHES } from '../data/menuData.ts';
import { useCart } from '../context/CartContext.tsx';
import { Branch } from '../types.ts';

interface BranchPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BranchPickerModal: React.FC<BranchPickerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { selectedBranch, setSelectedBranch, orderType, setOrderType } = useCart();

  if (!isOpen) return null;

  const handleSelectBranch = (branch: Branch) => {
    setSelectedBranch(branch);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0">
      <div className="w-full max-w-md bg-white rounded-t-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="text-base font-extrabold text-zinc-900">
            Select Order Type & Location
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Type Toggle (Pick-Up vs Delivery) */}
        <div className="p-4 pb-2">
          <div className="grid grid-cols-2 gap-2 bg-zinc-100 p-1 rounded-xl">
            <button
              onClick={() => setOrderType('pickup')}
              className={`flex items-center justify-center space-x-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                orderType === 'pickup'
                  ? 'bg-[#E32626] text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Pick-Up (Takeaway)</span>
            </button>
            <button
              onClick={() => setOrderType('delivery')}
              className={`flex items-center justify-center space-x-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                orderType === 'delivery'
                  ? 'bg-[#E32626] text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Bike className="w-4 h-4" />
              <span>Home Delivery</span>
            </button>
          </div>
        </div>

        {/* Branches List */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
            Available Branches
          </div>

          {BRANCHES.map((b) => {
            const isSelected = selectedBranch.id === b.id;

            return (
              <div
                key={b.id}
                onClick={() => handleSelectBranch(b)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between ${
                  isSelected
                    ? 'border-[#E32626] bg-red-50/40 shadow-xs'
                    : 'border-zinc-200/80 hover:bg-zinc-50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-[#E32626] text-white'
                        : 'bg-zinc-100 text-zinc-600'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-zinc-900 flex items-center space-x-1.5">
                      <span>{b.name}</span>
                      {b.isOpen && (
                        <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                      )}
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-0.5 leading-snug">
                      {b.address}
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-1 flex items-center space-x-1">
                      <Phone className="w-3 h-3" />
                      <span>{b.phone}</span>
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-[#E32626] text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
