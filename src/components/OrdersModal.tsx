import React, { useEffect, useState } from 'react';
import { ChevronLeft, Package, Clock, Repeat, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useCart } from '../context/CartContext.tsx';
import { db, handleFirestoreError, OperationType } from '../firebase.ts';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { OrderRecord } from '../types.ts';
import { MENU_ITEMS } from '../data/menuData.ts';
import { d1Service } from '../services/d1Service.ts';

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrdersModal: React.FC<OrdersModalProps> = ({ isOpen, onClose }) => {
  const { user, profile } = useAuth();
  const { addToCart } = useCart();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const fetchOrders = async () => {
      setLoading(true);
      try {
        // 1. Fetch from Cloudflare D1 SQL
        const currentUid = user ? user.uid : profile.id;
        const d1Orders = await d1Service.getOrders(currentUid);
        if (d1Orders.length > 0) {
          setOrders(d1Orders);
          setLoading(false);
          return;
        }

        // 2. Fetch from Firestore if Firebase user
        if (user) {
          const path = 'orders';
          try {
            const q = query(collection(db, path), where('userId', '==', user.uid));
            const snap = await getDocs(q);
            const fetched: OrderRecord[] = [];
            snap.forEach((doc) => {
              fetched.push(doc.data() as OrderRecord);
            });
            if (fetched.length > 0) {
              setOrders(fetched.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
              setLoading(false);
              return;
            }
          } catch (error) {
            handleFirestoreError(error, OperationType.LIST, path);
          }
        }

        // Local storage fallback
        const local = JSON.parse(localStorage.getItem('grillspot_orders') || localStorage.getItem('smash_orders') || '[]');
        setOrders(local);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isOpen, user, profile]);

  if (!isOpen) return null;

  const handleReorder = (order: OrderRecord) => {
    order.items.forEach((item) => {
      const match = MENU_ITEMS.find((m) => m.name.toLowerCase() === item.name.toLowerCase()) || MENU_ITEMS[0];
      addToCart(match, item.quantity, { preference: item.details }, []);
    });
    onClose();
  };

  const getStatusBadge = (status: OrderRecord['status']) => {
    switch (status) {
      case 'placed':
        return <span className="bg-blue-100 text-blue-700 font-bold text-[10px] px-2 py-0.5 rounded-full">Order Placed</span>;
      case 'preparing':
        return <span className="bg-amber-100 text-amber-700 font-bold text-[10px] px-2 py-0.5 rounded-full">In Kitchen</span>;
      case 'ready':
        return <span className="bg-purple-100 text-purple-700 font-bold text-[10px] px-2 py-0.5 rounded-full">Ready for Pick-Up</span>;
      case 'completed':
        return <span className="bg-green-100 text-green-700 font-bold text-[10px] px-2 py-0.5 rounded-full">Completed</span>;
      default:
        return <span className="bg-zinc-100 text-zinc-700 font-bold text-[10px] px-2 py-0.5 rounded-full">{status}</span>;
    }
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
          <h1 className="text-lg font-bold tracking-tight">My Orders</h1>
          <div className="w-6" />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3 pb-8">
          {loading ? (
            <div className="py-20 text-center text-xs text-zinc-400">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-12 h-12 text-zinc-300 mx-auto mb-2" />
              <div className="font-bold text-sm text-zinc-800">No past orders</div>
              <div className="text-xs text-zinc-500 mt-1">Your delicious orders will appear here.</div>
            </div>
          ) : (
            orders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white border border-zinc-200/80 rounded-2xl p-4 shadow-2xs hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                  <div>
                    <span className="font-bold text-sm text-zinc-900">#{ord.id}</span>
                    <div className="flex items-center space-x-1 text-[11px] text-zinc-400 mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(ord.createdAt).toLocaleDateString()} at {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                  {getStatusBadge(ord.status)}
                </div>

                <div className="py-2.5 space-y-1.5 border-b border-zinc-100">
                  {ord.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-xs">
                      <span className="text-zinc-700">
                        <span className="font-bold text-zinc-900">{it.quantity}x</span> {it.name}
                      </span>
                      <span className="font-semibold text-zinc-900">
                        Rs. {(it.price * it.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="text-[11px] text-zinc-500 flex items-center space-x-1 pt-1">
                    <MapPin className="w-3 h-3 text-[#E32626]" />
                    <span className="truncate">{ord.branch}</span>
                  </div>
                </div>

                <div className="pt-2.5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase text-zinc-400 font-bold">Total Paid</span>
                    <div className="text-sm font-black text-zinc-900">Rs. {ord.grandTotal.toFixed(2)}</div>
                  </div>
                  <button
                    onClick={() => handleReorder(ord)}
                    className="flex items-center space-x-1.5 text-xs font-bold text-[#E32626] bg-red-50 hover:bg-red-100 active:scale-95 px-3 py-1.5 rounded-lg transition-all"
                  >
                    <Repeat className="w-3.5 h-3.5" />
                    <span>Reorder</span>
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
