import React from 'react';
import { User, ShoppingBag, Heart, ShieldCheck, Mail, LogOut, KeyRound, CheckCircle2 } from 'lucide-react';
import { usePetStore } from '../context/PetStoreContext';

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
      <div className="max-w-2xl mx-auto my-12 p-8 rounded-3xl bg-white dark:bg-[#1f2226] border border-outline-variant/30 text-center space-y-6 shadow-lg animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mx-auto">
          <User className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="font-serif-display font-bold text-2xl md:text-3xl text-on-surface">
            VIP Client Portal & Order History
          </h2>
          <p className="text-xs text-on-surface-variant max-w-md mx-auto">
            Log in to view your baby pet reservations, live flight passports, and saved preferences.
          </p>
        </div>

        {rememberedEmail && (
          <div className="p-4 rounded-2xl bg-surface-low dark:bg-surface-high border border-outline-variant/30 max-w-sm mx-auto text-xs space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Saved Email Address
            </span>
            <p className="font-bold text-on-surface text-sm">{rememberedEmail}</p>
            <p className="text-[11px] text-on-surface-variant">Simply enter password to sign back in</p>
          </div>
        )}

        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="bg-[#002045] text-white px-8 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-[#1a365d] transition-colors shadow-md"
        >
          {rememberedEmail ? 'Enter Password & Sign In' : 'Sign In or Create Account'}
        </button>
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
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1f2226] border border-outline-variant/30 space-y-4 shadow-sm">
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
                      <img src={order.pet.images[0]} alt={order.pet.name} className="w-14 h-14 rounded-xl object-cover" />
                      <div className="text-xs">
                        <h4 className="font-bold text-on-surface">{order.pet.breed} ({order.pet.name})</h4>
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
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1f2226] border border-outline-variant/30 space-y-4 shadow-sm">
            <h3 className="font-serif-display font-bold text-lg text-on-surface flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500" /> Wishlist ({wishlistedPets.length})
            </h3>

            <div className="space-y-2">
              {wishlistedPets.slice(0, 3).map(p => (
                <div key={p.id} className="flex items-center gap-3 text-xs">
                  <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
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

          <div className="p-6 rounded-3xl bg-white dark:bg-[#1f2226] border border-outline-variant/30 space-y-3 text-xs shadow-sm">
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
