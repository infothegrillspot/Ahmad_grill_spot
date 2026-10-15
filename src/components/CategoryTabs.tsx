import React from 'react';
import { CATEGORIES } from '../data/menuData.ts';

interface CategoryTabsProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <div className="sticky top-[86px] z-20 bg-white border-b border-zinc-100 shadow-xs">
      <div className="flex items-center space-x-2 overflow-x-auto px-4 py-3 no-scrollbar scroll-smooth">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`text-sm font-semibold transition-all whitespace-nowrap px-4 py-2 rounded-lg cursor-pointer select-none active:scale-95 ${
                isActive
                  ? 'bg-[#E32626] text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80 bg-transparent'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};
