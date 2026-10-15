import React from 'react';
import { useCart } from '../context/CartContext.tsx';

interface BottomCartBarProps {
  onOpenCart: () => void;
}

export const BottomCartBar: React.FC<BottomCartBarProps> = ({ onOpenCart }) => {
  const { totalItemCount, subtotal } = useCart();

  if (totalItemCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto p-3 pointer-events-none">
      <div
        onClick={onOpenCart}
        className="pointer-events-auto bg-[#E32626] hover:bg-red-700 active:scale-[0.98] transition-all cursor-pointer rounded-xl px-4 py-3 flex items-center justify-between shadow-xl text-white select-none"
      >
        {/* Left: Count Circle & View Cart */}
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 rounded-full bg-white text-[#E32626] font-black text-xs flex items-center justify-center shadow-xs">
            {totalItemCount}
          </div>
          <span className="font-bold text-[15px] tracking-tight">View Cart</span>
        </div>

        {/* Right: Subtotal & Tax note matching screenshot */}
        <div className="text-right">
          <div className="font-extrabold text-[15px] leading-tight">
            Rs. {subtotal.toFixed(2)}
          </div>
          <div className="text-[10px] text-white/85 font-medium leading-tight">
            Price Exclusive TAX
          </div>
        </div>
      </div>
    </div>
  );
};
