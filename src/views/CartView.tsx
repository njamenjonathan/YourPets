import React from 'react';
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';
import { usePetStore } from '../context/PetStoreContext';

export const CartView: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartAddons,
    formatPrice,
    setActiveTab,
    currentUser,
    setIsAuthModalOpen
  } = usePetStore();

  if (!currentUser?.isLoggedIn) {
    return (
      <div className="space-y-8 animate-fade-in pb-16">
        <div className="p-8 rounded-3xl bg-[#002045] text-white">
          <h1 className="font-serif-display font-bold text-3xl">Your Shopping Cart</h1>
        </div>

        <div className="p-16 text-center bg-white dark:bg-[#1f2226] rounded-3xl border border-outline-variant/30 space-y-4 shadow-sm">
          <Lock className="w-16 h-16 mx-auto text-amber-500" />
          <h3 className="font-serif-display font-bold text-2xl text-on-surface">Sign In Required</h3>
          <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
            Only logged in accounts can place orders and view their wishlist and cart.
          </p>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="bg-[#002045] text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#1a365d] transition-colors shadow-md"
          >
            Sign In / Register Account
          </button>
        </div>
      </div>
    );
  }

  const subtotal = cart.reduce((acc, item) => acc + item.pet.priceUSD, 0);
  const addonsTotal = cart.reduce((acc, item) => {
    let add = 0;
    if (item.selectedAddOns.insurance) add += 25;
    if (item.selectedAddOns.starterKit) add += 85;
    if (item.selectedAddOns.vipTransport) add += 150;
    return acc + add;
  }, 0);

  const deliveryCost = cart.length > 0 ? 150 : 0;
  const taxes = Math.round((subtotal + addonsTotal) * 0.08);
  const totalAmount = subtotal + addonsTotal + deliveryCost + taxes;

  if (cart.length === 0) {
    return (
      <div className="space-y-8 animate-fade-in pb-16">
        <div className="p-8 rounded-3xl bg-[#002045] text-white">
          <h1 className="font-serif-display font-bold text-3xl">Your Shopping Cart</h1>
        </div>

        <div className="p-16 text-center bg-white dark:bg-[#1f2226] rounded-3xl border border-outline-variant/30 space-y-4">
          <ShoppingBag className="w-16 h-16 mx-auto text-outline" />
          <h3 className="font-serif-display font-bold text-2xl text-on-surface">Your Cart is Currently Empty</h3>
          <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
            You haven't added any companions to your cart yet. Discover our available health-certified listings!
          </p>
          <button
            onClick={() => setActiveTab('browse')}
            className="bg-[#002045] text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#1a365d] transition-colors"
          >
            Explore Available Pets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      <div className="p-8 rounded-3xl bg-[#002045] text-white flex justify-between items-center shadow-xl">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Checkout Reservation</span>
          <h1 className="font-serif-display font-bold text-3xl md:text-4xl">Shopping Cart</h1>
        </div>
        <span className="text-xl font-bold font-serif-display text-emerald-300">{cart.length} Companion(s)</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => (
            <div
              key={item.pet.id}
              className="p-6 rounded-3xl bg-white dark:bg-[#1f2226] border border-outline-variant/30 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={item.pet.images[0]}
                    alt={item.pet.name}
                    className="w-20 h-20 rounded-2xl object-cover"
                  />
                  <div>
                    <h3 className="font-serif-display font-bold text-lg text-on-surface">
                      {item.pet.breed} ({item.pet.name})
                    </h3>
                    <p className="text-xs text-on-surface-variant">
                      {item.pet.gender} • {item.pet.color} • {item.pet.locationCityState}
                    </p>
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-[11px] mt-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Vet Passport & Health Cert Included
                    </span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto">
                  <span className="font-serif-display font-bold text-xl text-[#002045] dark:text-emerald-400">
                    {formatPrice(item.pet.priceUSD)}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.pet.id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors mt-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Addons Checkboxes in Cart */}
              <div className="pt-4 border-t border-outline-variant/20 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-low dark:bg-surface-high border border-outline-variant/30 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.selectedAddOns.insurance}
                    onChange={(e) => updateCartAddons(item.pet.id, { ...item.selectedAddOns, insurance: e.target.checked })}
                    className="w-4 h-4 rounded text-[#002045]"
                  />
                  <span className="font-semibold text-on-surface">Vet Insurance (+$25)</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-low dark:bg-surface-high border border-outline-variant/30 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.selectedAddOns.starterKit}
                    onChange={(e) => updateCartAddons(item.pet.id, { ...item.selectedAddOns, starterKit: e.target.checked })}
                    className="w-4 h-4 rounded text-[#002045]"
                  />
                  <span className="font-semibold text-on-surface">Starter Kit (+$85)</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-low dark:bg-surface-high border border-outline-variant/30 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.selectedAddOns.vipTransport}
                    onChange={(e) => updateCartAddons(item.pet.id, { ...item.selectedAddOns, vipTransport: e.target.checked })}
                    className="w-4 h-4 rounded text-[#002045]"
                  />
                  <span className="font-semibold text-on-surface">Flight Nanny (+$150)</span>
                </label>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1f2226] border border-outline-variant/30 space-y-4 shadow-sm">
            <h3 className="font-serif-display font-bold text-xl text-on-surface border-b border-outline-variant/30 pb-3">
              Order Summary
            </h3>

            <div className="space-y-2 text-xs text-on-surface-variant">
              <div className="flex justify-between">
                <span>Pets Subtotal</span>
                <span className="font-bold text-on-surface">{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between">
                <span>Selected Package Addons</span>
                <span className="font-bold text-on-surface">{formatPrice(addonsTotal)}</span>
              </div>

              <div className="flex justify-between">
                <span>Climate Flight / Ground Shipping</span>
                <span className="font-bold text-on-surface">{formatPrice(deliveryCost)}</span>
              </div>

              <div className="flex justify-between">
                <span>Estimated Taxes (8%)</span>
                <span className="font-bold text-on-surface">{formatPrice(taxes)}</span>
              </div>

              <div className="flex justify-between text-sm font-bold text-on-surface pt-3 border-t border-outline-variant/30">
                <span>Total Amount</span>
                <span className="font-serif-display text-xl text-[#002045] dark:text-emerald-400">
                  {formatPrice(totalAmount)}
                </span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('checkout')}
              className="w-full bg-[#002045] text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-[#1a365d] transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              Proceed to Secure Checkout <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold pt-2">
              <Lock className="w-3.5 h-3.5" /> 256-bit Encrypted Secure Transaction
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
