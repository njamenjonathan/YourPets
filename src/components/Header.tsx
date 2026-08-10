import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Heart, ShoppingBag, Menu, X, Sun, Moon, Sparkles, Camera,
  User, ShieldCheck, HelpCircle, PhoneCall, BookOpen, Layers, PawPrint
} from 'lucide-react';
import { usePetStore } from '../context/PetStoreContext';
import { Currency, Language } from '../types';


const YourPetsLogo: React.FC = () => (
  <span
    className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[1.35rem] border border-amber-300/70 bg-[#002045] shadow-lg shadow-[#002045]/15 transition-transform duration-500 ease-out group-hover:scale-105 group-hover:rotate-[-3deg] dark:border-amber-200/40"
    aria-hidden="true"
  >
    <span className="absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(255,255,255,0.95),transparent_24%),linear-gradient(135deg,rgba(250,204,21,0.96),rgba(16,185,129,0.72)_42%,rgba(0,32,69,0.15)_72%)]" />
    <span className="absolute -bottom-5 -right-4 h-14 w-14 rounded-full bg-emerald-300/30 blur-sm" />
    <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white/80 blur-[1px]" />
    <PawPrint className="relative z-10 h-6 w-6 -rotate-12 text-white drop-shadow-md" strokeWidth={2.8} />
    <span className="absolute bottom-2 right-2 z-10 h-2.5 w-2.5 rounded-full border border-white/80 bg-amber-300" />
  </span>
);

export const Header: React.FC = () => {
  const {
    currency, setCurrency,
    language, setLanguage,
    darkMode, setDarkMode,
    wishlist, cart,
    activeTab, setActiveTab,
    searchQuery, setSearchQuery,
    setIsQuizOpen,
    setIsBreedIdentifierOpen,
    setIsChatOpen,
    setIsCompareOpen,
    compareList,
    currentUser,
    setIsAuthModalOpen
  } = usePetStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // AI Search Suggestions fetch
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setAiSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoadingAi(true);
      try {
        const res = await fetch('/api/ai/search-suggestions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: searchQuery })
        });
        if (res.ok) {
          const data = await res.json();
          setAiSuggestions(data.suggestions || []);
        }
      } catch (err) {
        console.error('AI Suggestion error', err);
      } finally {
        setIsLoadingAi(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const cartItemsCount = cart.length;
  const wishlistCount = wishlist.length;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#f9f9f9]/90 dark:bg-[#1a1c1e]/90 backdrop-blur-xl border-b border-outline-variant/30 dark:border-outline-variant/10 transition-colors">
      {/* Top Banner / Utility Bar */}
      <div className="bg-[#002045] text-white text-xs py-2 px-4 md:px-8 flex justify-between items-center font-medium">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-secondary-container">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Health Guaranteed & USDA Licensed
          </span>
          <a
            href="https://wa.me/13305161283"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-emerald-300 hover:text-white transition-colors"
          >
            <PhoneCall className="w-3 h-3" /> WhatsApp: +1 (330) 516-1283
          </a>
          <a
            href="https://www.tiktok.com/@yourpets6?_r=1&_t=ZT-98e7qti1ijV"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 bg-white/10 hover:bg-white/20 text-cyan-300 hover:text-white px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-colors"
            id="header-top-tiktok-btn"
          >
            <span>TikTok @yourpets6</span>
          </a>
        </div>

        <div className="flex items-center gap-4">
          {/* Currency Switcher */}
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as Currency)}
            className="bg-transparent text-white border-none text-xs focus:ring-0 cursor-pointer font-semibold py-0 pl-1 pr-4"
          >
            <option value="USD" className="bg-[#002045] text-white">USD ($)</option>
            <option value="EUR" className="bg-[#002045] text-white">EUR (€)</option>
            <option value="GBP" className="bg-[#002045] text-white">GBP (£)</option>
            <option value="CAD" className="bg-[#002045] text-white">CAD ($)</option>
            <option value="AUD" className="bg-[#002045] text-white">AUD ($)</option>
          </select>

          {/* Language Switcher */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="bg-transparent text-white border-none text-xs focus:ring-0 cursor-pointer font-semibold py-0 pl-1 pr-4"
          >
            <option value="en" className="bg-[#002045] text-white">EN (English)</option>
            <option value="fr" className="bg-[#002045] text-white">FR (Français)</option>
            <option value="es" className="bg-[#002045] text-white">ES (Español)</option>
            <option value="de" className="bg-[#002045] text-white">DE (Deutsch)</option>
          </select>

          {/* Dark / Light Toggle */}
          <button
            onClick={() => setDarkMode(prev => !prev)}
            className="p-1 hover:text-secondary-fixed transition-colors rounded-full"
            title="Toggle Theme Mode"
            id="theme-toggle-btn"
          >
            {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main App Navigation Bar */}
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3 lg:gap-4 xl:gap-6">
        {/* Left: Mobile Drawer Trigger + Brand Logo with divider */}
        <div className="flex items-center gap-3 pr-3 lg:pr-5 border-r border-outline-variant/30 dark:border-outline-variant/10 shrink-0">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-[#002045] dark:text-white hover:bg-surface-variant/50 rounded-full transition-colors"
            id="mobile-menu-trigger"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <button
            onClick={() => setActiveTab('home')}
            className="text-left group flex items-center gap-2.5"
            id="brand-logo"
          >
            <YourPetsLogo />
            <div className="flex flex-col min-w-0">
              <span className="font-serif-display text-2xl lg:text-3xl font-bold tracking-tight text-[#002045] dark:text-white group-hover:opacity-90 transition-opacity leading-none whitespace-nowrap">
                YourPets
              </span>
              <span className="text-[9px] font-extrabold tracking-widest uppercase text-amber-600 dark:text-amber-400 leading-none mt-1 whitespace-nowrap">
                Luxury Concierge
              </span>
            </div>
          </button>
        </div>

        {/* Center: Primary Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-3 xl:gap-6 2xl:gap-8 text-xs xl:text-sm font-medium shrink min-w-0">
          <button
            onClick={() => setActiveTab('home')}
            className={`transition-colors whitespace-nowrap shrink-0 ${activeTab === 'home' ? 'text-[#002045] dark:text-white font-bold border-b-2 border-[#002045] dark:border-white pb-1' : 'text-on-surface-variant hover:text-[#002045] dark:hover:text-white'}`}
          >
            Home
          </button>

          <button
            onClick={() => setActiveTab('browse')}
            className={`transition-colors whitespace-nowrap shrink-0 ${activeTab === 'browse' ? 'text-[#002045] dark:text-white font-bold border-b-2 border-[#002045] dark:border-white pb-1' : 'text-on-surface-variant hover:text-[#002045] dark:hover:text-white'}`}
          >
            Browse
          </button>

          <button
            onClick={() => setActiveTab('health-guarantee')}
            className={`transition-colors whitespace-nowrap shrink-0 ${activeTab === 'health-guarantee' ? 'text-[#002045] dark:text-white font-bold border-b-2 border-[#002045] dark:border-white pb-1' : 'text-on-surface-variant hover:text-[#002045] dark:hover:text-white'}`}
          >
            Health Guarantee
          </button>

          <button
            onClick={() => setActiveTab('breeders')}
            className={`transition-colors whitespace-nowrap shrink-0 ${activeTab === 'breeders' ? 'text-[#002045] dark:text-white font-bold border-b-2 border-[#002045] dark:border-white pb-1' : 'text-on-surface-variant hover:text-[#002045] dark:hover:text-white'}`}
          >
            Breeders
          </button>

          <button
            onClick={() => setActiveTab('pet-care')}
            className={`transition-colors whitespace-nowrap shrink-0 ${activeTab === 'pet-care' ? 'text-[#002045] dark:text-white font-bold border-b-2 border-[#002045] dark:border-white pb-1' : 'text-on-surface-variant hover:text-[#002045] dark:hover:text-white'}`}
          >
            Care Guide
          </button>

          <button
            onClick={() => setActiveTab('faqs')}
            className={`transition-colors whitespace-nowrap shrink-0 ${activeTab === 'faqs' ? 'text-[#002045] dark:text-white font-bold border-b-2 border-[#002045] dark:border-white pb-1' : 'text-on-surface-variant hover:text-[#002045] dark:hover:text-white'}`}
          >
            FAQs
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`transition-colors whitespace-nowrap shrink-0 ${activeTab === 'contact' ? 'text-[#002045] dark:text-white font-bold border-b-2 border-[#002045] dark:border-white pb-1' : 'text-on-surface-variant hover:text-[#002045] dark:hover:text-white'}`}
          >
            Contact
          </button>
        </nav>

        {/* Right: Search, Wishlist, Cart & Profile Actions */}
        <div className="flex items-center gap-2 xl:gap-3 shrink-0 ml-auto">
          {/* AI Breed Quiz Trigger */}
          <button
            onClick={() => setIsQuizOpen(true)}
            className="hidden 2xl:flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200 transition-colors shadow-sm shrink-0"
            id="ai-quiz-nav-btn"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            AI Match
          </button>

          {/* Expandable Circular Search Bar */}
          <div className="relative">
            {!isSearchExpanded && searchQuery.trim().length === 0 ? (
              <button
                onClick={() => {
                  setIsSearchExpanded(true);
                  setTimeout(() => searchInputRef.current?.focus(), 50);
                }}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border border-outline-variant/60 bg-white dark:bg-[#282c31] text-[#002045] dark:text-white hover:border-[#002045] dark:hover:border-white hover:bg-surface-low transition-all shadow-sm shrink-0"
                title="Search breeds..."
                id="search-icon-circle-btn"
              >
                <Search className="w-4 h-4 text-outline" />
              </button>
            ) : (
              <div className="relative flex items-center w-48 sm:w-56 lg:w-60 transition-all duration-300 ease-in-out">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search breeds..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (activeTab !== 'browse') setActiveTab('browse');
                  }}
                  onFocus={() => {
                    setIsSearchExpanded(true);
                    setIsSearchFocused(true);
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      setIsSearchFocused(false);
                      if (!searchQuery.trim()) {
                        setIsSearchExpanded(false);
                      }
                    }, 200);
                  }}
                  className="w-full pl-9 pr-8 py-2 rounded-full text-xs border border-outline-variant/60 bg-white dark:bg-[#282c31] text-on-surface focus:outline-none focus:border-[#002045] dark:focus:border-white transition-all shadow-sm"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchExpanded(false);
                    setIsSearchFocused(false);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface p-1 rounded-full hover:bg-surface-variant/50 transition-colors"
                  title="Close Search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                {/* AI Search Suggestions Dropdown */}
                {isSearchFocused && aiSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1f2226] rounded-xl shadow-xl border border-outline-variant/30 p-2 z-50 text-xs">
                    <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 px-2 py-1">
                      <Sparkles className="w-3 h-3" /> AI Smart Suggestions
                    </div>
                    {aiSuggestions.map((sug, i) => (
                      <button
                        key={i}
                        onMouseDown={() => {
                          setSearchQuery(sug);
                          if (activeTab !== 'browse') setActiveTab('browse');
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-surface-low dark:hover:bg-surface-high transition-colors text-on-surface"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={() => {
              if (!currentUser?.isLoggedIn) {
                setIsAuthModalOpen(true);
              } else {
                setActiveTab('wishlist');
              }
            }}
            className={`relative flex items-center gap-1.5 px-3 py-2 rounded-full transition-colors border shrink-0 ${
              activeTab === 'wishlist'
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 text-rose-700 dark:text-rose-300 font-bold'
                : 'border-outline-variant/30 hover:bg-surface-low dark:hover:bg-surface-high text-[#002045] dark:text-white'
            }`}
            title="View Wishlist"
            id="wishlist-nav-btn"
          >
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
            <span className="text-xs font-semibold hidden sm:inline">Wishlist</span>
            {wishlistCount > 0 && (
              <span className="bg-rose-500 text-white font-bold text-[10px] px-1.5 py-0.2 rounded-full ml-0.5">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={() => {
              if (!currentUser?.isLoggedIn) {
                setIsAuthModalOpen(true);
              } else {
                setActiveTab('cart');
              }
            }}
            className="relative p-2 rounded-full bg-[#002045] text-white hover:bg-[#1a365d] transition-colors flex items-center gap-1.5 px-3.5 py-2 shadow-sm shrink-0"
            id="cart-nav-btn"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-xs font-semibold hidden sm:inline">Cart</span>
            {cartItemsCount > 0 && (
              <span className="bg-emerald-400 text-emerald-950 font-bold text-[10px] px-1.5 py-0.2 rounded-full">
                {cartItemsCount}
              </span>
            )}
          </button>

          {/* User Account / Profile - ALWAYS VISIBLE */}
          <button
            onClick={() => {
              if (!currentUser || !currentUser.isLoggedIn) {
                setIsAuthModalOpen(true);
              } else {
                setActiveTab('dashboard');
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full border transition-all shrink-0 ${
              currentUser?.isLoggedIn
                ? 'border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/60'
                : 'border-outline-variant/40 hover:bg-surface-low dark:hover:bg-surface-high text-[#002045] dark:text-white'
            }`}
            title="My Account & VIP Portal"
            id="account-nav-btn"
          >
            <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-bold hidden sm:inline">
              {currentUser?.isLoggedIn ? currentUser.name.split(' ')[0] : 'Sign In'}
            </span>
          </button>

          {/* Admin Toggle Shortcut */}
          <button
            onClick={() => setActiveTab('admin')}
            className="hidden 2xl:inline-block text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-2.5 py-1 rounded-full border border-amber-300 dark:border-amber-700 shrink-0"
          >
            Admin
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-outline-variant/30 bg-[#f9f9f9] dark:bg-[#1a1c1e] px-6 py-6 space-y-4 font-medium text-sm">
          {/* Mobile Search Bar */}
          <div className="relative mb-4">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
            <input
              type="text"
              placeholder="Search breeds, traits..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== 'browse') setActiveTab('browse');
              }}
              className="w-full pl-9 pr-4 py-2.5 rounded-full text-xs border border-outline-variant bg-white dark:bg-[#282c31]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 pb-4 border-b border-outline-variant/30">
            <button
              onClick={() => { setActiveTab('home'); setIsMobileMenuOpen(false); }}
              className="text-left py-2 px-3 rounded-lg hover:bg-surface-low dark:hover:bg-surface-high"
            >
              Home
            </button>
            <button
              onClick={() => { setActiveTab('browse'); setIsMobileMenuOpen(false); }}
              className="text-left py-2 px-3 rounded-lg hover:bg-surface-low dark:hover:bg-surface-high"
            >
              Browse Pets
            </button>
            <button
              onClick={() => { setActiveTab('health-guarantee'); setIsMobileMenuOpen(false); }}
              className="text-left py-2 px-3 rounded-lg hover:bg-surface-low dark:hover:bg-surface-high"
            >
              Health Guarantee
            </button>
            <button
              onClick={() => { setActiveTab('breeders'); setIsMobileMenuOpen(false); }}
              className="text-left py-2 px-3 rounded-lg hover:bg-surface-low dark:hover:bg-surface-high"
            >
              Verified Breeders
            </button>
            <button
              onClick={() => { setActiveTab('pet-care'); setIsMobileMenuOpen(false); }}
              className="text-left py-2 px-3 rounded-lg hover:bg-surface-low dark:hover:bg-surface-high"
            >
              Pet Care Guide
            </button>
            <button
              onClick={() => { setActiveTab('faqs'); setIsMobileMenuOpen(false); }}
              className="text-left py-2 px-3 rounded-lg hover:bg-surface-low dark:hover:bg-surface-high"
            >
              FAQs
            </button>
            <button
              onClick={() => { setActiveTab('contact'); setIsMobileMenuOpen(false); }}
              className="text-left py-2 px-3 rounded-lg hover:bg-surface-low dark:hover:bg-surface-high"
            >
              Contact Us
            </button>
            <button
              onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
              className="text-left py-2 px-3 rounded-lg hover:bg-surface-low dark:hover:bg-surface-high"
            >
              My Account
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
            <button
              onClick={() => { setIsBreedIdentifierOpen(true); setIsMobileMenuOpen(false); }}
              className="flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 px-4 py-2 rounded-full"
            >
              <Camera className="w-4 h-4" /> Photo Breed Scan
            </button>

            <button
              onClick={() => { setIsQuizOpen(true); setIsMobileMenuOpen(false); }}
              className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/40 px-4 py-2 rounded-full"
            >
              <Sparkles className="w-4 h-4" /> AI Match
            </button>

            <button
              onClick={() => { setActiveTab('admin'); setIsMobileMenuOpen(false); }}
              className="text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/40 px-4 py-2 rounded-full"
            >
              Admin
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
