import React from 'react';
import { User, ShoppingBag, Heart, ShieldCheck, Mail, LogOut, KeyRound, CheckCircle2 } from 'lucide-react';
import { usePetStore } from '../context/PetStoreContext';
import { mainPhotoOf } from '../lib/petImages';
import { PetPhoto } from '../components/PetPhoto';
import { SignInRequired } from '../components/SignInRequired';

export const UserDashboardView: React.FC = () => {
  const {
    orders,
    wishlist,
    pets,
    setActiveTab,
    setSelectedOrder,
    currentUser,
    setIsAuthModalOpen,
    logoutUser,
    rememberedEmail
  } = usePetStore();

  const wishlistedPets = pets.filter(p => wishlist.includes(p.id));
  const initials = currentUser?.name
    ? currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'VIP';

  if (!currentUser || !currentUser.isLoggedIn) {
    return (
      <div className="space-y-8 animate-fade-in pb-16">
        <div className="p-8 rounded-3xl bg-[#002045] text-white shadow-xl">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Your account</span>
          <h1 className="font-serif-display font-bold text-3xl md:text-4xl">Orders &amp; reservations</h1>
          <p className="text-xs text-white/80 mt-1">
            {rememberedEmail ? `Signed out — welcome back, ${rememberedEmail}` : 'Sign in to follow your reservations.'}
          </p>
        </div>

        <SignInRequired
          title="Sign in to your account"
          message="See your reservations, delivery updates and saved pets in one place."
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Profile Banner */}
      <div className="p-8 rounded-3xl bg-[#002045] text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-emerald-600 border-2 border-emerald-400 flex items-center justify-center font-serif-display text-2xl md:text-3xl font-bold text-white shadow-md">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                VIP Client Member
              </span>
            </div>
            <h1 className="font-serif-display font-bold text-2xl md:text-3xl mt-1">{currentUser.name}</h1>
            <p className="text-xs text-emerald-200/90 mt-0.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> {currentUser.email} • Member since {currentUser.memberSince || '2026'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="bg-white/10 text-white hover:bg-white/20 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 border border-white/10"
          >
            <KeyRound className="w-3.5 h-3.5" /> Switch Account
          </button>

          <button
            onClick={logoutUser}
            className="bg-rose-500/20 text-rose-200 hover:bg-rose-500/30 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 border border-rose-500/30"
          >
            <LogOut className="w-3.5 h-3.5" /> Log Out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: My Orders */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 rounded-3xl liquid-glass liquid-glass-strong space-y-4">
            <h3 className="font-serif-display font-bold text-xl text-on-surface flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-600" /> My Companion Orders & Reservations
            </h3>

            {orders.length === 0 ? (
              <p className="text-xs text-on-surface-variant py-4">No companion orders placed yet.</p>
            ) : (
              <div className="space-y-3">
                {orders.map(order => (
                  <div
                    key={order.id}
                    className="p-4 rounded-2xl bg-surface-low dark:bg-surface-high border border-outline-variant/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <PetPhoto src={mainPhotoOf(order.pet)} alt={order.pet.breed} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                      <div className="text-xs">
                        <h4 className="font-bold text-on-surface">{order.pet.breed}</h4>
                        <p className="text-on-surface-variant">Order #{order.id} • {order.orderDate}</p>
                        <span className="text-emerald-600 font-semibold">{order.status}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setActiveTab('order-tracking');
                      }}
                      className="bg-[#002045] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#1a365d]"
                    >
                      Track Order & Passport
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Wishlist Preview & Account Quick Settings */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl liquid-glass liquid-glass-strong space-y-4">
            <h3 className="font-serif-display font-bold text-lg text-on-surface flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500" /> Wishlist ({wishlistedPets.length})
            </h3>

            <div className="space-y-2">
              {wishlistedPets.slice(0, 3).map(p => (
                <div key={p.id} className="flex items-center gap-3 text-xs">
                  <PetPhoto src={mainPhotoOf(p)} alt={p.breed} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                  <div>
                    <h5 className="font-bold text-on-surface">{p.breed}</h5>
                    <p className="text-on-surface-variant">${p.priceUSD.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveTab('wishlist')}
              className="w-full py-2 rounded-xl border border-[#002045] text-[#002045] dark:border-white dark:text-white text-xs font-bold"
            >
              View Full Wishlist
            </button>
          </div>

          <div className="p-6 rounded-3xl liquid-glass liquid-glass-strong space-y-3 text-xs">
            <div className="flex items-center gap-2 font-bold text-on-surface">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Account Security Status
            </div>
            <p className="text-on-surface-variant text-[11px]">
              Your email (<strong>{currentUser.email}</strong>) is verified and remembered on this device.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
