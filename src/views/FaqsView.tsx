import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { SAMPLE_FAQS } from '../data/pets';
import { usePetStore } from '../context/PetStoreContext';

export const FaqsView: React.FC = () => {
  const { setIsChatOpen } = usePetStore();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      <div className="p-8 rounded-3xl bg-[#002045] text-white shadow-xl">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Help Center</span>
        <h1 className="font-serif-display font-bold text-3xl md:text-4xl">Frequently Asked Questions</h1>
        <p className="text-xs text-white/80 mt-1">Everything you need to know about purchasing, health guarantees, and climate transport.</p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {SAMPLE_FAQS.map((faq, i) => {
          const isOpen = openIdx === i;
          return (
            <div key={i} className="rounded-2xl liquid-glass liquid-glass-strong overflow-hidden">
              <button
                onClick={() => setOpenIdx(isOpen ? null : i)}
                className="w-full p-5 text-left flex justify-between items-center font-bold text-sm text-on-surface"
              >
                <span>{faq.q}</span>
                {isOpen ? <ChevronUp className="w-5 h-5 text-emerald-600" /> : <ChevronDown className="w-5 h-5 text-outline" />}
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-xs text-on-surface-variant leading-relaxed border-t border-outline-variant/20 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-8 rounded-3xl bg-surface-low dark:bg-surface-high text-center space-y-3 max-w-xl mx-auto border border-outline-variant/30">
        <h3 className="font-serif-display font-bold text-xl text-on-surface">Still have questions?</h3>
        <p className="text-xs text-on-surface-variant">Our licensed veterinary concierges are available 24/7 to assist you.</p>
        <button
          onClick={() => setIsChatOpen(true)}
          className="bg-[#002045] text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider"
        >
          Open Live Concierge Chat
        </button>
      </div>
    </div>
  );
};
