import React, { useState } from 'react';
import {
  Plus, Trash2, Edit, CheckCircle2, ShieldCheck, Sparkles, DollarSign, Package, Users
} from 'lucide-react';
import { usePetStore } from '../context/PetStoreContext';
import { Pet, Species, BreedType, Gender } from '../types';

export const AdminDashboardView: React.FC = () => {
  const { pets, orders, addPet, updatePet, deletePet, formatPrice, currentUser, setIsAuthModalOpen } = usePetStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);

  // Form state for adding new pet
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<Species>('dog');
  const [breed, setBreed] = useState('');
  const [breedType, setBreedType] = useState<BreedType>('rare');
  const [ageMonths, setAgeMonths] = useState(3);
  const [gender, setGender] = useState<Gender>('Female');
  const [color, setColor] = useState('Platinum Silver');
  const [priceUSD, setPriceUSD] = useState(220);
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=1000');
  const [traitsString, setTraitsString] = useState('Friendly, Intelligent, Playful');

  const handleCreatePet = (e: React.FormEvent) => {
    e.preventDefault();
    const newPetObj: Pet = {
      id: `pet-${Date.now()}`,
      name: name || 'Companion',
      species,
      breed: breed || 'Rare Breed',
      breedType,
      generation: breedType === 'rare' ? 'VIP Exotic Lineage' : 'Purebred AKC',
      badgeText: breedType === 'rare' ? 'Rare Breed' : 'New Arrival',
      ageMonths: Number(ageMonths),
      gender,
      color,
      weightKg: 3.5,
      heightCm: 22,
      birthDate: '2026-05-10',
      priceUSD: Number(priceUSD),
      status: 'available',
      rating: 5.0,
      reviewsCount: 1,
      isFeatured: true,
      isNewArrival: true,
      locationCityState: 'Beverly Hills, CA',
      breeder: {
        id: 'b1',
        name: 'Beverly Hills Pedigrees',
        photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
        bio: 'Licensed AKC Master Breeder',
        experienceYears: 18,
        certifications: ['AKC Master'],
        petsSold: 1400,
        rating: 4.9,
        verified: true,
        location: 'Beverly Hills, CA'
      },
      medicalInfo: {
        overallHealth: 'Excellent',
        vetExamPassed: true,
        vaccinated: true,
        dewormed: true,
        microchipped: true,
        healthCertIncluded: true,
        pedigreeCertIncluded: true,
        dnaScreeningPassed: true,
        lastVetCheckDate: '2026-08-01',
        nextVaccinationDue: '2026-09-15',
        healthGuaranteeDays: 90
      },
      personalityTraits: traitsString.split(',').map(s => s.trim()),
      breedDetails: {
        history: 'Ethically bred under master veterinarian care.',
        lifespan: '12 - 15 years',
        exerciseNeeds: 'Moderate',
        groomingRequirements: 'Low',
        climateSuitability: 'Adaptable',
        temperament: ['Gentle', 'Friendly'],
        commonHealthConcerns: ['DNA Screened Clear'],
        trainingDifficulty: 'Easy',
        recommendedHome: 'Family homes or luxury residences.'
      },
      images: [imageUrl],
      purchaseIncludes: ['Veterinary Passport', 'AKC Papers', '90-Day Guarantee']
    };

    addPet(newPetObj);
    setIsAddModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setBreed('');
    setPriceUSD(220);
  };

  if (!currentUser?.isLoggedIn || currentUser.role !== 'admin') {
    return (
      <div className="space-y-8 animate-fade-in pb-16">
        <div className="p-8 rounded-3xl bg-[#002045] text-white shadow-xl">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Protected Route</span>
          <h1 className="font-serif-display font-bold text-3xl md:text-4xl">Admin Access Required</h1>
        </div>
        <div className="p-10 rounded-3xl bg-white dark:bg-[#1f2226] border border-outline-variant/30 text-center space-y-4">
          <ShieldCheck className="w-12 h-12 mx-auto text-amber-500" />
          <p className="text-sm text-on-surface-variant">Sign in with the configured admin email to view orders and manage inventory.</p>
          <button onClick={() => setIsAuthModalOpen(true)} className="bg-[#002045] text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider">Sign In</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="p-8 rounded-3xl bg-[#002045] text-white flex justify-between items-center shadow-xl">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Inventory & Catalog Management</span>
          <h1 className="font-serif-display font-bold text-3xl md:text-4xl">Admin Portal</h1>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-emerald-600 text-white px-5 py-3 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-lg"
          id="admin-add-pet-btn"
        >
          <Plus className="w-4 h-4" /> Add New Companion Listing
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1f2226] border border-outline-variant/30 space-y-1 shadow-sm">
          <span className="text-xs font-bold uppercase text-on-surface-variant">Active Catalog Pets</span>
          <div className="text-3xl font-serif-display font-bold text-[#002045] dark:text-emerald-400">{pets.length}</div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#1f2226] border border-outline-variant/30 space-y-1 shadow-sm">
          <span className="text-xs font-bold uppercase text-on-surface-variant">Rare Breeds VIP</span>
          <div className="text-3xl font-serif-display font-bold text-amber-600">
            {pets.filter(p => p.breedType === 'rare').length}
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#1f2226] border border-outline-variant/30 space-y-1 shadow-sm">
          <span className="text-xs font-bold uppercase text-on-surface-variant">Vet Health Clearance</span>
          <div className="text-3xl font-serif-display font-bold text-emerald-600">100%</div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#1f2226] border border-outline-variant/30 space-y-1 shadow-sm">
          <span className="text-xs font-bold uppercase text-on-surface-variant">Avg. Listing Value</span>
          <div className="text-3xl font-serif-display font-bold text-[#002045] dark:text-white">$235</div>
        </div>
      </div>


      <div className="p-6 rounded-3xl bg-white dark:bg-[#1f2226] border border-outline-variant/30 shadow-sm overflow-x-auto">
        <h3 className="font-serif-display font-bold text-xl text-on-surface mb-4">Incoming Orders</h3>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-outline-variant/30 text-on-surface-variant uppercase">
              <th className="p-3">Order</th><th className="p-3">Buyer</th><th className="p-3">Items</th><th className="p-3">Total</th><th className="p-3">Status</th><th className="p-3">Phone</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {orders.length === 0 ? (
              <tr><td className="p-3 text-on-surface-variant" colSpan={6}>No orders yet.</td></tr>
            ) : orders.map(order => (
              <tr key={order.id} className="hover:bg-surface-low dark:hover:bg-surface-high">
                <td className="p-3 font-bold text-on-surface">{order.id}</td>
                <td className="p-3"><div className="font-semibold text-on-surface">{order.customerName}</div><div className="text-on-surface-variant">{order.buyerEmail}</div></td>
                <td className="p-3 text-on-surface-variant">{order.items?.map(item => `${item.productName} x${item.quantity}`).join(', ') || order.pet.name}</td>
                <td className="p-3 font-bold text-[#002045] dark:text-emerald-400">{formatPrice(order.totalAmount)}</td>
                <td className="p-3"><span className="px-2 py-1 rounded-full bg-amber-100 text-amber-800 font-bold">{order.status}</span></td>
                <td className="p-3 text-on-surface-variant">{order.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pet Inventory Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1f2226] border border-outline-variant/30 shadow-sm overflow-x-auto">
        <h3 className="font-serif-display font-bold text-xl text-on-surface mb-4">Master Inventory Listings</h3>

        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-outline-variant/30 text-on-surface-variant uppercase">
              <th className="p-3">Pet</th>
              <th className="p-3">Species</th>
              <th className="p-3">Type</th>
              <th className="p-3">Age</th>
              <th className="p-3">Price</th>
              <th className="p-3">Health Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {pets.map(p => (
              <tr key={p.id} className="hover:bg-surface-low dark:hover:bg-surface-high">
                <td className="p-3 flex items-center gap-3">
                  <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <h4 className="font-bold text-on-surface">{p.breed}</h4>
                    <p className="text-on-surface-variant">{p.name}</p>
                  </div>
                </td>

                <td className="p-3 capitalize font-semibold text-on-surface">{p.species}</td>

                <td className="p-3">
                  {p.breedType === 'rare' ? (
                    <span className="gold-badge px-2 py-0.5 rounded text-[10px] font-bold">Rare VIP</span>
                  ) : (
                    <span className="bg-[#002045] text-white px-2 py-0.5 rounded text-[10px]">Standard</span>
                  )}
                </td>

                <td className="p-3 text-on-surface">{p.ageMonths} Mos</td>

                <td className="p-3 font-bold text-[#002045] dark:text-emerald-400">{formatPrice(p.priceUSD)}</td>

                <td className="p-3">
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Vet Cleared
                  </span>
                </td>

                <td className="p-3">
                  <button
                    onClick={() => deletePet(p.id)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete listing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Pet Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-xl bg-white dark:bg-[#1a1c1e] rounded-3xl shadow-2xl border border-outline-variant/30 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif-display font-bold text-2xl text-on-surface">Add New Pet Listing</h3>

            <form onSubmit={handleCreatePet} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-on-surface">Pet Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder=""
                    className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface-low dark:bg-surface-high"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-on-surface">Breed Name</label>
                  <input
                    type="text"
                    required
                    value={breed}
                    onChange={(e) => setBreed(e.target.value)}
                    placeholder=""
                    className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface-low dark:bg-surface-high"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-on-surface">Species</label>
                  <select
                    value={species}
                    onChange={(e) => setSpecies(e.target.value as Species)}
                    className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface-low dark:bg-surface-high"
                  >
                    <option value="dog">Dog / Puppy</option>
                    <option value="cat">Cat / Kitten</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1 text-on-surface">Rarity Type</label>
                  <select
                    value={breedType}
                    onChange={(e) => setBreedType(e.target.value as BreedType)}
                    className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface-low dark:bg-surface-high"
                  >
                    <option value="rare">Rare Breed VIP</option>
                    <option value="standard">Standard AKC</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1 text-on-surface">Price (USD)</label>
                  <input
                    type="number"
                    required
                    value={priceUSD}
                    onChange={(e) => setPriceUSD(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface-low dark:bg-surface-high"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 text-on-surface">Image URL</label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface-low dark:bg-surface-high"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#002045] text-white px-5 py-2 rounded-xl text-xs font-semibold hover:bg-[#1a365d]"
                >
                  Publish Companion Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
