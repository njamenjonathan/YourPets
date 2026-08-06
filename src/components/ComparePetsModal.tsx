import React from 'react';
import { X, CheckCircle2, Layers, ShoppingBag, Trash2 } from 'lucide-react';
import { usePetStore } from '../context/PetStoreContext';

export const ComparePetsModal: React.FC = () => {
  const {
    isCompareOpen,
    setIsCompareOpen,
    compareList,
    toggleCompare,
    formatPrice,
    formatAge,
    addToCart,
    setSelectedPetId,
    setActiveTab
  } = usePetStore();

  if (!isCompareOpen || compareList.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-5xl bg-white dark:bg-[#1a1c1e] rounded-3xl shadow-2xl border border-outline-variant/30 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-6 bg-[#002045] text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-secondary-fixed" />
            <h2 className="font-serif-display font-bold text-xl">Side-by-Side Companion Comparison</h2>
          </div>
          <button
            onClick={() => setIsCompareOpen(false)}
            className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Table */}
        <div className="p-6 overflow-x-auto overflow-y-auto flex-1">
          <table className="w-full text-left text-xs border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-outline-variant/30">
                <th className="p-3 w-32 font-bold uppercase text-on-surface-variant">Feature</th>
                {compareList.map(pet => (
                  <th key={pet.id} className="p-3 w-56 text-center align-top">
                    <div className="relative group">
                      <button
                        onClick={() => toggleCompare(pet)}
                        className="absolute -top-2 -right-2 p-1 bg-rose-500 text-white rounded-full shadow-md hover:bg-rose-600 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                      <img
                        src={pet.images[0]}
                        alt={pet.name}
                        className="w-24 h-24 mx-auto rounded-xl object-cover mb-2 shadow-sm"
                      />
                      <h3 className="font-bold text-sm text-on-surface">{pet.breed}</h3>
                      <p className="text-on-surface-variant">{pet.name}</p>
                      <p className="font-bold text-[#002045] dark:text-emerald-400 text-sm mt-1">
                        {formatPrice(pet.priceUSD)}
                      </p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              <tr>
                <td className="p-3 font-semibold text-on-surface-variant">Species & Type</td>
                {compareList.map(pet => (
                  <td key={pet.id} className="p-3 text-center capitalize font-medium text-on-surface">
                    {pet.species} ({pet.breedType} breed)
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-on-surface-variant">Age & Gender</td>
                {compareList.map(pet => (
                  <td key={pet.id} className="p-3 text-center font-medium text-on-surface">
                    {formatAge(pet.ageMonths)} • {pet.gender}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-on-surface-variant">Overall Health</td>
                {compareList.map(pet => (
                  <td key={pet.id} className="p-3 text-center">
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Excellent
                    </span>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-on-surface-variant">Vaccinations & Chip</td>
                {compareList.map(pet => (
                  <td key={pet.id} className="p-3 text-center font-medium text-on-surface">
                    {pet.medicalInfo.vaccinated ? 'Fully Vaccinated' : 'Partial'} • Microchipped
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-on-surface-variant">Lifespan & Size</td>
                {compareList.map(pet => (
                  <td key={pet.id} className="p-3 text-center text-on-surface-variant">
                    {pet.breedDetails.lifespan} • {pet.weightKg} kg
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-on-surface-variant">Exercise Needs</td>
                {compareList.map(pet => (
                  <td key={pet.id} className="p-3 text-center font-medium text-on-surface">
                    {pet.breedDetails.exerciseNeeds}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-on-surface-variant">Grooming Needs</td>
                {compareList.map(pet => (
                  <td key={pet.id} className="p-3 text-center text-on-surface-variant">
                    {pet.breedDetails.groomingRequirements}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-on-surface-variant">Personality Traits</td>
                {compareList.map(pet => (
                  <td key={pet.id} className="p-3 text-center">
                    <div className="flex flex-wrap justify-center gap-1">
                      {pet.personalityTraits.slice(0, 4).map((t, idx) => (
                        <span key={idx} className="bg-surface-low dark:bg-surface-high px-2 py-0.5 rounded-full text-[10px]">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-on-surface-variant">Action</td>
                {compareList.map(pet => (
                  <td key={pet.id} className="p-3 text-center">
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => {
                          addToCart(pet);
                          setIsCompareOpen(false);
                        }}
                        className="bg-[#002045] text-white py-2 px-3 rounded-xl font-semibold text-xs hover:bg-[#1a365d] transition-colors flex items-center justify-center gap-1"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" /> Select Pet
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPetId(pet.id);
                          setActiveTab('pet-detail');
                          setIsCompareOpen(false);
                        }}
                        className="text-xs font-semibold text-[#002045] dark:text-white hover:underline"
                      >
                        View Profile
                      </button>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
