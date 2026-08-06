import React from 'react';
import {
  Sparkles, ShieldCheck, Award, Heart, ArrowRight, Camera,
  CheckCircle2, Stethoscope, Plane, Users, Star, BookOpen, HelpCircle
} from 'lucide-react';
import { usePetStore } from '../context/PetStoreContext';
import { PetCard } from '../components/PetCard';
import { SAMPLE_REVIEWS, SAMPLE_ARTICLES, SAMPLE_FAQS } from '../data/pets';

export const HomeView: React.FC = () => {
  const {
    pets,
    breeders,
    setActiveTab,
    setIsQuizOpen,
    setIsBreedIdentifierOpen,
    setFilterState,
    setSelectedPetId,
    setSelectedBreeder
  } = usePetStore();

  const featuredPets = pets.filter(p => p.isFeatured || p.isBestSeller).slice(0, 4);
  const rarePets = pets.filter(p => p.breedType === 'rare').slice(0, 3);
  const newArrivals = pets.filter(p => p.isNewArrival || p.ageMonths <= 3).slice(0, 4);

  const handleCategoryClick = (species?: 'dog' | 'cat', breedType?: 'rare' | 'standard') => {
    setFilterState(prev => ({
      ...prev,
      species: species ? [species] : [],
      breedTypes: breedType ? [breedType] : []
    }));
    setActiveTab('browse');
  };

  return (
    <div className="space-y-20 animate-fade-in pb-12">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-[#002045] text-white my-4 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-[#002045] via-[#002045]/90 to-transparent z-10 pointer-events-none" />
        <img
          src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=1600"
          alt="Luxury Companion Puppies and Kittens"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-40 transform scale-105"
        />

        <div className="relative z-20 max-w-3xl px-6 py-20 md:py-28 md:px-12 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            100% Health Certified & Ethically Bred Companions
          </div>

          <h1 className="font-serif-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.15]">
            Find Your Perfect Companion
          </h1>

          <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-xl">
            Welcome to YourPets, the world's premier marketplace for healthy, pedigree puppies and kittens. Complete health transparency, genetic screening, and climate flight delivery.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => handleCategoryClick('dog')}
              className="bg-white text-[#002045] px-6 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-emerald-50 transition-all shadow-lg flex items-center gap-2"
              id="hero-shop-puppies-btn"
            >
              Shop Puppies <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleCategoryClick('cat')}
              className="bg-emerald-600 text-white px-6 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-emerald-700 transition-all shadow-lg flex items-center gap-2"
              id="hero-shop-kittens-btn"
            >
              Shop Kittens <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsBreedIdentifierOpen(true)}
              className="bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-400/40 px-6 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-2"
              id="hero-photo-scan-btn"
            >
              <Camera className="w-4 h-4 text-emerald-300" /> Photo Breed & Price Scan
            </button>

            <button
              onClick={() => setIsQuizOpen(true)}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-6 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" /> AI Pet Matchmaker
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/15 max-w-lg text-xs">
            <div>
              <div className="font-serif-display font-bold text-2xl text-white">100%</div>
              <p className="text-white/70 text-[11px]">Vet Exam Passed</p>
            </div>
            <div>
              <div className="font-serif-display font-bold text-2xl text-emerald-300">90-Day</div>
              <p className="text-white/70 text-[11px]">Health Guarantee</p>
            </div>
            <div>
              <div className="font-serif-display font-bold text-2xl text-amber-300">4.9★</div>
              <p className="text-white/70 text-[11px]">Verified Buyers</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Category Bento Grid */}
      <section className="space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Curated Collections</span>
          <h2 className="font-serif-display font-bold text-3xl md:text-4xl text-on-surface">Explore Pet Categories</h2>
          <p className="text-xs text-on-surface-variant">Browse ethically raised standard breeds and rare international lineages.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Category 1: Puppies */}
          <div
            onClick={() => handleCategoryClick('dog', 'standard')}
            className="group relative h-72 rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all"
          >
            <img
              src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=800"
              alt="Healthy Puppies"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6 flex flex-col justify-end text-white">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">AKC Registered</span>
              <h3 className="font-serif-display font-bold text-2xl">Puppies</h3>
              <p className="text-xs text-white/80 mt-1 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Explore All Puppies →
              </p>
            </div>
          </div>

          {/* Category 2: Kittens */}
          <div
            onClick={() => handleCategoryClick('cat', 'standard')}
            className="group relative h-72 rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all"
          >
            <img
              src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800"
              alt="Purebred Kittens"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6 flex flex-col justify-end text-white">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">TICA Pedigreed</span>
              <h3 className="font-serif-display font-bold text-2xl">Kittens</h3>
              <p className="text-xs text-white/80 mt-1 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Explore All Kittens →
              </p>
            </div>
          </div>

          {/* Category 3: Rare Breeds */}
          <div
            onClick={() => handleCategoryClick(undefined, 'rare')}
            className="group relative h-72 rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all"
          >
            <img
              src="https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&q=80&w=800"
              alt="Rare Breed VIP"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6 flex flex-col justify-end text-white">
              <span className="gold-badge px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider w-fit mb-1">
                Champagne Gold
              </span>
              <h3 className="font-serif-display font-bold text-2xl">Rare Breeds VIP</h3>
              <p className="text-xs text-white/80 mt-1 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                F1 Savannahs, Mastiffs & More →
              </p>
            </div>
          </div>

          {/* Category 4: AI Match Quiz Banner */}
          <div
            onClick={() => setIsQuizOpen(true)}
            className="relative h-72 rounded-3xl overflow-hidden cursor-pointer shadow-md bg-gradient-to-br from-[#002045] to-[#1a365d] text-white p-6 flex flex-col justify-between hover:scale-[1.02] transition-all border border-white/10"
          >
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] uppercase">
                <Sparkles className="w-3 h-3" /> Smart Quiz
              </span>
              <h3 className="font-serif-display font-bold text-2xl leading-tight">
                Not sure which breed fits your lifestyle?
              </h3>
              <p className="text-xs text-white/80">
                Take our 2-minute AI match quiz for personalized recommendations.
              </p>
            </div>

            <button className="bg-white text-[#002045] py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-emerald-50 transition-colors w-full text-center">
              Start Quiz Now →
            </button>
          </div>
        </div>
      </section>

      {/* 3. Featured Companions */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Handpicked Excellence</span>
            <h2 className="font-serif-display font-bold text-3xl text-on-surface">Featured Pets</h2>
          </div>
          <button
            onClick={() => setActiveTab('browse')}
            className="text-xs font-bold uppercase tracking-wider text-[#002045] dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            View All Catalog ({pets.length}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredPets.map(pet => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      </section>

      {/* 4. Rare Breeds VIP Spotlight */}
      <section className="p-8 md:p-12 rounded-3xl bg-surface-low dark:bg-surface-high border border-outline-variant/30 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="space-y-2 max-w-xl">
            <span className="gold-badge px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest inline-flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Rare Breed VIP Reserve
            </span>
            <h2 className="font-serif-display font-bold text-3xl md:text-4xl text-on-surface">
              Exotic Lineages & Rare Heritage
            </h2>
            <p className="text-xs text-on-surface-variant">
              Exclusively sourced from master breeders around the world with full pedigree verification and VIP climate flight escort.
            </p>
          </div>

          <button
            onClick={() => handleCategoryClick(undefined, 'rare')}
            className="bg-[#002045] text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#1a365d] transition-colors"
          >
            Explore All Rare Breeds
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rarePets.map(pet => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      </section>

      {/* 5. Why Choose YourPets (Trust Badges) */}
      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">The YourPets Promise</span>
          <h2 className="font-serif-display font-bold text-3xl md:text-4xl text-on-surface">Radical Transparency & Care</h2>
          <p className="text-xs text-on-surface-variant">We pioneer the highest ethical standards in companion animal matchmaking.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <Stethoscope className="w-8 h-8 text-emerald-600" />,
              title: '40-Point Vet Exam',
              desc: 'Every puppy and kitten undergoes thorough veterinary examination, organ screening, and dental evaluation prior to listing.'
            },
            {
              icon: <ShieldCheck className="w-8 h-8 text-emerald-600" />,
              title: '90-Day Health Guarantee',
              desc: 'Comprehensive protection against congenital or hereditary conditions, backed by our partner veterinary network.'
            },
            {
              icon: <Users className="w-8 h-8 text-emerald-600" />,
              title: 'Master Breeder Vetting',
              desc: 'We partner strictly with licensed AKC/TICA master breeders adhering to zero-caging ethical welfare policies.'
            },
            {
              icon: <Plane className="w-8 h-8 text-emerald-600" />,
              title: 'VIP Flight Nanny',
              desc: 'Climate-controlled ground transport or flight nanny escort cabin delivery directly to your home.'
            }
          ].map((item, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white dark:bg-[#1f2226] border border-outline-variant/30 space-y-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 w-fit">
                {item.icon}
              </div>
              <h3 className="font-serif-display font-bold text-lg text-on-surface">{item.title}</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Verified Breeders Showcase */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Ethical Partners</span>
            <h2 className="font-serif-display font-bold text-3xl text-on-surface">Verified Master Breeders</h2>
          </div>
          <button
            onClick={() => setActiveTab('breeders')}
            className="text-xs font-bold uppercase tracking-wider text-[#002045] dark:text-emerald-400 hover:underline"
          >
            Meet All Breeders →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {breeders.map(b => (
            <div key={b.id} className="p-6 rounded-2xl bg-white dark:bg-[#1f2226] border border-outline-variant/30 space-y-4 shadow-sm">
              <div className="flex items-center gap-4">
                <img src={b.photo} alt={b.name} className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500" />
                <div>
                  <h3 className="font-serif-display font-bold text-base text-on-surface">{b.name}</h3>
                  <p className="text-xs text-on-surface-variant">{b.location}</p>
                  <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified ({b.experienceYears} Years Exp.)
                  </p>
                </div>
              </div>

              <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">
                {b.bio}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20 text-xs">
                <span className="font-bold text-[#002045] dark:text-emerald-400">Rating: {b.rating}★ ({b.petsSold}+ placed)</span>
                <button
                  onClick={() => {
                    setSelectedBreeder(b);
                    setActiveTab('breeders');
                  }}
                  className="font-semibold text-xs text-[#002045] hover:underline"
                >
                  View Cattery / Kennel →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Real Customer Reviews */}
      <section className="p-8 md:p-12 rounded-3xl bg-[#002045] text-white space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">Verified Buyer Testimonials</span>
          <h2 className="font-serif-display font-bold text-3xl md:text-4xl">Stories from Happy Pet Parents</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SAMPLE_REVIEWS.map(r => (
            <div key={r.id} className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-300">
                  {Array.from({ length: r.rating }).map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-amber-300" />
                  ))}
                </div>
                <p className="text-xs text-white/90 italic leading-relaxed">"{r.comment}"</p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                <img src={r.avatar} alt={r.authorName} className="w-10 h-10 rounded-full object-cover" />
                <div className="text-xs">
                  <h4 className="font-bold text-white">{r.authorName}</h4>
                  <p className="text-emerald-300 text-[11px]">{r.petName} ({r.petBreed}) • {r.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Care Guide Articles */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Pet Wellness</span>
            <h2 className="font-serif-display font-bold text-3xl text-on-surface">Latest Care Guide Articles</h2>
          </div>
          <button
            onClick={() => setActiveTab('pet-care')}
            className="text-xs font-bold uppercase tracking-wider text-[#002045] dark:text-emerald-400 hover:underline"
          >
            Read All Articles →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SAMPLE_ARTICLES.map(art => (
            <div
              key={art.id}
              onClick={() => setActiveTab('pet-care')}
              className="group bg-white dark:bg-[#1f2226] rounded-2xl border border-outline-variant/30 overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all"
            >
              <div className="h-44 overflow-hidden">
                <img src={art.image} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full">
                  {art.category}
                </span>
                <h3 className="font-serif-display font-bold text-base text-on-surface group-hover:text-[#002045] transition-colors">
                  {art.title}
                </h3>
                <p className="text-xs text-on-surface-variant line-clamp-2">
                  {art.summary}
                </p>
                <div className="pt-2 text-[11px] text-on-surface-variant font-medium">
                  {art.readTime} • By {art.author}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
