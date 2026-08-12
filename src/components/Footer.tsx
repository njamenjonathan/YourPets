import React, { useState } from 'react';
import { ShieldCheck, Mail, CheckCircle2, Phone, MapPin, Send } from 'lucide-react';
import { usePetStore } from '../context/PetStoreContext';
import { WHATSAPP_DISPLAY, whatsappLink } from '../lib/contact';
import { YourPetsWordmark } from './YourPetsLogo';

// TikTok Icon SVG
const TikTokIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-2.901 2.88 2.893 2.893 0 0 1-2.884-2.88 2.893 2.893 0 0 1 2.884-2.881c.243 0 .478.033.702.092V9.387a6.31 6.31 0 0 0-.702-.041 6.328 6.328 0 0 0-6.322 6.326 6.328 6.328 0 0 0 6.322 6.325 6.328 6.328 0 0 0 6.322-6.325V8.508a8.198 8.198 0 0 0 4.887 1.583V6.65a4.79 4.79 0 0 1-1.091.036z" />
  </svg>
);

export const Footer: React.FC = () => {
  const { setActiveTab, setFilterState, showNotification } = usePetStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const browseWith = (species?: 'dog' | 'cat', breedType?: 'rare' | 'standard') => {
    setFilterState(prev => ({
      ...prev,
      species: species ? [species] : [],
      breedTypes: breedType ? [breedType] : []
    }));
    setActiveTab('browse');
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    showNotification('Thanks for subscribing — we will email you when new pets arrive.');
    setEmail('');
  };

  return (
    <footer className="w-full bg-white dark:bg-[#1a1c1e] text-on-surface border-t border-outline-variant/30 transition-colors">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 pt-16 pb-20 md:pb-12">
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-outline-variant/30">
          {/* Col 1 & 2: Brand & Newsletter */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <YourPetsWordmark className="text-[#002045] dark:text-white" textClassName="text-3xl" />
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase gold-badge">
                Luxury Standard
              </span>
            </div>

            <p className="text-sm text-on-surface-variant max-w-sm leading-relaxed">
              Elevating companion care through radical transparency, ethical breeding standards, comprehensive 40-point health checks, and lifetime veterinary support.
            </p>

            {/* TikTok Social Highlight */}
            <div className="pt-1">
              <a
                href="https://www.tiktok.com/@yourpets6?_r=1&_t=ZT-98e7qti1ijV"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-black hover:bg-neutral-800 text-white text-xs font-bold transition-all shadow-sm border border-neutral-700"
              >
                <TikTokIcon className="w-4 h-4 text-cyan-400" />
                <span>Follow us on TikTok</span>
                <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black">@yourpets6</span>
              </a>
            </div>

            {/* Newsletter Box */}
            <div className="pt-2">
              <h4 className="text-sm font-semibold text-[#002045] dark:text-white mb-2 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-emerald-600" /> Join Our Companion Club
              </h4>
              <p className="text-xs text-on-surface-variant mb-3">
                Be first to hear when new puppies, kittens and rare breeds arrive.
              </p>

              {subscribed ? (
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  You are on the list — we will be in touch when new pets arrive.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder=""
                    required
                    className="flex-1 bg-surface-low dark:bg-surface-high border border-outline-variant rounded-full px-4 py-2.5 text-xs text-on-surface focus:outline-none focus:border-[#002045]"
                  />
                  <button
                    type="submit"
                    className="bg-[#002045] text-white px-5 py-2.5 rounded-full text-xs font-semibold hover:bg-[#1a365d] transition-colors flex items-center gap-1 shadow-sm"
                  >
                    Subscribe <Send className="w-3 h-3" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Col 3: Navigation Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#002045] dark:text-white">
              Explore Collections
            </h4>
            <ul className="space-y-2 text-xs text-on-surface-variant">
              <li>
                <button onClick={() => browseWith('dog')} className="hover:text-[#002045] dark:hover:text-white transition-colors">
                  Shop Puppies
                </button>
              </li>
              <li>
                <button onClick={() => browseWith('cat')} className="hover:text-[#002045] dark:hover:text-white transition-colors">
                  Shop Kittens
                </button>
              </li>
              <li>
                <button onClick={() => browseWith(undefined, 'rare')} className="hover:text-[#002045] dark:hover:text-white transition-colors">
                  Rare & Exotic Breeds
                </button>
              </li>
              <li>
                <button onClick={() => browseWith()} className="hover:text-[#002045] dark:hover:text-white transition-colors">
                  View Full Catalog
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Transparency */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#002045] dark:text-white">
              Trust & Support
            </h4>
            <ul className="space-y-2 text-xs text-on-surface-variant">
              <li>
                <button onClick={() => setActiveTab('health-guarantee')} className="hover:text-[#002045] dark:hover:text-white transition-colors">
                  90-Day Health Guarantee
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('breeders')} className="hover:text-[#002045] dark:hover:text-white transition-colors">
                  Master Breeder Verification
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('pet-care')} className="hover:text-[#002045] dark:hover:text-white transition-colors">
                  Pet Care & Nutrition Center
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('faqs')} className="hover:text-[#002045] dark:hover:text-white transition-colors">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('contact')} className="hover:text-[#002045] dark:hover:text-white transition-colors">
                  Concierge Live Support
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Contact Info & Accreditation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#002045] dark:text-white">
              Concierge HQ
            </h4>
            <div className="space-y-2 text-xs text-on-surface-variant">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /> Beverly Hills, CA & Aspen, CO
              </p>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-emerald-600 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /> WhatsApp: {WHATSAPP_DISPLAY}
              </a>
              <a
                href="mailto:craftking990@gmail.com"
                className="flex items-center gap-2 hover:text-emerald-600 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /> craftking990@gmail.com
              </a>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 text-[11px] font-semibold border border-emerald-200/60">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> USDA Licensed Partner
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 text-center md:text-left text-xs text-on-surface-variant">
          <p>© 2026 YourPets Luxury E-Commerce. Ethical Breeding & Health Guaranteed.</p>
        </div>
      </div>
    </footer>
  );
};
