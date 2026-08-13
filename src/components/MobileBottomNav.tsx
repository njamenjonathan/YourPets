import React from 'react';
import { Home, Compass, Heart, ShoppingBag, User } from 'lucide-react';
import { usePetStore } from '../context/PetStoreContext';

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, wishlist, cart, currentUser, setIsAuthModalOpen } = usePetStore();

  const cartCount = cart.length;
  const wishlistCount = wishlist.length;

  return (
    <nav className="liquid-glass liquid-glass-strong liquid-dock md:hidden fixed bottom-0 left-0 right-0 z-50 px-2 py-2 flex justify-around items-center">
      <button
        onClick={() => setActiveTab('home')}
        className={`liquid-dock-item flex flex-col items-center justify-center p-1.5 rounded-xl ${
          activeTab === 'home' ? 'is-active text-[#002045] dark:text-white font-bold' : 'text-on-surface-variant'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Home</span>
      </button>

      <button
        onClick={() => setActiveTab('browse')}
        className={`liquid-dock-item flex flex-col items-center justify-center p-1.5 rounded-xl ${
          activeTab === 'browse' ? 'is-active text-[#002045] dark:text-white font-bold' : 'text-on-surface-variant'
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
        className={`liquid-dock-item relative flex flex-col items-center justify-center p-1.5 rounded-xl ${
          activeTab === 'wishlist' ? 'is-active text-[#002045] dark:text-white font-bold' : 'text-on-surface-variant'
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
        className={`liquid-dock-item relative flex flex-col items-center justify-center p-1.5 rounded-xl ${
          activeTab === 'cart' ? 'is-active text-[#002045] dark:text-white font-bold' : 'text-on-surface-variant'
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
        className={`liquid-dock-item flex flex-col items-center justify-center p-1.5 rounded-xl ${
          activeTab === 'dashboard' ? 'is-active text-[#002045] dark:text-white font-bold' : 'text-on-surface-variant'
        }`}
      >
        <User className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Profile</span>
      </button>
    </nav>
  );
};
