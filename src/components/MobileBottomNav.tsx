import React from 'react';
import { Home, Compass, Heart, ShoppingBag, User } from 'lucide-react';
import { usePetStore } from '../context/PetStoreContext';

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, wishlist, cart, currentUser, setIsAuthModalOpen } = usePetStore();

  const cartCount = cart.length;
  const wishlistCount = wishlist.length;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#1a1c1e]/95 backdrop-blur-md border-t border-outline-variant/30 px-2 py-2 flex justify-around items-center shadow-lg">
      <button
        onClick={() => setActiveTab('home')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-colors ${
          activeTab === 'home' ? 'text-[#002045] dark:text-white font-bold bg-surface-low dark:bg-surface-high' : 'text-on-surface-variant'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Home</span>
      </button>

      <button
        onClick={() => setActiveTab('browse')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-colors ${
          activeTab === 'browse' ? 'text-[#002045] dark:text-white font-bold bg-surface-low dark:bg-surface-high' : 'text-on-surface-variant'
        }`}
      >
        <Compass className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Browse</span>
      </button>

      <button
        onClick={() => {
          if (!currentUser?.isLoggedIn) {
            setIsAuthModalOpen(true);
          } else {
            setActiveTab('wishlist');
          }
        }}
        className={`relative flex flex-col items-center justify-center p-1.5 rounded-xl transition-colors ${
          activeTab === 'wishlist' ? 'text-[#002045] dark:text-white font-bold bg-surface-low dark:bg-surface-high' : 'text-on-surface-variant'
        }`}
      >
        <Heart className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Wishlist</span>
        {wishlistCount > 0 && (
          <span className="absolute top-1 right-3 w-4 h-4 bg-rose-500 text-white font-bold text-[9px] rounded-full flex items-center justify-center">
            {wishlistCount}
          </span>
        )}
      </button>

      <button
        onClick={() => {
          if (!currentUser?.isLoggedIn) {
            setIsAuthModalOpen(true);
          } else {
            setActiveTab('cart');
          }
        }}
        className={`relative flex flex-col items-center justify-center p-1.5 rounded-xl transition-colors ${
          activeTab === 'cart' ? 'text-[#002045] dark:text-white font-bold bg-surface-low dark:bg-surface-high' : 'text-on-surface-variant'
        }`}
      >
        <ShoppingBag className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Cart</span>
        {cartCount > 0 && (
          <span className="absolute top-1 right-3 w-4 h-4 bg-emerald-600 text-white font-bold text-[9px] rounded-full flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>

      <button
        onClick={() => setActiveTab('dashboard')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-colors ${
          activeTab === 'dashboard' ? 'text-[#002045] dark:text-white font-bold bg-surface-low dark:bg-surface-high' : 'text-on-surface-variant'
        }`}
      >
        <User className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Profile</span>
      </button>
    </nav>
  );
};
