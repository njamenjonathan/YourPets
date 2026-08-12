import React from 'react';
import { ShieldCheck, Stethoscope, Award } from 'lucide-react';
import { usePetStore } from '../context/PetStoreContext';

export const HealthGuaranteeView: React.FC = () => {
  const { setActiveTab } = usePetStore();

  return (
    <div className="space-y-12 animate-fade-in pb-16">
      <div className="p-8 md:p-12 rounded-3xl bg-[#002045] text-white space-y-4 shadow-xl">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Zero Risk Promise</span>
        <h1 className="font-serif-display font-bold text-3xl md:text-5xl">90-Day Comprehensive Health Guarantee</h1>
        <p className="text-sm text-white/80 max-w-2xl leading-relaxed">
          At YourPets, every puppy and kitten is backed by our industry-leading health policy. We guarantee that your pet is free from congenital or hereditary defects.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1f2226] border border-outline-variant/30 space-y-3">
          <Stethoscope className="w-8 h-8 text-emerald-600" />
          <h3 className="font-serif-display font-bold text-xl text-on-surface">40-Point Veterinary Check</h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Prior to joining our marketplace, licensed veterinarians perform complete organ, cardiac, ocular, and orthopedic physical exams.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#1f2226] border border-outline-variant/30 space-y-3">
          <ShieldCheck className="w-8 h-8 text-emerald-600" />
          <h3 className="font-serif-display font-bold text-xl text-on-surface">Genetic Screening</h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Parent stock is screened for breed-specific genetic risks such as Hip Dysplasia in canines and HCM/PKD in felines.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#1f2226] border border-outline-variant/30 space-y-3">
          <Award className="w-8 h-8 text-emerald-600" />
          <h3 className="font-serif-display font-bold text-xl text-on-surface">100% Coverage & Support</h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Should any hereditary health condition arise within 90 days of placement, our veterinary network provides 100% medical coverage or full refund support.
          </p>
        </div>
      </div>

      <div className="p-8 rounded-3xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="font-serif-display font-bold text-2xl text-emerald-950 dark:text-emerald-100">Ready to find your companion?</h3>
          <p className="text-xs text-emerald-800 dark:text-emerald-200 mt-1">Browse our verified catalog with complete peace of mind.</p>
        </div>
        <button
          onClick={() => setActiveTab('browse')}
          className="bg-[#002045] text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#1a365d]"
        >
          Explore Catalog Now
        </button>
      </div>
    </div>
  );
};
