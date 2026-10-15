import React from 'react';
import { Plus } from 'lucide-react';
import { MenuItem } from '../types.ts';
import { useCart } from '../context/CartContext.tsx';

interface MenuItemCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onSelect }) => {
  const { cart } = useCart();

  // Find quantity of this item in cart
  const cartCount = cart
    .filter((c) => c.item.id === item.id)
    .reduce((sum, c) => sum + c.quantity, 0);

  return (
    <div
      onClick={() => onSelect(item)}
      className="group relative flex items-start justify-between py-4 px-4 bg-white border-b border-zinc-100/90 hover:bg-zinc-50/60 transition-colors cursor-pointer select-none"
    >
      {/* Left Details */}
      <div className="flex-1 pr-4">
        {/* Badges */}
        {item.tagBadge && (
          <div className="mb-1.5">
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide ${
                item.tagBadge === 'New'
                  ? 'bg-[#E32626] text-white'
                  : item.tagBadge === 'Popular'
                  ? 'bg-[#E32626] text-white'
                  : 'bg-amber-500 text-white'
              }`}
            >
              {item.tagBadge}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className="font-bold text-[15px] text-zinc-900 group-hover:text-[#E32626] transition-colors leading-snug">
          {item.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-zinc-500 line-clamp-2 mt-1 leading-relaxed">
          {item.description}
        </p>

        {/* Price Row */}
        <div className="flex items-center space-x-2 mt-2">
          <span className="font-bold text-[14px] text-zinc-900">
            Rs. {item.price.toFixed(2)}
          </span>
          {item.originalPrice && (
            <span className="text-xs line-through text-zinc-400 font-medium">
              Rs. {item.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Discount Tag */}
        {item.discountBadge && (
          <div className="mt-2">
            <span className="bg-zinc-100 text-zinc-700 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-zinc-200">
              {item.discountBadge}
            </span>
          </div>
        )}
      </div>

      {/* Right Thumbnail & Action Button */}
      <div className="relative shrink-0">
        <div className="w-28 h-28 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200/60 shadow-xs">
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Red Circle Button (matching Screenshot 1 '+' and Screenshot 6 count badge '1') */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(item);
          }}
          aria-label={`Select ${item.name}`}
          className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-[#E32626] text-white flex items-center justify-center shadow-md hover:bg-red-700 active:scale-90 transition-transform cursor-pointer"
        >
          {cartCount > 0 ? (
            <span className="text-xs font-bold">{cartCount}</span>
          ) : (
            <Plus className="w-5 h-5 stroke-[2.8]" />
          )}
        </button>
      </div>
    </div>
  );
};
