import React from 'react';
import { Menu, Search, ChevronDown, Bike, Store } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';

interface HeaderProps {
  onOpenMenu: () => void;
  onOpenSearch: () => void;
  onOpenBranchPicker: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMenu,
  onOpenSearch,
  onOpenBranchPicker,
}) => {
  const { selectedBranch, orderType } = useCart();

  return (
    <header className="bg-[#E32626] text-white sticky top-0 z-30 shadow-md">
      {/* Top Phone Status bar simulation for mobile preview fidelity */}
      <div className="flex items-center justify-between px-5 pt-2 text-xs font-semibold tracking-wider opacity-90 select-none">
        <span>10:08</span>
        <div className="flex items-center space-x-1.5">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L12 22l7.03-4.39C20.26 16.07 21 14.12 21 12c0-4.97-4.03-9-9-9zm0 13.5a4.5 4.5 0 110-9 4.5 4.5 0 010 9z" />
          </svg>
          <div className="flex items-center space-x-0.5 border border-white/60 rounded px-1 py-0.2 text-[10px]">
            <span>33</span>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="flex items-center justify-between px-4 py-2.5">
        <button
          onClick={onOpenMenu}
          aria-label="Open Navigation Menu"
          className="p-1 -ml-1 text-white hover:bg-white/10 active:scale-95 rounded-lg transition-all focus:outline-none"
        >
          <Menu className="w-6 h-6 stroke-[2.2]" />
        </button>

        <button
          onClick={onOpenBranchPicker}
          className="flex-1 mx-3 text-left focus:outline-none group"
        >
          <div className="flex items-center space-x-1 text-[11px] font-normal text-white/90">
            {orderType === 'pickup' ? (
              <Store className="w-3 h-3 inline mr-0.5" />
            ) : (
              <Bike className="w-3 h-3 inline mr-0.5" />
            )}
            <span className="capitalize">{orderType === 'pickup' ? 'Pick-Up From' : 'Delivery To'}</span>
            <ChevronDown className="w-3 h-3 transition-transform group-hover:translate-y-0.5" />
          </div>
          <div className="text-[14px] font-bold tracking-tight text-white truncate max-w-[240px]">
            {selectedBranch.name}
          </div>
        </button>

        <button
          onClick={onOpenSearch}
          aria-label="Search Menu"
          className="p-1.5 -mr-1 text-white hover:bg-white/10 active:scale-95 rounded-lg transition-all focus:outline-none"
        >
          <Search className="w-5 h-5 stroke-[2.4]" />
        </button>
      </div>
    </header>
  );
};
