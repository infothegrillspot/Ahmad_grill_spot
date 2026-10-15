import React, { useState } from 'react';
import { X, Heart, ChevronDown, ChevronUp, Plus, Minus, Check } from 'lucide-react';
import { MenuItem, AddOnOption } from '../types.ts';
import { useCart } from '../context/CartContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';

interface ItemCustomizeModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

export const ItemCustomizeModal: React.FC<ItemCustomizeModalProps> = ({
  item,
  onClose,
}) => {
  if (!item) return null;

  const { addToCart } = useCart();
  const { favourites, toggleFavourite } = useAuth();

  const isFav = favourites.includes(item.id);

  // Initialize selected choices for required groups
  const [selectedChoices, setSelectedChoices] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    item.choiceGroups?.forEach((group) => {
      if (group.options.length > 0) {
        initial[group.id] = group.options[0].name;
      }
    });
    return initial;
  });

  const [selectedAddOns, setSelectedAddOns] = useState<AddOnOption[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState('');

  // Collapsible accordion states
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'group-0': true,
    'group-1': true,
    'addons': true,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChoiceChange = (groupId: string, optionName: string) => {
    setSelectedChoices((prev) => ({ ...prev, [groupId]: optionName }));
  };

  const handleToggleAddOn = (addon: AddOnOption) => {
    setSelectedAddOns((prev) => {
      const exists = prev.find((a) => a.id === addon.id);
      if (exists) {
        return prev.filter((a) => a.id !== addon.id);
      } else {
        if (prev.length >= 10) return prev;
        return [...prev, addon];
      }
    });
  };

  // Price calculations
  const addOnsTotal = selectedAddOns.reduce((acc, a) => acc + a.price, 0);
  const unitPrice = item.price + addOnsTotal;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addToCart(item, quantity, selectedChoices, selectedAddOns, instructions);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-t-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Handle bar */}
        <div className="w-full pt-3 pb-1 flex justify-center bg-transparent absolute top-0 z-20 pointer-events-none">
          <div className="w-12 h-1.5 bg-white/70 rounded-full shadow-xs" />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
          {/* Hero Image Container */}
          <div className="relative w-full aspect-[4/3] bg-zinc-900">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover object-center"
            />
            {/* Close Circle Button */}
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-transform active:scale-95 z-10"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Title & Info Section */}
          <div className="p-4 border-b border-zinc-100">
            <div className="flex items-start justify-between">
              <h2 className="text-xl font-extrabold text-zinc-900 leading-tight">
                {item.name}
              </h2>
              <button
                onClick={() => toggleFavourite(item.id)}
                aria-label="Save to favourites"
                className="p-1 text-zinc-400 hover:text-red-500 transition-colors ml-2"
              >
                <Heart
                  className={`w-6 h-6 ${
                    isFav ? 'fill-[#E32626] text-[#E32626]' : 'stroke-[2]'
                  }`}
                />
              </button>
            </div>

            {/* Price Row */}
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-lg font-black text-zinc-900">
                Rs. {item.price.toFixed(2)}
              </span>
              {item.originalPrice && (
                <span className="text-sm line-through text-zinc-400 font-medium">
                  Rs. {item.originalPrice.toFixed(2)}
                </span>
              )}
              {item.discountBadge && (
                <span className="bg-zinc-100 text-zinc-800 text-xs font-semibold px-2 py-0.5 rounded-full border border-zinc-200">
                  {item.discountBadge}
                </span>
              )}
            </div>

            <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Choice Groups (Required options matching Screenshot 5) */}
          {item.choiceGroups?.map((group, idx) => {
            const sectionKey = `group-${idx}`;
            const isOpen = openSections[sectionKey] ?? true;

            return (
              <div key={group.id} className="border-b border-zinc-100">
                <button
                  type="button"
                  onClick={() => toggleSection(sectionKey)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-zinc-50/50 transition-colors"
                >
                  <div>
                    <div className="text-[15px] font-bold text-zinc-900 flex items-center">
                      <span>{group.name}</span>
                      {group.required && (
                        <span className="text-[#E32626] text-xs font-semibold ml-1.5">
                          (Required)
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-zinc-500 mt-0.5">
                      Please select any one option
                    </div>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-zinc-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-zinc-500" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 pb-3 space-y-2">
                    {group.options.map((opt) => {
                      const isSelected = selectedChoices[group.id] === opt.name;
                      return (
                        <label
                          key={opt.id}
                          onClick={() => handleChoiceChange(group.id, opt.name)}
                          className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-zinc-50 cursor-pointer select-none transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                isSelected
                                  ? 'border-[#E32626] bg-[#E32626]'
                                  : 'border-zinc-300 bg-white'
                              }`}
                            >
                              {isSelected && (
                                <div className="w-2 h-2 rounded-full bg-white" />
                              )}
                            </div>
                            <span className="text-sm font-medium text-zinc-800">
                              {opt.name}
                            </span>
                          </div>
                          {opt.priceDelta && opt.priceDelta > 0 && (
                            <span className="text-xs font-semibold text-zinc-600">
                              +Rs. {opt.priceDelta.toFixed(2)}
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Add-Ons Section (matching Screenshot 5) */}
          {item.addOns && item.addOns.length > 0 && (
            <div className="border-b border-zinc-100">
              <button
                type="button"
                onClick={() => toggleSection('addons')}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-zinc-50/50 transition-colors"
              >
                <div>
                  <div className="text-[15px] font-bold text-zinc-900">
                    Add-Ons
                  </div>
                  <div className="text-xs text-zinc-500 mt-0.5">
                    You can select atmost 10 options
                  </div>
                </div>
                {openSections['addons'] ? (
                  <ChevronUp className="w-5 h-5 text-zinc-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-zinc-500" />
                )}
              </button>

              {openSections['addons'] && (
                <div className="px-4 pb-4 space-y-3">
                  {item.addOns.map((addon) => {
                    const isSelected = selectedAddOns.some((a) => a.id === addon.id);

                    return (
                      <div
                        key={addon.id}
                        className="flex items-center justify-between py-2 border-b border-zinc-50 last:border-0"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">🧀</span>
                          <div>
                            <div className="text-sm font-semibold text-zinc-800">
                              {addon.name}
                            </div>
                            <div className="text-xs text-zinc-500">
                              Rs. {addon.price.toFixed(2)}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleToggleAddOn(addon)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-zinc-900 text-white'
                              : 'bg-[#E32626] text-white hover:bg-red-700'
                          }`}
                        >
                          {isSelected ? (
                            <Check className="w-4 h-4 stroke-[3]" />
                          ) : (
                            <Plus className="w-4 h-4 stroke-[2.8]" />
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Special Instructions */}
          <div className="p-4">
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
              Special Instructions
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Extra napkins, no pickles, sauce on the side..."
              rows={2}
              className="w-full text-xs p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E32626]/20 focus:border-[#E32626] resize-none"
            />
          </div>
        </div>

        {/* Sticky Bottom Actions Bar (matching Screenshot 5) */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-zinc-100 p-3 flex items-center space-x-4 shadow-2xl">
          {/* Stepper */}
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-9 h-9 rounded-full bg-red-100/80 text-[#E32626] flex items-center justify-center font-bold disabled:opacity-40 disabled:cursor-not-allowed active:scale-90 transition-transform"
            >
              <Minus className="w-4 h-4 stroke-[3]" />
            </button>
            <span className="font-extrabold text-base text-zinc-900 w-4 text-center">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="w-9 h-9 rounded-full bg-[#E32626] text-white flex items-center justify-center font-bold active:scale-90 transition-transform shadow-xs"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
            </button>
          </div>

          {/* Big Red Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 bg-[#E32626] hover:bg-red-700 active:scale-[0.98] text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2"
          >
            <span>Add to Cart</span>
            <span className="text-white/80 font-normal">|</span>
            <span>Rs. {totalPrice.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
