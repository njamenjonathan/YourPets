import React, { useMemo } from 'react';
import { SlidersHorizontal, RotateCcw, Search, Sparkles, Camera } from 'lucide-react';
import { usePetStore, INITIAL_FILTER_STATE } from '../context/PetStoreContext';
import { PetCard } from '../components/PetCard';
import { Species, BreedType, Gender } from '../types';

export const BrowseView: React.FC = () => {
  const {
    pets,
    filterState,
    setFilterState,
    searchQuery,
    setSearchQuery,
    setIsQuizOpen,
    setIsBreedIdentifierOpen
  } = usePetStore();

  // The most common personality traits, so the filter list stays short and useful
  const availableTraits = useMemo(() => {
    const counts = new Map<string, number>();
    pets.forEach(p => p.personalityTraits.forEach(t => counts.set(t, (counts.get(t) || 0) + 1)));
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 12)
      .map(([trait]) => trait);
  }, [pets]);

  // Filter & Sort Logic
  const filteredPets = useMemo(() => {
    return pets.filter(p => {
      // Species
      if (filterState.species.length > 0 && !filterState.species.includes(p.species)) {
        return false;
      }
      // Breed Type
      if (filterState.breedTypes.length > 0 && !filterState.breedTypes.includes(p.breedType)) {
        return false;
      }
      // Specific Selected Breeds
      if (filterState.selectedBreeds.length > 0 && !filterState.selectedBreeds.includes(p.breed)) {
        return false;
      }
      // Gender
      if (filterState.genders.length > 0 && !filterState.genders.includes(p.gender)) {
        return false;
      }
      // Price
      if (p.priceUSD < filterState.minPriceUSD || p.priceUSD > filterState.maxPriceUSD) {
        return false;
      }
      // Age
      if (p.ageMonths < filterState.minAgeMonths || p.ageMonths > filterState.maxAgeMonths) {
        return false;
      }
      // Vaccinated / Microchipped
      if (filterState.vaccinatedOnly && !p.medicalInfo.vaccinated) {
        return false;
      }
      if (filterState.microchippedOnly && !p.medicalInfo.microchipped) {
        return false;
      }
      // Personality Traits
      if (filterState.traits.length > 0) {
        const hasTrait = filterState.traits.some(t => p.personalityTraits.includes(t));
        if (!hasTrait) return false;
      }
      // Search Query
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        const matchBreed = p.breed.toLowerCase().includes(q);
        const matchName = p.name.toLowerCase().includes(q);
        const matchTrait = p.personalityTraits.some(t => t.toLowerCase().includes(q));
        if (!matchBreed && !matchName && !matchTrait) return false;
      }
      return true;
    }).sort((a, b) => {
      if (filterState.sortBy === 'price-asc') return a.priceUSD - b.priceUSD;
      if (filterState.sortBy === 'price-desc') return b.priceUSD - a.priceUSD;
      if (filterState.sortBy === 'rating') return b.rating - a.rating;
      if (filterState.sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      return 0; // recommended
    });
  }, [pets, filterState, searchQuery]);

  const resetFilters = () => {
    setFilterState(INITIAL_FILTER_STATE);
    setSearchQuery('');
  };

  const toggleSpeciesFilter = (s: Species) => {
    setFilterState(prev => {
      const exists = prev.species.includes(s);
      return {
        ...prev,
        species: exists ? prev.species.filter(x => x !== s) : [...prev.species, s]
      };
    });
  };

  const toggleBreedTypeFilter = (bt: BreedType) => {
    setFilterState(prev => {
      const exists = prev.breedTypes.includes(bt);
      return {
        ...prev,
        breedTypes: exists ? prev.breedTypes.filter(x => x !== bt) : [...prev.breedTypes, bt]
      };
    });
  };

  const toggleGenderFilter = (g: Gender) => {
    setFilterState(prev => {
      const exists = prev.genders.includes(g);
      return {
        ...prev,
        genders: exists ? prev.genders.filter(x => x !== g) : [...prev.genders, g]
      };
    });
  };

  const toggleTraitFilter = (trait: string) => {
    setFilterState(prev => {
      const exists = prev.traits.includes(trait);
      return {
        ...prev,
        traits: exists ? prev.traits.filter(x => x !== trait) : [...prev.traits, trait]
      };
    });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-[#002045] text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl">
        <div className="space-y-2 max-w-xl">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Verified Marketplace</span>
          <h1 className="font-serif-display font-bold text-3xl md:text-4xl">Browse Luxury Companions</h1>
          <p className="text-xs text-white/80">Explore healthy puppies and kittens with transparent vet exam records and 90-day health guarantees.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsBreedIdentifierOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-400 text-[#002045] px-5 py-3 rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-md"
            id="browse-photo-scan-btn"
          >
            <Camera className="w-4 h-4" /> Photo Breed Scan
          </button>
          <button
            onClick={() => setIsQuizOpen(true)}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-3 rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-emerald-300" /> AI Matchmaker
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-72 space-y-6 flex-shrink-0">
          <div className="p-6 rounded-3xl liquid-glass liquid-glass-strong space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30">
              <h3 className="font-serif-display font-bold text-lg text-on-surface flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#002045]" /> Filters
              </h3>
              <button
                onClick={resetFilters}
                className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Species */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase text-on-surface-variant">Pet Species</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'dog', label: 'Puppies 🐶' },
                  { id: 'cat', label: 'Kittens 🐱' }
                ].map(s => (
                  <button
                    key={s.id}
                    onClick={() => toggleSpeciesFilter(s.id as Species)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition-colors ${
                      filterState.species.includes(s.id as Species)
                        ? 'border-[#002045] bg-[#002045] text-white'
                        : 'border-outline-variant text-on-surface hover:border-[#002045]'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Breed Type (Rare vs Standard) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase text-on-surface-variant">Breed Rarity</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => toggleBreedTypeFilter('rare')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition-colors ${
                    filterState.breedTypes.includes('rare')
                      ? 'gold-badge font-bold'
                      : 'border-outline-variant text-on-surface hover:border-[#002045]'
                  }`}
                >
                  Rare Breed ✨
                </button>
                <button
                  onClick={() => toggleBreedTypeFilter('standard')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition-colors ${
                    filterState.breedTypes.includes('standard')
                      ? 'border-[#002045] bg-[#002045] text-white'
                      : 'border-outline-variant text-on-surface hover:border-[#002045]'
                  }`}
                >
                  Standard AKC
                </button>
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-on-surface">
                <span>Max Price</span>
                <span className="text-[#002045] dark:text-emerald-400">${filterState.maxPriceUSD.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="150"
                max="300"
                step="10"
                value={filterState.maxPriceUSD}
                onChange={(e) => setFilterState(prev => ({ ...prev, maxPriceUSD: Number(e.target.value) }))}
                className="w-full accent-[#002045]"
              />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase text-on-surface-variant">Gender</label>
              <div className="grid grid-cols-2 gap-2">
                {['Male', 'Female'].map(g => (
                  <button
                    key={g}
                    onClick={() => toggleGenderFilter(g as Gender)}
                    className={`p-2 rounded-xl border text-xs font-semibold transition-colors ${
                      filterState.genders.includes(g as Gender)
                        ? 'border-[#002045] bg-[#002045] text-white'
                        : 'border-outline-variant text-on-surface'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Verified Health Checkboxes */}
            <div className="space-y-2 pt-2 border-t border-outline-variant/30">
              <label className="block text-xs font-bold uppercase text-on-surface-variant">Health Filters</label>

              <label className="flex items-center gap-2 text-xs font-medium text-on-surface cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterState.vaccinatedOnly}
                  onChange={(e) => setFilterState(prev => ({ ...prev, vaccinatedOnly: e.target.checked }))}
                  className="w-4 h-4 rounded text-[#002045]"
                />
                Fully Vaccinated Only
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-on-surface cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterState.microchippedOnly}
                  onChange={(e) => setFilterState(prev => ({ ...prev, microchippedOnly: e.target.checked }))}
                  className="w-4 h-4 rounded text-[#002045]"
                />
                ISO Microchipped Only
              </label>
            </div>

            {/* Personality Traits */}
            <div className="space-y-2 pt-2 border-t border-outline-variant/30">
              <label className="block text-xs font-bold uppercase text-on-surface-variant">Personality Traits</label>
              <div className="flex flex-wrap gap-1">
                {availableTraits.map(trait => {
                  const active = filterState.traits.includes(trait);
                  return (
                    <button
                      key={trait}
                      onClick={() => toggleTraitFilter(trait)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-colors ${
                        active
                          ? 'bg-emerald-600 text-white'
                          : 'bg-surface-low dark:bg-surface-high text-on-surface-variant hover:bg-surface-high'
                      }`}
                    >
                      {trait}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Product Grid */}
        <main className="flex-1 space-y-6">
          {/* Top Sort Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-2xl liquid-glass liquid-glass-strong">
            <span className="text-xs font-bold text-on-surface">
              Showing <strong>{filteredPets.length}</strong> available companion pets
            </span>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-on-surface-variant">Sort by:</span>
              <select
                value={filterState.sortBy}
                onChange={(e) => setFilterState(prev => ({ ...prev, sortBy: e.target.value as any }))}
                className="bg-surface-low dark:bg-surface-high border border-outline-variant rounded-xl text-xs font-semibold px-3 py-1.5 focus:outline-none"
              >
                <option value="recommended">Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">New Arrivals First</option>
              </select>
            </div>
          </div>

          {/* Grid or Empty State */}
          {filteredPets.length === 0 ? (
            <div className="p-12 text-center liquid-glass liquid-glass-strong rounded-3xl space-y-4">
              <Search className="w-12 h-12 mx-auto text-outline" />
              <h3 className="font-serif-display font-bold text-xl text-on-surface">No matching companions found</h3>
              <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
                Try loosening your filter parameters or resetting your search term.
              </p>
              <button
                onClick={resetFilters}
                className="bg-[#002045] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="stagger-children grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPets.map(pet => (
                <PetCard key={pet.id} pet={pet} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
