import React, { useState } from 'react';
import { Search, X, Plus } from 'lucide-react';
import { MENU_ITEMS } from '../data/menuData.ts';
import { MenuItem } from '../types.ts';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectItem: (item: MenuItem) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectItem,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const results = query.trim()
    ? MENU_ITEMS.filter(
        (m) =>
          m.name.toLowerCase().includes(query.toLowerCase()) ||
          m.description.toLowerCase().includes(query.toLowerCase()) ||
          m.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="fixed inset-0 z-60 flex justify-center bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl relative overflow-hidden animate-in fade-in duration-200">
        {/* Search Header */}
        <div className="p-4 border-b border-zinc-100 flex items-center space-x-3 bg-white">
          <div className="flex-1 flex items-center bg-zinc-100 rounded-xl px-3 py-2.5">
            <Search className="w-4 h-4 text-zinc-400 mr-2 shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search burgers, tenders, drinks..."
              className="w-full bg-transparent text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none font-medium"
            />
            {query && (
              <button onClick={() => setQuery('')} className="p-0.5 text-zinc-400">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-xs font-bold text-zinc-600 hover:text-zinc-900"
          >
            Cancel
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3 pb-8">
          {query.trim() === '' ? (
            <div className="py-8">
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                Suggested Searches
              </div>
              <div className="flex flex-wrap gap-2">
                {['Double Smash', 'Turncoat Sheikh', 'Mintarita', 'Fries', 'Little Sheikh', 'Deals'].map(
                  (tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                    >
                      {tag}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-20 text-zinc-500">
              <span className="text-3xl block mb-2">🔍</span>
              <p className="font-bold text-xs text-zinc-800">No items found for "{query}"</p>
              <p className="text-[11px] text-zinc-400 mt-1">Try searching for "Sheikh", "Burger", or "Tenders"</p>
            </div>
          ) : (
            results.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onClose();
                  onSelectItem(item);
                }}
                className="flex items-center justify-between p-3 rounded-2xl border border-zinc-100 hover:bg-zinc-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-3 min-w-0 pr-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0 border border-zinc-200"
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs text-zinc-900 truncate">{item.name}</h4>
                    <p className="text-[10px] text-zinc-500 line-clamp-1">{item.description}</p>
                    <div className="font-bold text-xs text-zinc-900 mt-0.5">
                      Rs. {item.price.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="w-7 h-7 rounded-full bg-[#E32626] text-white flex items-center justify-center shrink-0">
                  <Plus className="w-4 h-4 stroke-[2.8]" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
