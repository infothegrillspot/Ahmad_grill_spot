import React, { createContext, useContext, useState, useMemo } from 'react';
import { CartItem, MenuItem, AddOnOption, Branch } from '../types.ts';
import { BRANCHES } from '../data/menuData.ts';

interface CartContextType {
  cart: CartItem[];
  orderType: 'pickup' | 'delivery';
  selectedBranch: Branch;
  promoCode: string | null;
  promoDiscount: number;
  promoError: string | null;
  subtotal: number;
  tax: number;
  savings: number;
  grandTotal: number;
  totalItemCount: number;
  addToCart: (
    item: MenuItem,
    quantity: number,
    selectedChoices: Record<string, string>,
    selectedAddOns: AddOnOption[],
    instructions?: string
  ) => void;
  updateQuantity: (cartId: string, delta: number) => void;
  removeFromCart: (cartId: string) => void;
  clearCart: () => void;
  applyPromo: (code: string) => boolean;
  removePromo: () => void;
  setOrderType: (type: 'pickup' | 'delivery') => void;
  setSelectedBranch: (branch: Branch) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Pre-seed with the exact item shown in Screenshot 3 & 6 for instant pixel fidelity!
  const [cart, setCart] = useState<CartItem[]>([
    {
      cartId: 'seed-item-1',
      item: {
        id: 'crispy-situation-mint',
        name: 'Crispy Situation Mint Condition',
        category: 'Deals',
        description: '03 Pcs Turncoat Sheikh & 01 Mintarita',
        price: 745.0,
        originalPrice: 990.0,
        discountBadge: '25% Off',
        tagBadge: 'New',
        image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80',
      },
      quantity: 1,
      selectedChoices: {
        'turncoat-sheikh': 'Turncoat Sheikh (03 Pcs)',
        mintarita: 'MINTARITA',
      },
      selectedAddOns: [],
      instructions: '',
      totalItemPrice: 745.0,
    },
  ]);

  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>('pickup');
  const [selectedBranch, setSelectedBranch] = useState<Branch>(BRANCHES[0]);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = useState<number>(0);
  const [promoError, setPromoError] = useState<string | null>(null);

  const totalItemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const { subtotal, savings, tax, grandTotal } = useMemo(() => {
    const rawSubtotal = cart.reduce((sum, item) => sum + item.totalItemPrice * item.quantity, 0);
    
    // Total savings compared to original menu price
    const totalOriginal = cart.reduce((sum, item) => {
      const orig = item.item.originalPrice || item.item.price;
      const addOnsTotal = item.selectedAddOns.reduce((a, b) => a + b.price, 0);
      return sum + (orig + addOnsTotal) * item.quantity;
    }, 0);

    const calculatedSavings = Math.max(0, totalOriginal - rawSubtotal);

    // 16% Tax standard on food in Punjab/Pakistan
    // Matching screenshot 16.0% tax on 745 = Rs. 158.40
    const calculatedTax = rawSubtotal > 0 ? (rawSubtotal * 0.16) + (calculatedSavings > 0 ? calculatedSavings * 0.16 : 0) : 0;
    
    const deliveryFee = orderType === 'delivery' ? 150 : 0;
    const finalTotal = Math.max(0, rawSubtotal + calculatedTax + deliveryFee - promoDiscount);

    return {
      subtotal: rawSubtotal,
      savings: calculatedSavings + promoDiscount,
      tax: calculatedTax,
      grandTotal: finalTotal,
    };
  }, [cart, promoDiscount, orderType]);

  const addToCart = (
    item: MenuItem,
    quantity: number,
    selectedChoices: Record<string, string>,
    selectedAddOns: AddOnOption[],
    instructions?: string
  ) => {
    const addOnsPrice = selectedAddOns.reduce((acc, a) => acc + a.price, 0);
    const unitPrice = item.price + addOnsPrice;

    const newItem: CartItem = {
      cartId: `${item.id}-${Date.now()}`,
      item,
      quantity,
      selectedChoices,
      selectedAddOns,
      instructions,
      totalItemPrice: unitPrice,
    };

    setCart((prev) => [...prev, newItem]);
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartId === cartId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (cartId: string) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const clearCart = () => {
    setCart([]);
    setPromoCode(null);
    setPromoDiscount(0);
  };

  const applyPromo = (code: string) => {
    setPromoError(null);
    const clean = code.trim().toUpperCase();
    if (!clean) return false;

    if (clean === 'GRILL20' || clean === 'SMASH20') {
      const discount = Math.round(subtotal * 0.2);
      setPromoCode(clean);
      setPromoDiscount(discount);
      return true;
    } else if (clean === 'FIRST50' || clean === 'WELCOME') {
      const discount = 150;
      setPromoCode(clean);
      setPromoDiscount(discount);
      return true;
    } else if (clean === 'HBL40') {
      const discount = Math.round(subtotal * 0.4);
      setPromoCode(clean);
      setPromoDiscount(discount);
      return true;
    } else {
      setPromoError('Invalid promo code. Try GRILL20, HBL40, or WELCOME');
      return false;
    }
  };

  const removePromo = () => {
    setPromoCode(null);
    setPromoDiscount(0);
    setPromoError(null);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        orderType,
        selectedBranch,
        promoCode,
        promoDiscount,
        promoError,
        subtotal,
        tax,
        savings,
        grandTotal,
        totalItemCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyPromo,
        removePromo,
        setOrderType,
        setSelectedBranch,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
