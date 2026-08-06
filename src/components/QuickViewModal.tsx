import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Heart, ShoppingBag, Award, Sparkles, Stethoscope } from 'lucide-react';
import { usePetStore } from '../context/PetStoreContext';

export const QuickViewModal: React.FC = () => {
  const {
    isQuickViewOpen,
    quickViewPet: pet,
    setQuickViewPet,
    formatPrice,
    formatAge,
    addToCart,
    toggleWishlist,
    wishlist,
    setSelectedPetId,
    setActiveTab,
    openReserveModal
  } = usePetStore();

  const [activeImageIdx, setActiveImageIdx] = useState(0);

  if (!isQuickViewOpen || !pet) return null;

  const isWishlisted = wishlist.includes(pet.id);

  const handleFullProfile = () => {
    setSelectedPetId(pet.id);
    setActiveTab('pet-detail');
    setQuickViewPet(null);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#1a1c1e] rounded-3xl shadow-2xl border border-outline-variant/30 overflow-hidden max-h-[90vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={() => setQuickViewPet(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 dark:bg-black/70 text-on-surface hover:bg-rose-500 hover:text-white transition-colors shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Image Gallery Preview */}
        <div className="md:w-1/2 p-6 bg-surface-low dark:bg-surface-high flex flex-col justify-between gap-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-white dark:bg-[#1f2226] shadow-sm">
            <img
              src={pet.images[activeImageIdx]}
              alt={pet.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
            <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/80 rounded-full px-3 py-1 text-emerald-600 font-semibold text-xs flex items-center gap-1 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5" /> Medical Cleared
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {pet.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImageIdx(i)}
                className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                  activeImageIdx === i ? 'border-[#002045] dark:border-white scale-105' : 'border-transparent opacity-60'
                }`}
              >
                <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Quick Info & Actions */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between space-y-6 overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {pet.breedType === 'rare' ? (
                <span className="gold-badge px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600" /> Rare Breed
                </span>
              ) : (
                <span className="bg-[#002045] text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Standard AKC
                </span>
              )}
              <span className="text-xs text-on-surface-variant">{pet.generation}</span>
            </div>

            <h2 className="font-serif-display font-bold text-2xl text-on-surface mb-1">
              {pet.breed} ({pet.name})
            </h2>

            <div className="flex items-baseline gap-3 mb-4">
              <span className="font-serif-display text-2xl font-bold text-[#002045] dark:text-emerald-400">
                {formatPrice(pet.priceUSD)}
              </span>
              <span className="text-xs text-on-surface-variant">
                {formatAge(pet.ageMonths)} • {pet.gender} • {pet.color}
              </span>
            </div>

            {/* Quick Medical Checklist */}
            <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl p-4 border border-emerald-200/50 space-y-2 mb-4">
              <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5 uppercase tracking-wider">
                <Stethoscope className="w-4 h-4 text-emerald-600" /> Verified Health Summary
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-emerald-950 dark:text-emerald-100">
                <div>• Overall: <strong className="text-emerald-600">Excellent</strong></div>
                <div>• Vet Check: <strong>Passed</strong></div>
                <div>• Vaccinated: <strong>Yes</strong></div>
                <div>• Microchipped: <strong>Yes</strong></div>
              </div>
            </div>

            {/* Traits */}
            <div className="space-y-1.5 mb-4">
              <h4 className="text-xs font-bold uppercase text-on-surface-variant">Personality</h4>
              <div className="flex flex-wrap gap-1">
                {pet.personalityTraits.map((trait, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-full bg-surface-low dark:bg-surface-high text-xs text-on-surface">
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-4 border-t border-outline-variant/30">
            <div className="flex gap-3">
              <button
                onClick={() => {
                  addToCart(pet);
                  setQuickViewPet(null);
                }}
                className="flex-1 bg-[#002045] text-white py-3 rounded-xl font-semibold text-xs uppercase tracking-wider hover:bg-[#1a365d] transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </button>

              <button
                onClick={() => toggleWishlist(pet.id)}
                className={`p-3 rounded-xl border transition-colors ${
                  isWishlisted ? 'bg-rose-500 border-rose-500 text-white' : 'border-outline-variant text-on-surface hover:border-[#002045]'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
              </button>
            </div>

            <button
              onClick={handleFullProfile}
              className="w-full text-center text-xs font-bold uppercase tracking-wider text-[#002045] dark:text-white hover:underline py-2"
            >
              View Full Profile, Medical Passport & Pedigree →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
