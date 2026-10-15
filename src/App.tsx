/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { AuthProvider } from './context/AuthContext.tsx';
import { CartProvider, useCart } from './context/CartContext.tsx';
import { Header } from './components/Header.tsx';
import { HeroBanner } from './components/HeroBanner.tsx';
import { CategoryTabs } from './components/CategoryTabs.tsx';
import { MenuItemCard } from './components/MenuItemCard.tsx';
import { BottomCartBar } from './components/BottomCartBar.tsx';
import { ItemCustomizeModal } from './components/ItemCustomizeModal.tsx';
import { SideDrawer } from './components/SideDrawer.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { OrderConfirmationModal } from './components/OrderConfirmationModal.tsx';
import { OrdersModal } from './components/OrdersModal.tsx';
import { AddressesModal } from './components/AddressesModal.tsx';
import { FavouritesModal } from './components/FavouritesModal.tsx';
import { ImagesModal } from './components/ImagesModal.tsx';
import { BranchPickerModal } from './components/BranchPickerModal.tsx';
import { SearchModal } from './components/SearchModal.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { MENU_ITEMS } from './data/menuData.ts';
import { MenuItem, OrderRecord } from './types.ts';
import { Smartphone, Monitor } from 'lucide-react';

function FoodOrderingApp() {
  const [activeCategory, setActiveCategory] = useState('Deals');
  const [selectedItemForCustomize, setSelectedItemForCustomize] = useState<MenuItem | null>(null);

  // Modals state
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isBranchPickerOpen, setIsBranchPickerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isAddressesOpen, setIsAddressesOpen] = useState(false);
  const [isFavouritesOpen, setIsFavouritesOpen] = useState(false);
  const [isImagesOpen, setIsImagesOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);

  // Device mockup view toggle for desktop viewers
  const [phoneFrameMode, setPhoneFrameMode] = useState(true);

  // Filter items based on active category
  const filteredItems = useMemo(() => {
    if (activeCategory === 'Deals') {
      return MENU_ITEMS.filter((i) => i.category === 'Deals' || i.discountBadge);
    }
    if (activeCategory === 'New Arrival') {
      return MENU_ITEMS.filter((i) => i.tagBadge === 'New');
    }
    return MENU_ITEMS.filter((i) => i.category.toLowerCase() === activeCategory.toLowerCase());
  }, [activeCategory]);

  const handleOrderConfirmed = (order: OrderRecord) => {
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setConfirmedOrder(order);
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-900 flex flex-col items-center justify-start md:py-6 md:px-4">
      {/* Top Desktop Helper Toolbar */}
      <div className="w-full max-w-md hidden md:flex items-center justify-between pb-3 text-xs text-zinc-400 select-none px-1">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <span className="font-semibold text-white">The Grill Spot</span>
        </div>
        <div className="flex items-center space-x-1 bg-zinc-800 p-1 rounded-lg border border-zinc-700">
          <button
            onClick={() => setPhoneFrameMode(true)}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
              phoneFrameMode ? 'bg-[#E32626] text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile View</span>
          </button>
          <button
            onClick={() => setPhoneFrameMode(false)}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
              !phoneFrameMode ? 'bg-[#E32626] text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Full Width</span>
          </button>
        </div>
      </div>

      {/* Main Mobile App Container */}
      <main
        className={`w-full bg-[#FFFFFF] min-h-screen relative flex flex-col transition-all overflow-x-hidden ${
          phoneFrameMode
            ? 'max-w-md md:rounded-3xl md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] md:border-[6px] md:border-zinc-800 overflow-hidden'
            : 'max-w-xl'
        }`}
      >
        {/* Top Header */}
        <Header
          onOpenMenu={() => setIsSideDrawerOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenBranchPicker={() => setIsBranchPickerOpen(true)}
        />

        {/* Hero Carousel */}
        <HeroBanner
          onSelectBannerPromo={(bannerId) => {
            if (bannerId === 'b1') {
              const item = MENU_ITEMS.find((i) => i.id === 'wedded-sheikh-deal');
              if (item) setSelectedItemForCustomize(item);
            } else if (bannerId === 'b3') {
              const item = MENU_ITEMS.find((i) => i.id === 'crispy-situation-mint');
              if (item) setSelectedItemForCustomize(item);
            } else {
              setIsCartOpen(true);
            }
          }}
        />

        {/* Category Tabs */}
        <CategoryTabs
          activeCategory={activeCategory}
          onSelectCategory={(cat) => setActiveCategory(cat)}
        />

        {/* Menu Section Heading */}
        <div className="px-4 pt-4 pb-1">
          <h1 className="text-xl font-extrabold text-zinc-900 tracking-tight">
            {activeCategory}
          </h1>
        </div>

        {/* Menu Items List */}
        <div className="flex-1 pb-28 divide-y divide-zinc-100">
          {filteredItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              onSelect={(it) => setSelectedItemForCustomize(it)}
            />
          ))}

          {/* Show additional categories below if in Deals */}
          {activeCategory === 'Deals' && (
            <div className="pt-4">
              <div className="px-4 py-2 bg-zinc-50 border-y border-zinc-100">
                <h2 className="text-sm font-black uppercase tracking-wider text-zinc-500">
                  More Popular Burgers
                </h2>
              </div>
              {MENU_ITEMS.filter((i) => i.category === 'Beef Burgers').map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onSelect={(it) => setSelectedItemForCustomize(it)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Sticky Floating Bottom Cart Bar (Image 6) */}
        <BottomCartBar onOpenCart={() => setIsCartOpen(true)} />

        {/* Customization Bottom Sheet Modal (Image 5) */}
        <ItemCustomizeModal
          item={selectedItemForCustomize}
          onClose={() => setSelectedItemForCustomize(null)}
        />

        {/* Side Drawer Menu (Image 2) */}
        <SideDrawer
          isOpen={isSideDrawerOpen}
          onClose={() => setIsSideDrawerOpen(false)}
          onOpenAddresses={() => setIsAddressesOpen(true)}
          onOpenOrders={() => setIsOrdersOpen(true)}
          onOpenFavourites={() => setIsFavouritesOpen(true)}
          onOpenImages={() => setIsImagesOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
        />

        {/* Cart Drawer Screen (Image 3) */}
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          onProceedToCheckout={() => {
            setIsCartOpen(false);
            setIsCheckoutOpen(true);
          }}
          onOpenBranchPicker={() => setIsBranchPickerOpen(true)}
          onSelectMenuItem={(it) => {
            setIsCartOpen(false);
            setSelectedItemForCustomize(it);
          }}
        />

        {/* Checkout Modal Screen (Image 4) */}
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          onOrderSuccess={handleOrderConfirmed}
        />

        {/* Order Confirmed Screen */}
        <OrderConfirmationModal
          order={confirmedOrder}
          onClose={() => setConfirmedOrder(null)}
          onViewOrders={() => {
            setConfirmedOrder(null);
            setIsOrdersOpen(true);
          }}
        />

        {/* My Orders Screen */}
        <OrdersModal
          isOpen={isOrdersOpen}
          onClose={() => setIsOrdersOpen(false)}
        />

        {/* My Addresses Screen */}
        <AddressesModal
          isOpen={isAddressesOpen}
          onClose={() => setIsAddressesOpen(false)}
        />

        {/* My Favourites Screen */}
        <FavouritesModal
          isOpen={isFavouritesOpen}
          onClose={() => setIsFavouritesOpen(false)}
          onSelectItem={(it) => setSelectedItemForCustomize(it)}
        />

        {/* Saved Images Screen (Cloudflare D1 SQL) */}
        <ImagesModal
          isOpen={isImagesOpen}
          onClose={() => setIsImagesOpen(false)}
        />

        {/* Branch / Pick-up / Delivery Picker */}
        <BranchPickerModal
          isOpen={isBranchPickerOpen}
          onClose={() => setIsBranchPickerOpen(false)}
        />

        {/* Search Modal */}
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onSelectItem={(it) => setSelectedItemForCustomize(it)}
        />

        {/* Firebase Authentication Modal */}
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
        />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <FoodOrderingApp />
      </CartProvider>
    </AuthProvider>
  );
}
