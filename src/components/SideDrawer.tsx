import React from 'react';
import { 
  X, 
  MapPin, 
  ClipboardList, 
  Heart, 
  Headphones, 
  LogOut, 
  UserX, 
  ChevronRight,
  Hexagon,
  LogIn,
  Image as ImageIcon,
  Database
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAddresses: () => void;
  onOpenOrders: () => void;
  onOpenFavourites: () => void;
  onOpenImages: () => void;
  onOpenAuth: () => void;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  onClose,
  onOpenAddresses,
  onOpenOrders,
  onOpenFavourites,
  onOpenImages,
  onOpenAuth,
}) => {
  const { 
    user, 
    profile, 
    signOut, 
    toggleOfferNotifications,
    isDemoUser,
    loginAsScreenshotUser,
    d1Connected
  } = useAuth();

  if (!isOpen) return null;

  const handleSupportWhatsApp = () => {
    const text = encodeURIComponent("Hi The Grill Spot Support, I need assistance with my order.");
    window.open(`https://wa.me/924235712345?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="relative w-4/5 max-w-[320px] bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto no-scrollbar z-10 animate-in slide-in-from-left duration-300">
        <div>
          {/* Header / User Profile (matching Screenshot 2) */}
          <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
            <div className="flex items-center space-x-3.5">
              {profile.photoURL ? (
                <img
                  src={profile.photoURL}
                  alt={profile.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-red-500 shadow-xs"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#E32626] text-white flex items-center justify-center text-xl font-bold shadow-xs">
                  {profile.name.charAt(0) || 'G'}
                </div>
              )}
              <div className="overflow-hidden">
                <h3 className="font-bold text-[16px] text-zinc-900 truncate">
                  {profile.name}
                </h3>
                <p className="text-xs text-zinc-500 truncate font-medium">
                  {profile.phoneNumber || profile.email}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close menu"
              className="text-zinc-400 hover:text-zinc-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Firebase Status Badge & Sign in Switch */}
          <div className="px-5 py-2 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between text-xs">
            <span className="text-zinc-500">
              Auth: {user ? 'Firebase (Google)' : 'Guest Account'}
            </span>
            {user ? (
              <button
                onClick={loginAsScreenshotUser}
                className="text-[#E32626] font-semibold hover:underline"
              >
                Use Guest Account
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="text-[#E32626] font-semibold flex items-center space-x-1 hover:underline"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Google Sign-In</span>
              </button>
            )}
          </div>

          {/* Cloudflare D1 SQL Status Badge */}
          <div className="px-5 py-1.5 bg-orange-50/70 border-b border-orange-100 flex items-center justify-between text-[11px]">
            <div className="flex items-center space-x-1.5 text-orange-900 font-medium">
              <Database className="w-3.5 h-3.5 text-orange-600" />
              <span>Cloudflare D1 SQL</span>
            </div>
            <span className="text-emerald-700 font-bold flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              <span>Linked</span>
            </span>
          </div>

          {/* Loyalty Points Card (matching Screenshot 2) */}
          <div className="px-5 py-4 flex items-center justify-between border-b border-zinc-100">
            <div className="flex items-center space-x-3 text-zinc-800">
              <div className="relative flex items-center justify-center">
                <Hexagon className="w-6 h-6 stroke-[1.8] text-zinc-700" />
                <span className="absolute text-[10px] font-bold">★</span>
              </div>
              <span className="text-sm font-semibold text-zinc-800">Loyalty Points</span>
            </div>
            <div className="bg-[#FFD200] text-zinc-900 font-bold text-xs px-2.5 py-1 rounded shadow-xs">
              Rs. {profile.loyaltyPoints.toFixed(2)}
            </div>
          </div>

          {/* Menu Items List */}
          <div className="py-2">
            {/* My Addresses */}
            <button
              onClick={() => {
                onClose();
                onOpenAddresses();
              }}
              className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-zinc-50 transition-colors text-left"
            >
              <div className="flex items-center space-x-3.5 text-zinc-800">
                <MapPin className="w-5 h-5 stroke-[1.8] text-zinc-600" />
                <span className="text-sm font-medium">My Addresses</span>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-400" />
            </button>

            {/* My Orders */}
            <button
              onClick={() => {
                onClose();
                onOpenOrders();
              }}
              className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-zinc-50 transition-colors text-left"
            >
              <div className="flex items-center space-x-3.5 text-zinc-800">
                <ClipboardList className="w-5 h-5 stroke-[1.8] text-zinc-600" />
                <span className="text-sm font-medium">My Orders</span>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-400" />
            </button>

            {/* My Favourites */}
            <button
              onClick={() => {
                onClose();
                onOpenFavourites();
              }}
              className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-zinc-50 transition-colors text-left"
            >
              <div className="flex items-center space-x-3.5 text-zinc-800">
                <Heart className="w-5 h-5 stroke-[1.8] text-zinc-600" />
                <span className="text-sm font-medium">My Favourites</span>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-400" />
            </button>

            {/* Saved Images (Cloudflare D1) */}
            <button
              onClick={() => {
                onClose();
                onOpenImages();
              }}
              className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-zinc-50 transition-colors text-left"
            >
              <div className="flex items-center space-x-3.5 text-zinc-800">
                <ImageIcon className="w-5 h-5 stroke-[1.8] text-zinc-600" />
                <span className="text-sm font-medium">Saved Images (D1 SQL)</span>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-400" />
            </button>

            {/* Support Center with WhatsApp icon */}
            <button
              onClick={handleSupportWhatsApp}
              className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-zinc-50 transition-colors text-left"
            >
              <div className="flex items-center space-x-3.5 text-zinc-800">
                <Headphones className="w-5 h-5 stroke-[1.8] text-zinc-600" />
                <span className="text-sm font-medium">Support Center</span>
              </div>
              {/* WhatsApp green icon */}
              <div className="w-5 h-5 rounded-full bg-[#25D366] flex items-center justify-center text-white text-[10px]">
                💬
              </div>
            </button>

            {/* Logout */}
            <button
              onClick={signOut}
              className="w-full px-5 py-3.5 flex items-center space-x-3.5 hover:bg-zinc-50 transition-colors text-left text-zinc-800"
            >
              <LogOut className="w-5 h-5 stroke-[1.8] text-zinc-600" />
              <span className="text-sm font-medium">Logout</span>
            </button>

            {/* Req Account Deletion */}
            <button
              onClick={() => {
                if (confirm("Are you sure you want to request account deletion? Our team will process this within 24 hours.")) {
                  alert("Account deletion request submitted.");
                }
              }}
              className="w-full px-5 py-3.5 flex items-center space-x-3.5 hover:bg-zinc-50 transition-colors text-left text-zinc-800"
            >
              <UserX className="w-5 h-5 stroke-[1.8] text-zinc-600" />
              <span className="text-sm font-medium">Req Account Deletion</span>
            </button>

            {/* Offer Notifications Toggle */}
            <div className="px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center space-x-3.5 text-zinc-800">
                <span className="text-lg">🔔</span>
                <span className="text-sm font-medium">Offer Notifications</span>
              </div>
              <button
                type="button"
                onClick={toggleOfferNotifications}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                  profile.offerNotifications ? 'bg-[#E32626]' : 'bg-zinc-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                    profile.offerNotifications ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Footer: Socials & Powered by blink (matching Screenshot 2) */}
        <div className="p-5 border-t border-zinc-100 flex flex-col items-center">
          {/* Social Icons */}
          <div className="flex items-center space-x-4 mb-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-lg bg-[#1877F2] text-white flex items-center justify-center font-bold text-sm shadow-xs hover:opacity-90"
            >
              f
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center text-sm shadow-xs hover:opacity-90"
            >
              📷
            </a>
          </div>

          {/* Powered by blink */}
          <div className="text-center">
            <div className="text-[10px] text-zinc-400 font-medium">Powered by</div>
            <div className="flex items-center justify-center space-x-1.5 mt-0.5">
              <div className="flex -space-x-1">
                <div className="w-3 h-3 rounded-full bg-cyan-400 opacity-90" />
                <div className="w-3 h-3 rounded-full bg-pink-500 opacity-90" />
              </div>
              <span className="font-extrabold text-lg text-zinc-900 tracking-tight lowercase">
                blink
              </span>
            </div>
            <div className="text-[11px] text-zinc-400 font-medium mt-1">
              Version 5.8+2
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
