import React from 'react';
import { SAMPLE_ARTICLES } from '../data/pets';

export const PetCareView: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in pb-16">
      <div className="p-8 rounded-3xl bg-[#002045] text-white shadow-xl">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Veterinary Knowledge Base</span>
        <h1 className="font-serif-display font-bold text-3xl md:text-4xl">Pet Care & Nutrition Center</h1>
        <p className="text-xs text-white/80 mt-1">Expert advice on home preparation, nutrition, grooming, and training for puppies and kittens.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SAMPLE_ARTICLES.map(art => (
          <article key={art.id} className="bg-white dark:bg-[#1f2226] rounded-3xl border border-outline-variant/30 overflow-hidden shadow-sm flex flex-col justify-between">
            <img src={art.image} alt={art.title} className="h-48 w-full object-cover" />
            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full">
                  {art.category}
                </span>
                <h3 className="font-serif-display font-bold text-lg text-on-surface mt-2">{art.title}</h3>
                <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">{art.summary}</p>
              </div>

              <div className="pt-4 border-t border-outline-variant/20 text-[11px] text-on-surface-variant flex justify-between items-center">
                <span>{art.readTime}</span>
                <span>By {art.author}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
