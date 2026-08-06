import React from 'react';
import {
  CheckCircle2, Clock, Plane, FileText, Download, ShieldCheck, MapPin, Phone
} from 'lucide-react';
import { usePetStore } from '../context/PetStoreContext';

export const OrderTrackingView: React.FC = () => {
  const { selectedOrder, orders, formatPrice, setActiveTab } = usePetStore();

  const currentOrder = selectedOrder || orders[0];

  if (!currentOrder) {
    return (
      <div className="space-y-8 animate-fade-in pb-16">
        <div className="p-8 rounded-3xl bg-[#002045] text-white">
          <h1 className="font-serif-display font-bold text-3xl">Live Transport & Order Tracking</h1>
        </div>
        <div className="p-16 text-center bg-white dark:bg-[#1f2226] rounded-3xl border border-outline-variant/30 space-y-4">
          <Clock className="w-16 h-16 mx-auto text-outline" />
          <h3 className="font-serif-display font-bold text-2xl text-on-surface">No Active Transport Orders</h3>
          <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
            Place an order or reservation to track real-time climate flight updates and download veterinary passports.
          </p>
          <button
            onClick={() => setActiveTab('browse')}
            className="bg-[#002045] text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider"
          >
            Explore Available Pets
          </button>
        </div>
      </div>
    );
  }

  const steps = [
    { title: 'Payment Confirmed', desc: 'Deposit / Full payment authorized.', done: true },
    { title: 'Vet Pre-Flight Check', desc: 'Final 40-point health inspection & flight clearance.', done: true },
    { title: 'Climate Transport Prepared', desc: 'Temperature-controlled cabin crate initialized.', done: true },
    { title: 'In Transit', desc: 'Accompanied by VIP Nanny en route to destination.', done: false },
    { title: 'Delivered', desc: 'Safely handed over to home address.', done: false }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      <div className="p-8 rounded-3xl bg-[#002045] text-white flex justify-between items-center shadow-xl">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            Tracking #: {currentOrder.trackingNumber}
          </span>
          <h1 className="font-serif-display font-bold text-3xl md:text-4xl">Order #{currentOrder.id}</h1>
        </div>
        <div className="text-right">
          <span className="text-xs text-white/80 block">Estimated Arrival</span>
          <span className="font-serif-display text-xl font-bold text-emerald-300">
            {currentOrder.estimatedDeliveryDate}
          </span>
        </div>
      </div>

      {/* Direct WhatsApp Payment Confirmation Call-to-Action */}
      <div className="p-6 rounded-3xl bg-emerald-600 text-white shadow-lg space-y-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-bold text-lg">
            <ShieldCheck className="w-6 h-6 text-emerald-200" /> WhatsApp Escrow Payment Confirmation
          </div>
          <p className="text-xs text-emerald-100 max-w-xl">
            Order #{currentOrder.id} ({currentOrder.pet.breed} - {currentOrder.pet.name}) total of <strong>{formatPrice(currentOrder.totalAmount)}</strong> is held in 100% money-back escrow. Confirm payment and receive live Flight Nanny videos directly on WhatsApp.
          </p>
        </div>

        <a
          href={`https://wa.me/13305161283?text=${encodeURIComponent(
            `Hello YourPets Concierge, I placed Order #${currentOrder.id} for my baby pet ${currentOrder.pet.name} (${currentOrder.pet.breed}). Total: ${formatPrice(currentOrder.totalAmount)}. I would like to confirm payment details and flight transport schedule!`
          )}`}
          target="_blank"
          rel="noreferrer"
          className="bg-white text-emerald-900 px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-emerald-50 transition-colors shadow-md flex items-center gap-2 whitespace-nowrap"
        >
          <Phone className="w-4 h-4 text-emerald-600" /> Confirm on WhatsApp (+1 330 516-1283) →
        </a>
      </div>

      {/* Progress Timeline */}
      <div className="p-8 rounded-3xl bg-white dark:bg-[#1f2226] border border-outline-variant/30 space-y-8 shadow-sm">
        <h3 className="font-serif-display font-bold text-xl text-on-surface">Live Transport Progress</h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-start gap-2 relative">
              <div className={`p-3 rounded-full ${step.done ? 'bg-emerald-600 text-white' : 'bg-surface-low dark:bg-surface-high text-on-surface-variant'}`}>
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-on-surface">{step.title}</h4>
                <p className="text-[11px] text-on-surface-variant mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Companion Details */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1f2226] border border-outline-variant/30 space-y-4">
          <h3 className="font-serif-display font-bold text-lg text-on-surface">Companion Information</h3>
          <div className="flex items-center gap-4">
            <img src={currentOrder.pet.images[0]} alt={currentOrder.pet.name} className="w-20 h-20 rounded-2xl object-cover" />
            <div className="text-xs">
              <h4 className="font-bold text-base text-on-surface">{currentOrder.pet.breed} ({currentOrder.pet.name})</h4>
              <p className="text-on-surface-variant">{currentOrder.pet.gender} • {currentOrder.pet.color}</p>
              <p className="font-bold text-[#002045] dark:text-emerald-400 mt-1">{formatPrice(currentOrder.totalAmount)}</p>
            </div>
          </div>
        </div>

        {/* Downloads & Health Records */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1f2226] border border-outline-variant/30 space-y-4">
          <h3 className="font-serif-display font-bold text-lg text-on-surface">Official Veterinary Certificates</h3>
          <div className="space-y-2 text-xs">
            <button
              onClick={() => alert('Downloading Veterinary Health Clearance Passport (PDF)...')}
              className="w-full p-3 rounded-xl bg-surface-low dark:bg-surface-high border border-outline-variant/30 flex items-center justify-between font-semibold hover:bg-surface-high transition-colors"
            >
              <span className="flex items-center gap-2"><FileText className="w-4 h-4 text-emerald-600" /> Veterinary Health Clearance Passport.pdf</span>
              <Download className="w-4 h-4 text-on-surface" />
            </button>

            <button
              onClick={() => alert('Downloading Pedigree & Microchip Registration (PDF)...')}
              className="w-full p-3 rounded-xl bg-surface-low dark:bg-surface-high border border-outline-variant/30 flex items-center justify-between font-semibold hover:bg-surface-high transition-colors"
            >
              <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-600" /> AKC/TICA Pedigree Certificate.pdf</span>
              <Download className="w-4 h-4 text-on-surface" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
