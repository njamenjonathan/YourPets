import React, { useState } from 'react';
import { X, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { usePetStore } from '../context/PetStoreContext';

export const AiQuizModal: React.FC = () => {
  const {
    isQuizOpen,
    setIsQuizOpen,
    pets,
    setSelectedPetId,
    setActiveTab,
    setSearchQuery
  } = usePetStore();

  const [step, setStep] = useState(1);
  const [preferredSpecies, setPreferredSpecies] = useState<'dog' | 'cat' | 'any'>('any');
  const [homeType, setHomeType] = useState('Suburban Estate');
  const [activityLevel, setActivityLevel] = useState('Moderate');
  const [allergyConcerns, setAllergyConcerns] = useState(false);
  const [childrenInHome, setChildrenInHome] = useState(true);
  const [petExperience, setPetExperience] = useState('Intermediate');

  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Array<{ breed: string; score: number; matchReason: string }>>([]);

  if (!isQuizOpen) return null;

  const handleRunQuiz = async () => {
    setIsLoading(true);
    setStep(3);

    try {
      const res = await fetch('/api/ai/recommend-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          homeType,
          activityLevel,
          allergyConcerns,
          childrenInHome,
          petExperience,
          preferredSpecies
        })
      });

      if (res.ok) {
        const data = await res.json();
        setResults(data.recommendations || []);
      } else {
        throw new Error('API request failed');
      }
    } catch (err) {
      // Local fallback
      setResults([
        { breed: preferredSpecies === 'cat' ? 'Persian Kitten' : 'Golden Retriever', score: 98, matchReason: 'Ideal match for family living with excellent temperament and gentleness with children.' },
        { breed: preferredSpecies === 'cat' ? 'Maine Coon' : 'French Bulldog', score: 94, matchReason: 'Highly adaptable to home environment with balanced activity requirements.' },
        { breed: preferredSpecies === 'cat' ? 'Savannah Cat' : 'Samoyed', score: 90, matchReason: 'Stunning companion offering noble intelligence and deep loyalty.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectRecommendation = (breedName: string) => {
    const needle = breedName.toLowerCase();
    const matchedPet = pets.find(
      p => p.breed.toLowerCase().includes(needle) || needle.includes(p.breed.toLowerCase())
    );

    setIsQuizOpen(false);

    if (matchedPet) {
      setSelectedPetId(matchedPet.id);
      setActiveTab('pet-detail');
      return;
    }

    // We do not currently stock that breed — show the closest thing we do have
    // rather than opening an unrelated pet as if it were the match.
    setSearchQuery(breedName.split(' ')[0]);
    setActiveTab('browse');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm modal-backdrop">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#1a1c1e] rounded-3xl shadow-2xl border border-outline-variant/30 overflow-hidden flex flex-col modal-panel">
        {/* Modal Header */}
        <div className="p-6 bg-[#002045] text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h2 className="font-serif-display font-bold text-xl">AI Companion Matchmaker</h2>
          </div>
          <button
            onClick={() => setIsQuizOpen(false)}
            className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Body */}
        <div className="p-6 md:p-8 space-y-6">
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Step 1 of 2</span>
                <h3 className="font-serif-display font-bold text-2xl text-on-surface">What companion are you seeking?</h3>
                <p className="text-xs text-on-surface-variant">Our AI evaluates genetic traits, exercise needs, and home compatibility.</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: 'dog', label: 'Puppy', icon: '🐶' },
                  { id: 'cat', label: 'Kitten', icon: '🐱' },
                  { id: 'any', label: 'Either', icon: '🐾' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setPreferredSpecies(opt.id as any)}
                    className={`p-5 rounded-2xl border-2 text-center flex flex-col items-center gap-2 transition-all ${
                      preferredSpecies === opt.id
                        ? 'border-[#002045] bg-[#002045]/5 dark:border-white dark:bg-white/10 font-bold'
                        : 'border-outline-variant/40 hover:border-[#002045]'
                    }`}
                  >
                    <span className="text-3xl">{opt.icon}</span>
                    <span className="text-xs text-on-surface">{opt.label}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase text-on-surface-variant">Home Environment</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Apartment / Condo', 'Suburban House', 'Spacious Estate'].map(h => (
                    <button
                      key={h}
                      onClick={() => setHomeType(h)}
                      className={`p-3 rounded-xl border text-xs font-medium transition-colors ${
                        homeType === h ? 'border-[#002045] bg-[#002045] text-white' : 'border-outline-variant text-on-surface'
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full bg-[#002045] text-white py-3.5 rounded-xl font-semibold text-xs tracking-wider uppercase hover:bg-[#1a365d] transition-colors flex items-center justify-center gap-2"
              >
                Next Step <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Step 2 of 2</span>
                <h3 className="font-serif-display font-bold text-2xl text-on-surface">Lifestyle & Family Preferences</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-on-surface-variant mb-2">Daily Activity Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Low (Relaxed)', 'Moderate (Daily Walks)', 'Very High (Active Outdoor)'].map(a => (
                      <button
                        key={a}
                        onClick={() => setActivityLevel(a)}
                        className={`p-3 rounded-xl border text-xs font-medium transition-colors ${
                          activityLevel === a ? 'border-[#002045] bg-[#002045] text-white' : 'border-outline-variant text-on-surface'
                        }`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-outline-variant/30 bg-surface-low dark:bg-surface-high">
                  <div>
                    <h4 className="text-xs font-bold text-on-surface">Children at Home</h4>
                    <p className="text-[11px] text-on-surface-variant">Prioritize gentle, patient temperaments</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={childrenInHome}
                    onChange={(e) => setChildrenInHome(e.target.checked)}
                    className="w-5 h-5 rounded text-[#002045] focus:ring-[#002045]"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-outline-variant/30 bg-surface-low dark:bg-surface-high">
                  <div>
                    <h4 className="text-xs font-bold text-on-surface">Hypoallergenic Priority</h4>
                    <p className="text-[11px] text-on-surface-variant">Filter low-shedding breeds</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={allergyConcerns}
                    onChange={(e) => setAllergyConcerns(e.target.checked)}
                    className="w-5 h-5 rounded text-[#002045] focus:ring-[#002045]"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="px-5 py-3 rounded-xl border border-outline-variant text-xs font-semibold text-on-surface hover:bg-surface-low"
                >
                  Back
                </button>
                <button
                  onClick={handleRunQuiz}
                  className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-semibold text-xs tracking-wider uppercase hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  <Sparkles className="w-4 h-4" /> Calculate AI Match
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              {isLoading ? (
                <div className="py-16 text-center space-y-4">
                  <Loader2 className="w-10 h-10 animate-spin mx-auto text-[#002045] dark:text-emerald-400" />
                  <h3 className="font-serif-display font-bold text-xl text-on-surface">Evaluating Genetic & Lifestyle Factors...</h3>
                  <p className="text-xs text-on-surface-variant">Matching with 100% health-certified master breeder listings.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center space-y-1">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200">
                      <Sparkles className="w-3.5 h-3.5" /> Top 3 AI Matches Found
                    </span>
                    <h3 className="font-serif-display font-bold text-2xl text-on-surface">Recommended Companions For You</h3>
                  </div>

                  <div className="space-y-3">
                    {results.map((rec, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-2xl border border-outline-variant/40 bg-surface-low dark:bg-surface-high hover:border-[#002045] transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-serif-display font-bold text-lg text-on-surface">{rec.breed}</h4>
                            <span className="bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full">
                              {rec.score}% Match
                            </span>
                          </div>
                          <p className="text-xs text-on-surface-variant leading-relaxed max-w-md">
                            {rec.matchReason}
                          </p>
                        </div>

                        <button
                          onClick={() => handleSelectRecommendation(rec.breed)}
                          className="bg-[#002045] text-white px-4 py-2.5 rounded-xl font-semibold text-xs hover:bg-[#1a365d] transition-colors flex-shrink-0"
                        >
                          View Matching Pet →
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setStep(1)}
                    className="w-full text-center text-xs text-on-surface-variant hover:text-[#002045] font-semibold py-2"
                  >
                    ← Retake Matchmaker Quiz
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
