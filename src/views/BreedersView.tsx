import React from 'react';
import { MapPin, CheckCircle2, MessageCircle } from 'lucide-react';
import { usePetStore } from '../context/PetStoreContext';
import { Avatar } from '../components/PetPhoto';

export const BreedersView: React.FC = () => {
  const { breeders, setIsChatOpen, setActiveTab, setFilterState } = usePetStore();

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      <div className="p-8 rounded-3xl bg-[#002045] text-white shadow-xl">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Ethical Breeders Network</span>
        <h1 className="font-serif-display font-bold text-3xl md:text-4xl">Verified Master Breeders</h1>
        <p className="text-xs text-white/80 mt-1">
          Every breeder on YourPets undergoes unannounced facility inspections, genetic screening audits, and animal welfare vetting.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {breeders.map(b => (
          <div key={b.id} className="p-8 rounded-3xl bg-white dark:bg-[#1f2226] border border-outline-variant/30 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar src={b.photo} name={b.name} className="w-20 h-20 rounded-full object-cover border-2 border-emerald-500 shadow-sm shrink-0" />
                <div>
                  <h3 className="font-serif-display font-bold text-xl text-on-surface">{b.name}</h3>
                  <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {b.location}
                  </p>
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-xs mt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Licensed ({b.experienceYears} Yrs Experience)
                  </span>
                </div>
              </div>

              <p className="text-xs text-on-surface-variant leading-relaxed">{b.bio}</p>

              <div className="space-y-1 pt-2 border-t border-outline-variant/20">
                <span className="text-[10px] font-bold uppercase text-on-surface-variant">Certifications & Accreditation</span>
                <div className="flex flex-wrap gap-1">
                  {b.certifications.map((c, i) => (
                    <span key={i} className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 text-[10px] font-semibold">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsChatOpen(true)}
              className="w-full bg-[#002045] text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#1a365d] transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" /> Contact Breeder Concierge
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
