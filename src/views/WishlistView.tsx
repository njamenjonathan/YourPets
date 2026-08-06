import React from 'react';
import { Heart, Lock, ArrowRight } from 'lucide-react';
import { usePetStore } from '../context/PetStoreContext';
import { PetCard } from '../components/PetCard';

export const WishlistView: React.FC = () => {
  const { wishlist, pets, setActiveTab, currentUser, setIsAuthModalOpen } = usePetStore();

  const savedPets = pets.filter(p => wishlist.includes(p.id));

  if (!currentUser?.isLoggedIn) {
    return (
      <div className="space-y-8 animate-fade-in pb-16">
        <div className="p-8 rounded-3xl bg-[#002045] text-white flex justify-between items-center shadow-xl">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Account Security</span>
            <h1 className="font-serif-display font-bold text-3xl md:text-4xl">My Wishlist</h1>
            <p className="text-xs text-white/80 mt-1">Please sign in to view and save your favorite pets.</p>
          </div>
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

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      <div className="p-8 rounded-3xl bg-[#002045] text-white flex justify-between items-center shadow-xl">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Saved Companions</span>
          <h1 className="font-serif-display font-bold text-3xl md:text-4xl">My Wishlist</h1>
          <p className="text-xs text-white/80 mt-1">Keep track of your favorite puppies and kittens.</p>
        </div>
        <span className="text-2xl font-bold font-serif-display text-emerald-300">
          {savedPets.length} Saved
        </span>
      </div>

      {savedPets.length === 0 ? (
        <div className="p-16 text-center bg-white dark:bg-[#1f2226] rounded-3xl border border-outline-variant/30 space-y-4">
          <Heart className="w-16 h-16 mx-auto text-outline" />
          <h3 className="font-serif-display font-bold text-2xl text-on-surface">Your Wishlist is Empty</h3>
          <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
            Explore our collection of health-verified puppies and kittens to save your favorites.
          </p>
          <button
            onClick={() => setActiveTab('browse')}
            className="bg-[#002045] text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#1a365d] transition-colors"
          >
            Browse All Pets Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedPets.map(pet => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      )}
    </div>
  );
};
