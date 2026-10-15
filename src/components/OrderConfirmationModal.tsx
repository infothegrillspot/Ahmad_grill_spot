import React from 'react';
import { CheckCircle2, Clock, Phone, MapPin, ChefHat, PackageCheck, X } from 'lucide-react';
import { OrderRecord } from '../types.ts';

interface OrderConfirmationModalProps {
  order: OrderRecord | null;
  onClose: () => void;
  onViewOrders: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  onClose,
  onViewOrders,
}) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebration Header */}
        <div className="text-center pt-2">
          <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-3 shadow-sm">
            <CheckCircle2 className="w-9 h-9 stroke-[2.4]" />
          </div>
          <h2 className="text-xl font-black text-zinc-900">Order Confirmed!</h2>
          <p className="text-xs text-zinc-500 mt-1">
            Thank you! Your order <span className="font-bold text-zinc-800">#{order.id}</span> has been sent to the kitchen.
          </p>
        </div>

        {/* Live Status Tracker */}
        <div className="mt-6 bg-zinc-50 rounded-2xl p-4 border border-zinc-100">
          <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-3">
            Kitchen Live Status
          </div>

          <div className="relative pl-6 space-y-4">
            {/* Timeline line */}
            <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-zinc-200" />

            {/* Step 1 */}
            <div className="relative flex items-start space-x-3">
              <div className="absolute -left-6 w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-[10px] font-bold">
                ✓
              </div>
              <div>
                <div className="text-xs font-bold text-zinc-900">Order Placed</div>
                <div className="text-[10px] text-zinc-500">Order received and verified</div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative flex items-start space-x-3">
              <div className="absolute -left-6 w-5 h-5 rounded-full bg-[#E32626] text-white flex items-center justify-center text-[10px] animate-pulse">
                <ChefHat className="w-3 h-3" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#E32626]">In The Kitchen</div>
                <div className="text-[10px] text-zinc-600">Fresh patties sizzling to perfection on the grill</div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative flex items-start space-x-3">
              <div className="absolute -left-6 w-5 h-5 rounded-full bg-zinc-200 text-zinc-400 flex items-center justify-center text-[10px]">
                <PackageCheck className="w-3 h-3" />
              </div>
              <div>
                <div className="text-xs font-bold text-zinc-400">Ready for Pick-Up</div>
                <div className="text-[10px] text-zinc-400">Estimated ~20-25 mins</div>
              </div>
            </div>
          </div>
        </div>

        {/* Branch & Time */}
        <div className="mt-4 p-3 rounded-xl bg-red-50/50 border border-red-100 space-y-1.5 text-xs text-zinc-700">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-[#E32626] shrink-0" />
            <span className="font-semibold text-zinc-900 truncate">{order.branch}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-[#E32626] shrink-0" />
            <span>Estimated time: {order.estimatedTime}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4 text-[#E32626] shrink-0" />
            <span>Store support: +92 42 35712345</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 space-y-2">
          <button
            onClick={() => {
              onClose();
              onViewOrders();
            }}
            className="w-full bg-[#E32626] text-white font-bold py-3 rounded-xl shadow-md text-xs active:scale-98 transition-all hover:bg-red-700"
          >
            View in My Orders
          </button>
          <button
            onClick={onClose}
            className="w-full bg-zinc-100 text-zinc-700 font-bold py-2.5 rounded-xl text-xs hover:bg-zinc-200 active:scale-98 transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};
