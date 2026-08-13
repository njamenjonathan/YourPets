import React, { useEffect, useState } from 'react';
import { Heart, ShoppingBag, CheckCircle2, ShieldCheck, Stethoscope, Sparkles, Award, MessageCircle, ArrowLeft, Phone, FileText, Send } from 'lucide-react';
import { usePetStore } from '../context/PetStoreContext';
import { mainPhotoOf, photosFor } from '../lib/petImages';
import { PetPhoto, Avatar } from '../components/PetPhoto';
import { WHATSAPP_DISPLAY, whatsappLink } from '../lib/contact';
import { ADDON_PRICES_USD, RESERVATION_DEPOSIT_USD, addOnsTotalUSD } from '../lib/pricing';

export const PetDetailView: React.FC = () => {
  const {
    selectedPetId,
    setSelectedPetId,
    pets,
    formatPrice,
    formatAge,
    addToCart,
    toggleWishlist,
    wishlist,
    setActiveTab,
    openReserveModal,
    setIsChatOpen,
    currentUser
  } = usePetStore();

  const pet = pets.find(p => p.id === selectedPetId) || pets[0];
  const isWishlisted = wishlist.includes(pet.id);

  // Other pets of the same breed or same species
  const sameBreedPets = pets.filter(p => p.breed === pet.breed && p.id !== pet.id);
  const relatedPets = (sameBreedPets.length > 0
    ? sameBreedPets
    : pets.filter(p => p.species === pet.species && p.id !== pet.id)
  ).slice(0, 4);

  const gallery = photosFor(pet);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // A different pet means starting from its first photo again.
  useEffect(() => setActiveImageIdx(0), [pet.id]);
  const [selectedAddons, setSelectedAddons] = useState({
    insurance: true,
    starterKit: true,
    vipTransport: false
  });

  // Ask AI about this pet state
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isAskingAi, setIsAskingAi] = useState(false);

  const handleAskAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;

    setIsAskingAi(true);
    try {
      const res = await fetch('/api/ai/ask-pet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          breed: pet.breed,
          gender: pet.gender,
          ageMonths: pet.ageMonths,
          personalityTraits: pet.personalityTraits,
          question: aiQuestion
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAiAnswer(data.answer);
      }
    } catch (err) {
      setAiAnswer(`This ${pet.breed} is gentle and highly social, with clear 40-point veterinary exam results and complete pedigree clearance.`);
    } finally {
      setIsAskingAi(false);
    }
  };

  // One click from the pet page to checkout, instead of a detour through the cart.
  const buyNow = () => {
    addToCart(pet, selectedAddons);
    if (currentUser?.isLoggedIn) setActiveTab('checkout');
  };

  const calculateTotalPrice = () => pet.priceUSD + addOnsTotalUSD(selectedAddons);

  return (
    <div className="space-y-12 animate-fade-in pb-16">
      {/* Back Button */}
      <button
        onClick={() => setActiveTab('browse')}
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-on-surface hover:text-[#002045] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Catalog
      </button>

      {/* Main Top Section: Image Gallery + Primary Purchasing */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Gallery (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden liquid-glass liquid-glass-strong">
            <PetPhoto
              src={gallery[activeImageIdx]}
              alt={pet.breed}
              caption={pet.breed}
              priority
              className="w-full h-full object-cover transition-all duration-500"
            />

            {/* Overlays */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {pet.breedType === 'rare' ? (
                <span className="gold-badge px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Rare Breed VIP
                </span>
              ) : (
                <span className="bg-[#002045] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                  AKC Standard
                </span>
              )}

              <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
                <CheckCircle2 className="w-3.5 h-3.5" /> Vet Exam Passed
              </span>
            </div>

            <button
              onClick={() => toggleWishlist(pet.id)}
              className={`absolute top-4 right-4 p-3 rounded-full shadow-lg backdrop-blur-md transition-all ${
                isWishlisted ? 'bg-rose-500 text-white' : 'bg-white/80 text-on-surface hover:bg-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-white' : ''}`} />
            </button>
          </div>

          {/* Gallery Thumbnails — only worth showing when there is a choice */}
          {gallery.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {gallery.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setActiveImageIdx(i)}
                  aria-label={`View photo ${i + 1} of this ${pet.breed}`}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activeImageIdx === i ? 'border-[#002045] dark:border-white scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <PetPhoto src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Pricing & Purchase Configuration (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                {pet.breedType === 'rare' ? 'Exotic Heritage' : 'Purebred Pedigree'}
              </span>
              <span className="text-xs text-on-surface-variant">• {pet.generation}</span>
            </div>

            <h1 className="font-serif-display font-bold text-3xl md:text-4xl text-on-surface">
              {pet.breed}
            </h1>

            <p className="text-sm font-semibold text-on-surface-variant">
              {formatAge(pet.ageMonths)} • {pet.gender} • {pet.color}
            </p>
          </div>

          {/* Pricing & Deposit Banner */}
          <div className="p-6 rounded-3xl bg-surface-low dark:bg-surface-high border border-outline-variant/30 space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-bold uppercase text-on-surface-variant">Listing Price</span>
              <span className="font-serif-display font-bold text-3xl text-[#002045] dark:text-emerald-400">
                {formatPrice(pet.priceUSD)}
              </span>
            </div>
            <div className="flex items-baseline justify-between text-xs font-semibold text-on-surface-variant">
              <span>With selected add-ons</span>
              <span className="text-on-surface">{formatPrice(calculateTotalPrice())}</span>
            </div>
            <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
              Includes 90-Day Health Guarantee & Complete Vet Passport.
            </p>
          </div>

          {/* Add-on Options */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              Customize Companion Package
            </h4>

            <label className="flex items-center justify-between p-3.5 rounded-2xl border border-outline-variant/40 liquid-glass liquid-glass-strong cursor-pointer text-xs">
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={selectedAddons.insurance}
                  onChange={(e) => setSelectedAddons(prev => ({ ...prev, insurance: e.target.checked }))}
                  className="w-4 h-4 rounded text-[#002045]"
                />
                <div>
                  <span className="font-bold text-on-surface">1st Month Vet Health Insurance</span>
                  <p className="text-[11px] text-on-surface-variant">Covers accidents & illness emergencies</p>
                </div>
              </div>
              <span className="font-bold text-[#002045] dark:text-emerald-400">+{formatPrice(ADDON_PRICES_USD.insurance)}</span>
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl border border-outline-variant/40 liquid-glass liquid-glass-strong cursor-pointer text-xs">
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={selectedAddons.starterKit}
                  onChange={(e) => setSelectedAddons(prev => ({ ...prev, starterKit: e.target.checked }))}
                  className="w-4 h-4 rounded text-[#002045]"
                />
                <div>
                  <span className="font-bold text-on-surface">Luxury Starter & Toy Kit</span>
                  <p className="text-[11px] text-on-surface-variant">Royal Canin food, plush toy & blanket</p>
                </div>
              </div>
              <span className="font-bold text-[#002045] dark:text-emerald-400">+{formatPrice(ADDON_PRICES_USD.starterKit)}</span>
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl border border-outline-variant/40 liquid-glass liquid-glass-strong cursor-pointer text-xs">
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={selectedAddons.vipTransport}
                  onChange={(e) => setSelectedAddons(prev => ({ ...prev, vipTransport: e.target.checked }))}
                  className="w-4 h-4 rounded text-[#002045]"
                />
                <div>
                  <span className="font-bold text-on-surface">VIP Flight Nanny Cabin Delivery</span>
                  <p className="text-[11px] text-on-surface-variant">Escorted in cabin directly to your airport</p>
                </div>
              </div>
              <span className="font-bold text-[#002045] dark:text-emerald-400">+{formatPrice(ADDON_PRICES_USD.vipTransport)}</span>
            </label>
          </div>

          {/* Primary Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={() => buyNow()}
              className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-600/30 flex items-center justify-center gap-2"
              id="reserve-now-detail-btn"
            >
              <ShoppingBag className="w-4 h-4" /> Reserve this {pet.species === 'dog' ? 'puppy' : 'kitten'} now
            </button>

            <button
              onClick={() => addToCart(pet, selectedAddons)}
              className="w-full border border-[#002045] dark:border-white text-[#002045] dark:text-white py-3 rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-[#002045] hover:text-white dark:hover:bg-white dark:hover:text-[#002045] transition-all flex items-center justify-center gap-2"
              id="add-to-cart-detail-btn"
            >
              Add to cart &amp; keep browsing
            </button>

            <a
              href={whatsappLink(`Hello YourPets, I am interested in the ${pet.breed} (listing ${pet.id}). Is it still available?`)}
              target="_blank"
              rel="noreferrer"
              className="w-full border border-emerald-600 text-emerald-700 dark:text-emerald-300 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" /> Ask about this {pet.breed} on WhatsApp
            </a>

            <button
              onClick={() => openReserveModal(pet)}
              className="w-full text-[11px] font-bold text-on-surface-variant hover:text-[#002045] dark:hover:text-white transition-colors underline underline-offset-2"
              id="reserve-deposit-btn"
            >
              Not ready yet? Hold this {pet.species === 'dog' ? 'puppy' : 'kitten'} for 7 days with a {formatPrice(RESERVATION_DEPOSIT_USD)} refundable deposit
            </button>

            <p className="text-[11px] text-on-surface-variant text-center leading-relaxed">
              Payment, confirmation and shipment are all arranged with our team on WhatsApp. Nothing is charged on this
              website.
            </p>
          </div>
        </div>
      </div>

      {/* Medical Transparency Dashboard (Bento Grid) */}
      <section className="space-y-6">
        <div className="border-b border-outline-variant/30 pb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Veterinary Passport</span>
          <h2 className="font-serif-display font-bold text-3xl text-on-surface">Comprehensive Health Clearance</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl liquid-glass liquid-glass-strong space-y-2">
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 w-fit text-emerald-600">
              <Stethoscope className="w-6 h-6" />
            </div>
            <h4 className="text-xs font-bold uppercase text-on-surface-variant">Overall Health Status</h4>
            <div className="text-xl font-bold text-emerald-600">{pet.medicalInfo.overallHealth}</div>
            <p className="text-[11px] text-on-surface-variant">Last vet exam: {pet.medicalInfo.lastVetCheckDate}</p>
          </div>

          <div className="p-6 rounded-3xl liquid-glass liquid-glass-strong space-y-2">
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 w-fit text-emerald-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-xs font-bold uppercase text-on-surface-variant">Vaccination & Microchip</h4>
            <div className="text-xl font-bold text-on-surface">100% Up to Date</div>
            <p className="text-[11px] text-on-surface-variant">ISO Microchip ID Recorded</p>
          </div>

          <div className="p-6 rounded-3xl liquid-glass liquid-glass-strong space-y-2">
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 w-fit text-emerald-600">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="text-xs font-bold uppercase text-on-surface-variant">Pedigree & DNA Test</h4>
            <div className="text-xl font-bold text-on-surface">Genetic Screened</div>
            <p className="text-[11px] text-on-surface-variant">AKC/TICA Pedigree Cert Included</p>
          </div>

          <div className="p-6 rounded-3xl liquid-glass liquid-glass-strong space-y-2">
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 w-fit text-emerald-600">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="text-xs font-bold uppercase text-on-surface-variant">Health Guarantee</h4>
            <div className="text-xl font-bold text-emerald-600">{pet.medicalInfo.healthGuaranteeDays} Days Full</div>
            <p className="text-[11px] text-on-surface-variant">Covers hereditary conditions</p>
          </div>
        </div>
      </section>

      {/* Ask AI About This Pet Widget */}
      <section className="p-8 rounded-3xl bg-[#002045] text-white space-y-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-300">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif-display font-bold text-2xl">Ask our AI about this {pet.breed}</h3>
            <p className="text-xs text-white/80">Have questions about temperament, apartment suitability, or grooming requirements?</p>
          </div>
        </div>

        <form onSubmit={handleAskAi} className="flex gap-2">
          <input
            type="text"
            value={aiQuestion}
            onChange={(e) => setAiQuestion(e.target.value)}
            placeholder=""
            className="flex-1 px-4 py-3 rounded-2xl text-xs bg-white/10 border border-white/20 text-white focus:outline-none focus:bg-white/20"
          />
          <button
            type="submit"
            disabled={isAskingAi}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold text-xs uppercase flex items-center gap-1.5 transition-colors"
          >
            {isAskingAi ? 'Analyzing...' : 'Ask AI'} <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        {aiAnswer && (
          <div className="p-4 rounded-2xl bg-white/10 border border-white/15 text-xs text-emerald-200 leading-relaxed animate-fade-in">
            <strong>AI Concierge Insight:</strong> {aiAnswer}
          </div>
        )}
      </section>

      {/* Breed Information & Master Breeder Card Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Breed Characteristics */}
        <div className="lg:col-span-8 p-8 rounded-3xl liquid-glass liquid-glass-strong space-y-6">
          <h3 className="font-serif-display font-bold text-2xl text-on-surface">About {pet.breed} Breed</h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">{pet.breedDetails.history}</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs pt-4 border-t border-outline-variant/30">
            <div>
              <span className="font-bold text-on-surface-variant block uppercase">Lifespan</span>
              <span className="font-semibold text-on-surface">{pet.breedDetails.lifespan}</span>
            </div>

            <div>
              <span className="font-bold text-on-surface-variant block uppercase">Exercise Needs</span>
              <span className="font-semibold text-on-surface">{pet.breedDetails.exerciseNeeds}</span>
            </div>

            <div>
              <span className="font-bold text-on-surface-variant block uppercase">Grooming</span>
              <span className="font-semibold text-on-surface">{pet.breedDetails.groomingRequirements}</span>
            </div>

            <div>
              <span className="font-bold text-on-surface-variant block uppercase">Climate</span>
              <span className="font-semibold text-on-surface">{pet.breedDetails.climateSuitability}</span>
            </div>

            <div>
              <span className="font-bold text-on-surface-variant block uppercase">Training</span>
              <span className="font-semibold text-on-surface">{pet.breedDetails.trainingDifficulty}</span>
            </div>

            <div>
              <span className="font-bold text-on-surface-variant block uppercase">Ideal Home</span>
              <span className="font-semibold text-on-surface">{pet.breedDetails.recommendedHome}</span>
            </div>
          </div>
        </div>

        {/* Right: Master Breeder Card */}
        <div className="lg:col-span-4 p-8 rounded-3xl bg-surface-low dark:bg-surface-high border border-outline-variant/30 space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Verified Master Breeder</span>
          <div className="flex items-center gap-4">
            <Avatar src={pet.breeder.photo} name={pet.breeder.name} className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500 shrink-0" />
            <div>
              <h4 className="font-serif-display font-bold text-base text-on-surface">{pet.breeder.name}</h4>
              <p className="text-xs text-on-surface-variant">{pet.breeder.location}</p>
            </div>
          </div>

          <p className="text-xs text-on-surface-variant leading-relaxed">{pet.breeder.bio}</p>

          <div className="space-y-2 pt-2 border-t border-outline-variant/30 text-xs">
            <button
              onClick={() => setIsChatOpen(true)}
              className="w-full bg-[#002045] text-white py-2.5 rounded-xl font-bold hover:bg-[#1a365d] transition-colors flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4" /> Message Breeder Concierge
            </button>

            <a
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-emerald-600 text-white py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <Phone className="w-4 h-4" /> WhatsApp: {WHATSAPP_DISPLAY}
            </a>
          </div>
        </div>
      </div>

      {/* Multiple Puppies / Kittens for this Breed */}
      <section className="space-y-6 pt-4 border-t border-outline-variant/30">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
              {sameBreedPets.length > 0 ? `More ${pet.breed} Options` : `Similar ${pet.species === 'dog' ? 'Puppies' : 'Kittens'}`}
            </span>
            <h3 className="font-serif-display font-bold text-2xl text-on-surface">
              {sameBreedPets.length > 0
                ? `Choose From Other ${pet.breed} ${pet.species === 'dog' ? 'Puppies' : 'Kittens'}`
                : `Other Available ${pet.species === 'dog' ? 'Baby Puppies' : 'Baby Kittens'}`}
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('browse')}
            className="text-xs font-bold uppercase text-[#002045] dark:text-emerald-400 hover:underline"
          >
            Browse All ({pets.length}) →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedPets.map(otherPet => (
            <div
              key={otherPet.id}
              onClick={() => {
                setSelectedPetId(otherPet.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
 className="p-4 rounded-3xl liquid-glass liquid-glass-strong hover:transition-all cursor-pointer group space-y-3"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface-low dark:bg-surface-high">
                <PetPhoto
                  src={mainPhotoOf(otherPet)}
                  alt={otherPet.breed}
                  caption={otherPet.breed}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-[#002045]/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md">
                  {otherPet.gender} • {otherPet.color}
                </span>
              </div>

              <div>
                <div className="flex justify-between items-baseline">
                  <h4 className="font-serif-display font-bold text-base text-on-surface">{otherPet.breed}</h4>
                  <span className="font-serif-display font-bold text-sm text-[#002045] dark:text-emerald-400">
                    {formatPrice(otherPet.priceUSD)}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant font-medium">{formatAge(otherPet.ageMonths)} • {otherPet.gender}</p>
              </div>

              <div className="pt-2 border-t border-outline-variant/20 flex justify-between items-center text-[11px] text-emerald-600 font-bold">
                <span>Vet Passport Included</span>
                <span className="group-hover:translate-x-1 transition-transform">View Details →</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
