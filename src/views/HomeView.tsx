import React from 'react';
import {
  Sparkles, ShieldCheck, ArrowRight, Camera,
  Stethoscope, Plane, Users, Star
} from 'lucide-react';
import { usePetStore } from '../context/PetStoreContext';
import { breedPhoto } from '../lib/petImages';
import { Avatar, PetPhoto } from '../components/PetPhoto';
import { PetCard } from '../components/PetCard';
import { SAMPLE_REVIEWS } from '../data/pets';

export const HomeView: React.FC = () => {
  const {
    pets,
    setActiveTab,
    setIsQuizOpen,
    setIsBreedIdentifierOpen,
    setFilterState
  } = usePetStore();

  // Looked up by breed rather than imported by file name, so renaming or
  // replacing a photo never breaks the build.
  const heroPhoto = breedPhoto('Golden Retriever');
  const puppiesPhoto = breedPhoto('Samoyed');
  const kittensPhoto = breedPhoto('Ragdoll Kitten');
  const rarePhoto = breedPhoto('Savannah Cat');

  // One card per pet: highlights come first, then the rest of the catalog fills in.
  const highlightedPets = [
    ...pets.filter(p => p.isFeatured || p.isBestSeller),
    ...pets.filter(p => !p.isFeatured && !p.isBestSeller)
  ].slice(0, 8);

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
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#002045] via-[#04305f] to-emerald-950 text-white my-4 shadow-2xl">
        <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center px-6 py-16 md:py-20 md:px-12">
        <div className="lg:col-span-7 space-y-6">
          <div className="liquid-glass liquid-glass-onDark liquid-shimmer inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-300">
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
              className="liquid-glass liquid-pill liquid-sheen liquid-tint-light text-[#002045] px-6 py-3.5 font-bold text-xs uppercase tracking-wider flex items-center gap-2"
              id="hero-shop-puppies-btn"
            >
              Shop Puppies <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleCategoryClick('cat')}
              className="liquid-glass liquid-pill liquid-sheen liquid-tint-secondary text-white px-6 py-3.5 font-bold text-xs uppercase tracking-wider flex items-center gap-2"
              id="hero-shop-kittens-btn"
            >
              Shop Kittens <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsBreedIdentifierOpen(true)}
              className="liquid-glass liquid-pill liquid-sheen liquid-glass-onDark text-emerald-200 px-6 py-3.5 font-bold text-xs uppercase tracking-wider flex items-center gap-2"
              id="hero-photo-scan-btn"
            >
              <Camera className="w-4 h-4 text-emerald-300" /> Photo Breed Scan
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

          {/* Real photos, shown at their natural size rather than stretched
              across the banner. */}
          <div className="hidden lg:grid lg:col-span-5 grid-cols-2 gap-4">
            {[
              { src: heroPhoto, alt: 'Golden Retriever puppy' },
              { src: puppiesPhoto, alt: 'Samoyed puppy' },
              { src: rarePhoto, alt: 'Savannah kitten' },
              { src: kittensPhoto, alt: 'Ragdoll kitten' }
            ].map(photo => (
              <PetPhoto
                key={photo.alt}
                src={photo.src}
                alt={photo.alt}
                className="liquid-float aspect-square w-full rounded-3xl object-cover shadow-xl ring-1 ring-white/15"
              />
            ))}
          </div>
        </div>
      </section>

      {/* 2. Category Bento Grid */}
      <section className="reveal space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Curated Collections</span>
          <h2 className="font-serif-display font-bold text-3xl md:text-4xl text-on-surface">Explore Pet Categories</h2>
          <p className="text-xs text-on-surface-variant">Browse ethically raised standard breeds and rare international lineages.</p>
        </div>

        <div className="stagger-children grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Category 1: Puppies */}
          <div
            onClick={() => handleCategoryClick('dog', 'standard')}
            className="group liquid-lift relative h-72 rounded-3xl overflow-hidden cursor-pointer shadow-md"
          >
            <PetPhoto
              src={puppiesPhoto}
              alt="Puppies"
              caption="Puppies"
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
            className="group liquid-lift relative h-72 rounded-3xl overflow-hidden cursor-pointer shadow-md"
          >
            <PetPhoto
              src={kittensPhoto}
              alt="Kittens"
              caption="Kittens"
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
            className="group liquid-lift relative h-72 rounded-3xl overflow-hidden cursor-pointer shadow-md"
          >
            <PetPhoto
              src={rarePhoto}
              alt="Rare breeds"
              caption="Rare breeds"
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
            className="liquid-glass liquid-sheen liquid-tint-primary liquid-lift relative h-72 rounded-3xl cursor-pointer text-white p-6 flex flex-col justify-between"
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

            <button className="liquid-glass liquid-tint-light text-[#002045] py-3 rounded-xl font-bold text-xs uppercase tracking-wider w-full text-center">
              Start Quiz Now →
            </button>
          </div>
        </div>
      </section>

      {/* 3. Featured Companions */}
      <section className="reveal space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Handpicked Excellence</span>
            <h2 className="font-serif-display font-bold text-3xl text-on-surface">Available Companions</h2>
          </div>
          <button
            onClick={() => setActiveTab('browse')}
            className="text-xs font-bold uppercase tracking-wider text-[#002045] dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            View All Catalog ({pets.length}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="stagger-children grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlightedPets.map(pet => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      </section>

      {/* 4. Why Choose YourPets (Trust Badges) */}
      <section className="reveal space-y-8">
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
            <div key={i} className="liquid-glass liquid-glass-strong liquid-lift liquid-sheen p-6 rounded-3xl space-y-3">
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 w-fit">
                {item.icon}
              </div>
              <h3 className="font-serif-display font-bold text-lg text-on-surface">{item.title}</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Real Customer Reviews */}
      <section className="reveal p-8 md:p-12 rounded-3xl bg-[#002045] text-white space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">Verified Buyer Testimonials</span>
          <h2 className="font-serif-display font-bold text-3xl md:text-4xl">Stories from Happy Pet Parents</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SAMPLE_REVIEWS.map(r => (
            <div key={r.id} className="liquid-glass liquid-glass-onDark liquid-lift p-6 rounded-3xl space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-300">
                  {Array.from({ length: r.rating }).map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-amber-300" />
                  ))}
                </div>
                <p className="text-xs text-white/90 italic leading-relaxed">"{r.comment}"</p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                <Avatar src={r.avatar} name={r.authorName} className="w-10 h-10 rounded-full object-cover shrink-0" />
                <div className="text-xs">
                  <h4 className="font-bold text-white">{r.authorName}</h4>
                  <p className="text-emerald-300 text-[11px]">{r.petBreed} • {r.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
