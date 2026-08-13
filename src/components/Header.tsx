import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Heart, ShoppingBag, Menu, X, Sun, Moon, Sparkles, Camera,
  User, ShieldCheck, PhoneCall
} from 'lucide-react';
import { usePetStore } from '../context/PetStoreContext';
import { WHATSAPP_DISPLAY, whatsappLink } from '../lib/contact';
import { YourPetsWordmark } from './YourPetsLogo';
import { Currency } from '../types';


const NAV_LINKS: Array<{ tab: string; label: string }> = [
  { tab: 'home', label: 'Home' },
  { tab: 'browse', label: 'Browse' },
  { tab: 'health-guarantee', label: 'Health Guarantee' },
  { tab: 'breeders', label: 'Breeders' },
  { tab: 'pet-care', label: 'Care Guide' },
  { tab: 'faqs', label: 'FAQs' },
  { tab: 'contact', label: 'Contact' }
];

/** Only meaningful once there is an account to hold the orders. */
const SIGNED_IN_LINK = { tab: 'order-tracking', label: 'My Orders' };


export const Header: React.FC = () => {
  const {
    currency, setCurrency,
    darkMode, setDarkMode,
    wishlist, cart,
    activeTab, setActiveTab,
    searchQuery, setSearchQuery,
    setIsQuizOpen,
    setIsBreedIdentifierOpen,
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

  // A live query keeps the field unfurled even after focus moves away.
  const isSearchOpen = isSearchExpanded || searchQuery.trim().length > 0;

  const cartItemsCount = cart.length;
  const wishlistCount = wishlist.length;
  const isAdmin = currentUser?.isLoggedIn && currentUser.role === 'admin';

  // The row only has room for the full link set at lg. An unfurled search field
  // or the extra signed-in link pushes it past that, so the drawer takes over
  // until xl rather than letting the links run under the search.
  const navNeedsXl = isSearchOpen || Boolean(currentUser?.isLoggedIn);

  // "My Orders" appears for signed-in customers only.
  const navLinks = currentUser?.isLoggedIn
    ? [NAV_LINKS[0], NAV_LINKS[1], SIGNED_IN_LINK, ...NAV_LINKS.slice(2)]
    : NAV_LINKS;

  return (
    <header className="liquid-glass liquid-header fixed top-0 left-0 right-0 z-50">
      {/* Top Banner / Utility Bar */}
      <div className="bg-[#002045] text-white text-xs py-2 px-4 md:px-8 flex justify-between items-center font-medium">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-secondary-container">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Health Guaranteed & USDA Licensed
          </span>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-emerald-300 hover:text-white transition-colors"
          >
            <PhoneCall className="w-3 h-3" /> WhatsApp: {WHATSAPP_DISPLAY}
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
        <div className={`flex items-center gap-3 pr-3 lg:pr-5 shrink-0 ${isSearchOpen ? 'max-md:pr-0 max-md:border-r-0' : ''} border-r border-outline-variant/30 dark:border-outline-variant/10`}>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`liquid-glass liquid-pill ${navNeedsXl ? 'xl:hidden' : 'lg:hidden'} p-2 text-[#002045] dark:text-white`}
            id="mobile-menu-trigger"
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {/* The two icons cross-fade and counter-rotate so the control
                morphs rather than swapping glyphs. */}
            <span className="relative block w-6 h-6">
              <Menu
                className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
                  isMobileMenuOpen ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'
                }`}
              />
              <X
                className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
                  isMobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'
                }`}
              />
            </span>
          </button>

          {/* On a phone the unfurled field needs the whole bar, so the wordmark
              steps aside rather than shoving the cart and account off-screen. */}
          <button
            onClick={() => setActiveTab('home')}
            className={`text-left group items-center gap-2.5 ${isSearchOpen ? 'hidden md:flex' : 'flex'}`}
            id="brand-logo"
          >
            <YourPetsWordmark
              className="text-[#002045] dark:text-white group-hover:opacity-90 transition-opacity"
              textClassName="text-2xl lg:text-3xl"
              tagline="Luxury Concierge"
              taglineClassName="text-[9px] font-extrabold tracking-widest uppercase text-amber-600 dark:text-amber-400"
            />
          </button>
        </div>

        {/* Center: Primary Links (Desktop)

            The padding/negative-margin pair keeps the active tab's glass capsule
            (which bleeds outside the button box) from being clipped by the
            overflow rule, and the overflow rule is what stops the links from
            spilling over the search field when the row runs out of room. */}
        <nav className={`hidden ${navNeedsXl ? 'xl:flex' : 'lg:flex'} items-center gap-3 xl:gap-4 2xl:gap-8 text-xs 2xl:text-sm font-medium shrink-[0.05] min-w-0 overflow-x-auto no-scrollbar px-3 -mx-3 py-2 -my-2`}>
          {navLinks.map(link => (
            <button
              key={link.tab}
              onClick={() => setActiveTab(link.tab)}
              className={`liquid-tab whitespace-nowrap shrink-0 no-press ${activeTab === link.tab ? 'is-active text-[#002045] dark:text-white font-bold' : 'nav-link text-on-surface-variant hover:text-[#002045] dark:hover:text-white'}`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right: Search, Wishlist, Cart & Profile Actions */}
        <div className="flex items-center gap-2 xl:gap-3 grow justify-end">
          {/* Expandable Circular Search Bar.

              Once unfurled the field grows into whatever space the row has left
              over (`flex-1` starts it from a zero basis) instead of claiming a
              fixed width the nav then has to give up, so it can never grow
              across the links. */}
          <div className={isSearchOpen ? 'relative flex-1 min-w-24 max-w-60' : 'relative shrink-0'}>
            {!isSearchOpen ? (
              <button
                onClick={() => {
                  setIsSearchExpanded(true);
                  setTimeout(() => searchInputRef.current?.focus(), 50);
                }}
                className="liquid-glass liquid-pill w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-[#002045] dark:text-white shrink-0"
                title="Search breeds..."
                id="search-icon-circle-btn"
              >
                <Search className="w-4 h-4 text-outline" />
              </button>
            ) : (
              <div className="liquid-glass liquid-pill liquid-search relative flex items-center w-full">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder=""
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
                  className="w-full bg-transparent border-none pl-9 pr-8 py-2 text-xs text-on-surface placeholder:text-outline focus:outline-none"
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
                  <div className="liquid-glass liquid-glass-nested liquid-pop absolute top-full left-0 right-0 mt-2 rounded-2xl p-2 z-50 text-xs">
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
            className={`liquid-glass liquid-pill relative flex items-center gap-1.5 px-3 py-2 shrink-0 ${
              activeTab === 'wishlist'
                ? 'liquid-tint-rose text-rose-700 dark:text-rose-200 font-bold'
                : 'text-[#002045] dark:text-white'
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
            className="liquid-glass liquid-pill liquid-sheen liquid-tint-primary relative text-white flex items-center gap-1.5 px-3.5 py-2 shrink-0"
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
            className={`liquid-glass liquid-pill flex items-center gap-1.5 px-3 py-2 shrink-0 ${
              currentUser?.isLoggedIn
                ? 'liquid-tint-emerald text-emerald-900 dark:text-emerald-200'
                : 'text-[#002045] dark:text-white'
            }`}
            title="My Account & VIP Portal"
            id="account-nav-btn"
          >
            <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-bold hidden sm:inline">
              {currentUser?.isLoggedIn ? currentUser.name.split(' ')[0] : 'Sign In'}
            </span>
          </button>

          {/* Admin Shortcut (admins only) */}
          {isAdmin && (
            <button
              onClick={() => setActiveTab('admin')}
              className="liquid-glass liquid-pill liquid-tint-amber hidden xl:inline-block text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 px-2.5 py-1 shrink-0"
            >
              Admin
            </button>
          )}
        </div>
      </div>

      {/* Mobile Sidebar Menu */}
      {isMobileMenuOpen && (
        <div className="liquid-glass liquid-glass-nested liquid-sheet lg:hidden border-x-0 border-b-0 rounded-none px-6 py-6 space-y-4 font-medium text-sm">
          {/* Mobile Search Bar */}
          <div className="relative mb-4">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
            <input
              type="text"
              placeholder=""
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== 'browse') setActiveTab('browse');
              }}
              className="liquid-glass liquid-pill w-full pl-9 pr-4 py-2.5 text-xs text-on-surface focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 pb-4 border-b border-outline-variant/30">
            {navLinks.map(link => (
              <button
                key={link.tab}
                onClick={() => { setActiveTab(link.tab); setIsMobileMenuOpen(false); }}
                className={`liquid-glass liquid-lift text-left py-2 px-3 rounded-xl ${
                  activeTab === link.tab ? 'liquid-tint-primary text-white font-bold' : ''
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
              className="liquid-glass liquid-lift text-left py-2 px-3 rounded-xl"
            >
              My Account
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              onClick={() => { setIsBreedIdentifierOpen(true); setIsMobileMenuOpen(false); }}
              className="liquid-glass liquid-pill liquid-sheen liquid-tint-secondary flex items-center gap-1.5 text-xs font-bold text-white px-4 py-2"
            >
              <Camera className="w-4 h-4" /> Photo Breed Scan
            </button>

            <button
              onClick={() => { setIsQuizOpen(true); setIsMobileMenuOpen(false); }}
              className="liquid-glass liquid-pill liquid-tint-emerald flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 px-4 py-2"
            >
              <Sparkles className="w-4 h-4" /> AI Match
            </button>

            {isAdmin && (
              <button
                onClick={() => { setActiveTab('admin'); setIsMobileMenuOpen(false); }}
                className="liquid-glass liquid-pill liquid-tint-amber text-xs font-bold text-amber-800 dark:text-amber-300 px-4 py-2"
              >
                Admin
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
