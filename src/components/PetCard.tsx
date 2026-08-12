import React from 'react';
import { Heart, Eye, Sparkles, CheckCircle } from 'lucide-react';
import { Pet } from '../types';
import { mainPhotoOf } from '../lib/petImages';
import { PetPhoto } from './PetPhoto';
import { usePetStore } from '../context/PetStoreContext';

interface PetCardProps {
  pet: Pet;
}

export const PetCard: React.FC<PetCardProps> = ({ pet }) => {
  const {
    wishlist, toggleWishlist,
    formatPrice, formatAge,
    setSelectedPetId, setActiveTab,
    setQuickViewPet,
    addToCart,
    currentUser
  } = usePetStore();

  const isWishlisted = wishlist.includes(pet.id);
  const isRare = pet.breedType === 'rare';

  const handleClickCard = () => {
    setSelectedPetId(pet.id);
    setActiveTab('pet-detail');
  };

  // "Reserve" means the same thing everywhere: into the basket and straight to
  // the reservation form.
  const handleReserve = () => {
    addToCart(pet);
    if (currentUser?.isLoggedIn) setActiveTab('checkout');
  };

  return (
    <article className="bg-white dark:bg-[#1f2226] rounded-2xl border border-outline-variant/30 overflow-hidden card-elevation flex flex-col relative group">
      {/* Image Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface-low dark:bg-surface-high cursor-pointer" onClick={handleClickCard}>
        <PetPhoto
          src={mainPhotoOf(pet)}
          alt={pet.breed}
          caption={pet.breed}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Top Badges Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none z-10">
          <div className="flex flex-wrap gap-1.5">
            {isRare && (
              <span className="gold-badge px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3 text-amber-600" /> Rare Breed
              </span>
            )}
            {pet.badgeText && !isRare && (
              <span className="bg-[#002045] text-white px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm">
                {pet.badgeText}
              </span>
            )}
          </div>

          {/* Verified Health Badge */}
          <div className="bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-full px-2.5 py-1 shadow-sm flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
            <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 fill-emerald-600 text-white dark:text-black" />
            <span className="hidden sm:inline">Health Verified</span>
          </div>
        </div>

        {/* Quick View Floating Button */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 p-4 pointer-events-none">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewPet(pet);
            }}
            className="pointer-events-auto bg-white dark:bg-[#1f2226] text-[#002045] dark:text-white px-4 py-2 rounded-full font-semibold text-xs shadow-lg hover:bg-[#002045] hover:text-white transition-colors flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
            id={`quickview-btn-${pet.id}`}
          >
            <Eye className="w-3.5 h-3.5" /> Quick View
          </button>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(pet.id);
          }}
          className={`absolute bottom-3 right-3 p-2.5 rounded-full shadow-md backdrop-blur-md transition-all duration-200 ${
            isWishlisted
              ? 'bg-rose-500 text-white'
              : 'bg-white/80 dark:bg-black/70 text-on-surface hover:bg-white hover:text-rose-500'
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
        </button>
      </div>

      {/* Card Content Details */}
      <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
        <div>
          <div className="flex justify-between items-start mb-1">
            <h3
              onClick={handleClickCard}
              className="font-serif-display font-semibold text-lg text-on-surface hover:text-[#002045] dark:hover:text-white transition-colors cursor-pointer"
            >
              {pet.breed}
            </h3>
            <span className="font-serif-display font-bold text-lg text-[#002045] dark:text-emerald-400">
              {formatPrice(pet.priceUSD)}
            </span>
          </div>

          <p className="text-xs text-on-surface-variant font-medium flex items-center gap-2 mb-2">
            <span>{formatAge(pet.ageMonths)}</span> • <span>{pet.gender}</span> • <span>{pet.color}</span>
          </p>

          {/* Personality Traits Badges */}
          <div className="flex flex-wrap gap-1 pt-1">
            {pet.personalityTraits.slice(0, 3).map((trait, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-full bg-surface-low dark:bg-surface-high text-on-surface-variant text-[10px] font-medium"
              >
                {trait}
              </span>
            ))}
          </div>
        </div>

        {/* Card Action Buttons */}
        <div className="pt-2 border-t border-outline-variant/20 flex items-center gap-2">
          <button
            onClick={handleClickCard}
            className="flex-1 py-2.5 rounded-lg border border-outline-variant text-on-surface font-semibold text-xs tracking-wider uppercase hover:border-[#002045] hover:text-[#002045] dark:hover:border-white dark:hover:text-white transition-colors text-center"
            id={`view-details-${pet.id}`}
          >
            Details
          </button>

          <button
            onClick={handleReserve}
            className="flex-1 py-2.5 rounded-lg bg-[#002045] text-white font-semibold text-xs tracking-wider uppercase hover:bg-[#1a365d] transition-all shadow-sm hover:shadow-md text-center"
            id={`reserve-${pet.id}`}
          >
            Reserve
          </button>
        </div>
      </div>
    </article>
  );
};
