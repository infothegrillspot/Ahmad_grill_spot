import React from 'react';
import { ChevronLeft, Heart, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { MENU_ITEMS } from '../data/menuData.ts';
import { MenuItem } from '../types.ts';

interface FavouritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectItem: (item: MenuItem) => void;
}

export const FavouritesModal: React.FC<FavouritesModalProps> = ({
  isOpen,
  onClose,
  onSelectItem,
}) => {
  const { favourites, toggleFavourite } = useAuth();

  if (!isOpen) return null;

  const favItems = MENU_ITEMS.filter((item) => favourites.includes(item.id));

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
          <h1 className="text-lg font-bold tracking-tight">My Favourites</h1>
          <div className="w-6" />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3 pb-8">
          {favItems.length === 0 ? (
            <div className="text-center py-24">
              <Heart className="w-12 h-12 text-zinc-300 mx-auto mb-2 stroke-[1.5]" />
              <div className="font-bold text-sm text-zinc-800">No favourites saved yet</div>
              <p className="text-xs text-zinc-500 mt-1">
                Tap the heart on any burger or deal to save it for quick ordering!
              </p>
            </div>
          ) : (
            favItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-zinc-200/80 rounded-2xl p-3.5 shadow-2xs hover:shadow-sm transition-all flex items-center justify-between"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0 pr-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-zinc-200"
                  />
                  <div className="min-w-0">
                    <h3 className="font-bold text-xs text-zinc-900 truncate">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5">
                      {item.description}
                    </p>
                    <div className="font-bold text-xs text-zinc-900 mt-1">
                      Rs. {item.price.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 shrink-0">
                  <button
                    onClick={() => toggleFavourite(item.id)}
                    className="p-1.5 text-red-500 hover:text-zinc-400"
                    title="Remove from favourites"
                  >
                    <Heart className="w-5 h-5 fill-[#E32626] text-[#E32626]" />
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onSelectItem(item);
                    }}
                    className="w-8 h-8 rounded-full bg-[#E32626] text-white flex items-center justify-center hover:bg-red-700 active:scale-90 shadow-xs"
                    title="Add to cart"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
