import React, { useState } from 'react';
import { X, ShieldCheck, CreditCard, Lock, CheckCircle2, Clock } from 'lucide-react';
import { usePetStore } from '../context/PetStoreContext';

export const ReserveModal: React.FC = () => {
  const {
    isReserveModalOpen,
    reservePetTarget: pet,
    closeReserveModal,
    formatPrice,
    placeOrder,
    setActiveTab
  } = usePetStore();

  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  if (!isReserveModalOpen || !pet) return null;

  const depositAmount = 50;

  const handleSubmitReserve = (e: React.FormEvent) => {
    e.preventDefault();
    const createdOrder = placeOrder({
      customerName: customerName || 'Valued Client',
      deliveryAddress: deliveryAddress || '123 Luxury Way, Beverly Hills, CA',
      phone: phone || '+1 (310) 555-0192',
      paymentMethod: 'Refundable Reservation Deposit ($50)',
      depositPaid: true,
      depositAmount: depositAmount
    });
    closeReserveModal();
    setActiveTab('order-tracking');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#1a1c1e] rounded-3xl shadow-2xl border border-outline-variant/30 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 bg-[#002045] text-white flex justify-between items-center">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">7-Day VIP Hold</span>
            <h2 className="font-serif-display font-bold text-xl">Reserve {pet.name} ({pet.breed})</h2>
          </div>
          <button onClick={closeReserveModal} className="p-1.5 rounded-full hover:bg-white/10 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitReserve} className="p-6 space-y-4">
          <div className="p-4 rounded-2xl bg-surface-low dark:bg-surface-high border border-outline-variant/30 flex items-center gap-4">
            <img src={pet.images[0]} alt={pet.name} className="w-16 h-16 rounded-xl object-cover" />
            <div className="text-xs">
              <h4 className="font-bold text-sm text-on-surface">{pet.breed}</h4>
              <p className="text-on-surface-variant">Full Price: <strong>{formatPrice(pet.priceUSD)}</strong></p>
              <p className="text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Deposit: $50 (Fully Refundable)
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-on-surface mb-1">Full Legal Name</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Lady Eleanor Vance"
                className="w-full p-2.5 rounded-xl border border-outline-variant bg-white dark:bg-[#282c31] text-on-surface"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-on-surface mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full p-2.5 rounded-xl border border-outline-variant bg-white dark:bg-[#282c31] text-on-surface"
                />
              </div>
              <div>
                <label className="block font-semibold text-on-surface mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full p-2.5 rounded-xl border border-outline-variant bg-white dark:bg-[#282c31] text-on-surface"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-on-surface mb-1">Delivery Destination City & State</label>
              <input
                type="text"
                required
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="e.g. Beverly Hills, CA"
                className="w-full p-2.5 rounded-xl border border-outline-variant bg-white dark:bg-[#282c31] text-on-surface"
              />
            </div>
          </div>

          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2">
            <Lock className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p>Your $50 deposit reserves {pet.name} exclusively for 7 days. Remaining balance is due prior to climate transport or upon arrival.</p>
          </div>

          <button
            type="submit"
            className="w-full bg-[#002045] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#1a365d] transition-colors flex items-center justify-center gap-2 shadow-lg"
          >
            <CreditCard className="w-4 h-4" /> Confirm $50 Deposit Reservation
          </button>
        </form>
      </div>
    </div>
  );
};
