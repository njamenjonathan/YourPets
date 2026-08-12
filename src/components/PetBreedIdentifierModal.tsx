import React, { useState } from 'react';
import { Camera, Upload, Sparkles, X, CheckCircle, ShieldCheck, RefreshCw, AlertCircle } from 'lucide-react';
import { usePetStore } from '../context/PetStoreContext';
import { mainPhotoOf } from '../lib/petImages';
import { PetPhoto } from './PetPhoto';
import { Pet } from '../types';

interface BreedAnalysisResult {
  breedName: string;
  species: string;
  confidence: number;
  estimatedBabyPetPriceUSD: number;
  priceRangeUSD: string;
  temperament: string;
  careLevel: string;
  sizeCategory: string;
  hypoallergenic: boolean;
  description: string;
}

const SAMPLE_PRESETS = [
  {
    name: 'French Bulldog Puppy',
    url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Golden Retriever',
    url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Persian Kitten',
    url: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Maine Coon Kitten',
    url: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=800'
  }
];

export const PetBreedIdentifierModal: React.FC = () => {
  const {
    isBreedIdentifierOpen,
    setIsBreedIdentifierOpen,
    pets,
    formatPrice,
    openReserveModal,
    setSelectedPetId,
    setActiveTab,
    showNotification
  } = usePetStore();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<BreedAnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isBreedIdentifierOpen) return null;

  const MAX_UPLOAD_BYTES = 6 * 1024 * 1024;

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select an image file (JPEG, PNG or WebP).');
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setErrorMsg('That photo is larger than 6 MB. Please choose a smaller one.');
      return;
    }
    setErrorMsg(null);
    setMimeType(file.type);

    const reader = new FileReader();
    reader.onload = () => {
      const base64Url = reader.result as string;
      setImagePreview(base64Url);
      analyzePhoto(base64Url, file.type);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = async (presetUrl: string) => {
    setErrorMsg(null);
    setIsAnalyzing(true);
    setResult(null);
    setImagePreview(presetUrl);

    try {
      // Fetch image and convert to base64 for API
      const resp = await fetch(presetUrl);
      const blob = await resp.blob();
      const type = blob.type || 'image/jpeg';
      setMimeType(type);

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Url = reader.result as string;
        analyzePhoto(base64Url, type);
      };
      reader.readAsDataURL(blob);
    } catch (e) {
      console.error('Preset load error:', e);
      setIsAnalyzing(false);
      setErrorMsg('Failed to load sample image. Please upload a photo.');
    }
  };

  const analyzePhoto = async (base64Url: string, type: string) => {
    setIsAnalyzing(true);
    setErrorMsg(null);
    setResult(null);

    try {
      const response = await fetch('/api/ai/identify-breed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Url,
          mimeType: type
        })
      });

      if (!response.ok) {
        throw new Error('Breed analysis server request failed');
      }

      const data: BreedAnalysisResult = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error('Breed identification error:', err);
      // Never invent a result: a made-up breed and price would look identical to
      // a real analysis. Say the scan failed and offer a human instead.
      setResult(null);
      setErrorMsg('We could not analyse that photo right now. Please try another photo, or send it to us on WhatsApp and we will identify it for you.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Find matching pets in nursery stock
  const matchingPets: Pet[] = result
    ? pets.filter(p =>
        p.breed.toLowerCase().includes(result.breedName.toLowerCase()) ||
        result.breedName.toLowerCase().includes(p.breed.toLowerCase()) ||
        p.species.toLowerCase() === result.species.toLowerCase()
      ).slice(0, 3)
    : [];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#1a1c1e] rounded-3xl shadow-2xl border border-outline-variant/30 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header Bar */}
        <div className="flex items-center justify-between p-5 md:p-6 border-b border-outline-variant/30 bg-gradient-to-r from-emerald-950 via-[#002045] to-emerald-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shadow-inner">
              <Camera className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif-display text-xl md:text-2xl font-bold tracking-tight text-white">
                  AI Pet Breed & Price Identifier
                </h2>
                <span className="bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-300" /> Gemini Vision
                </span>
              </div>
              <p className="text-xs text-emerald-100/80 mt-0.5">
                Upload a photo to recognize the exact breed and baby pet market value
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsBreedIdentifierOpen(false)}
            className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Upload Zone & Sample Presets */}
          {!imagePreview ? (
            <div className="space-y-6">
              {/* Dropzone */}
              <label className="border-2 border-dashed border-emerald-500/40 hover:border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-3xl p-8 md:p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all group">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleImageFile(e.target.files[0]);
                    }
                  }}
                />
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md">
                  <Upload className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-on-surface mb-1">
                  Click or drag pet photo here
                </h3>
                <p className="text-xs text-on-surface-variant max-w-sm">
                  Upload a clear photo of any dog, cat, or pet. Gemini AI Vision will analyze facial features, coat texture, and size to identify the breed.
                </p>
                <div className="mt-4 px-4 py-2 rounded-full bg-white dark:bg-[#282c31] border border-outline-variant/40 text-xs font-semibold text-emerald-700 dark:text-emerald-400 shadow-sm flex items-center gap-1.5">
                  <Camera className="w-4 h-4" /> Choose Photo from Device
                </div>
              </label>

              {/* Sample Preset Photos */}
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-outline mb-3">
                  Or test with sample pet photos:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {SAMPLE_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectPreset(preset.url)}
                      className="group relative rounded-2xl overflow-hidden border border-outline-variant/40 hover:border-emerald-500 text-left transition-all shadow-sm hover:shadow-md"
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-full h-24 object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-2">
                        <span className="text-[11px] font-bold text-white line-clamp-1">
                          {preset.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Photo Preview Card with Scanner Animation */}
              <div className="relative rounded-3xl overflow-hidden border border-outline-variant/40 bg-black max-h-72 flex items-center justify-center shadow-lg">
                <img
                  src={imagePreview}
                  alt="Uploaded Pet"
                  className="w-full h-72 object-contain bg-black/90"
                />

                {/* Laser Scanning Overlay during analysis */}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-white">
                    <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent absolute top-0 animate-ping" />
                    <div className="w-16 h-16 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin mb-3" />
                    <p className="text-sm font-bold text-emerald-300 animate-pulse">
                      Gemini Vision analyzing pet features...
                    </p>
                    <p className="text-[11px] text-emerald-100/70 mt-1">
                      Checking coat patterns, facial structure, & nursery pricing
                    </p>
                  </div>
                )}

                {/* Change photo button */}
                {!isAnalyzing && (
                  <button
                    onClick={() => {
                      setImagePreview(null);
                      setResult(null);
                    }}
                    className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white text-xs font-semibold backdrop-blur-md transition-all flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Upload Different Photo
                  </button>
                )}
              </div>

              {/* Error Alert */}
              {errorMsg && (
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Identification Results */}
              {result && !isAnalyzing && (
                <div className="space-y-6 animate-fade-in">
                  {/* Top Match Card */}
                  <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50/80 via-white to-amber-50/50 dark:from-emerald-950/30 dark:via-[#22252a] dark:to-amber-950/20 border border-emerald-500/30 shadow-md">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-emerald-500/20">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-600 text-white tracking-wider flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> {result.confidence}% Match
                          </span>
                          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                            {result.species} • {result.sizeCategory}
                          </span>
                        </div>
                        <h3 className="font-serif-display text-2xl md:text-3xl font-bold text-[#002045] dark:text-white">
                          {result.breedName}
                        </h3>
                      </div>

                      {/* Baby Pet Price Box */}
                      <div className="bg-white dark:bg-[#1a1c1e] p-4 rounded-2xl border border-amber-500/30 shadow-sm text-left md:text-right">
                        <div className="text-[10px] font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                          Baby Pet Market Price
                        </div>
                        <div className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400">
                          {formatPrice(result.estimatedBabyPetPriceUSD)}
                        </div>
                        <div className="text-[11px] text-on-surface-variant font-medium">
                          Range: {result.priceRangeUSD}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-on-surface-variant leading-relaxed mt-4">
                      {result.description}
                    </p>

                    {/* Key Attributes Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-outline-variant/30 text-xs">
                      <div className="p-3 rounded-xl bg-white/80 dark:bg-[#282c31]/80 border border-outline-variant/30">
                        <div className="text-[10px] text-outline uppercase font-bold">Temperament</div>
                        <div className="font-semibold text-on-surface mt-0.5 line-clamp-1">{result.temperament}</div>
                      </div>

                      <div className="p-3 rounded-xl bg-white/80 dark:bg-[#282c31]/80 border border-outline-variant/30">
                        <div className="text-[10px] text-outline uppercase font-bold">Care Difficulty</div>
                        <div className="font-semibold text-on-surface mt-0.5">{result.careLevel}</div>
                      </div>

                      <div className="p-3 rounded-xl bg-white/80 dark:bg-[#282c31]/80 border border-outline-variant/30">
                        <div className="text-[10px] text-outline uppercase font-bold">Hypoallergenic</div>
                        <div className="font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                          {result.hypoallergenic ? 'Yes (Coat Safe)' : 'Standard Grooming'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Matching Baby Pets in Store */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-bold text-on-surface flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        Available {result.breedName} Baby Pets in Nursery ({matchingPets.length})
                      </h4>
                      <button
                        onClick={() => {
                          setIsBreedIdentifierOpen(false);
                          setActiveTab('browse');
                        }}
                        className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
                      >
                        Browse All Pets &rarr;
                      </button>
                    </div>

                    {matchingPets.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {matchingPets.map((pet) => (
                          <div
                            key={pet.id}
                            className="bg-surface-low dark:bg-surface-high p-3 rounded-2xl border border-outline-variant/40 flex flex-col justify-between hover:border-emerald-500 transition-all"
                          >
                            <div>
                              <PetPhoto
                                src={mainPhotoOf(pet)}
                                alt={pet.breed}
                                caption={pet.breed}
                                className="w-full h-28 object-cover rounded-xl mb-2"
                              />
                              <div className="font-bold text-xs text-on-surface">{pet.breed}</div>
                              <div className="text-[11px] text-on-surface-variant">{pet.ageMonths} months • {pet.gender}</div>
                              <div className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 mt-1">
                                {formatPrice(pet.priceUSD)}
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                setIsBreedIdentifierOpen(false);
                                openReserveModal(pet);
                              }}
                              className="mt-3 w-full py-1.5 bg-[#002045] text-white rounded-xl text-xs font-bold hover:bg-[#1a365d] transition-colors"
                            >
                              Reserve
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-5 rounded-2xl bg-surface-low dark:bg-surface-high border border-outline-variant/30 text-center">
                        <p className="text-xs text-on-surface-variant">
                          No exact {result.breedName} baby puppies currently listed today. Contact our concierge to request a custom placement from our certified breeder network!
                        </p>
                        <button
                          onClick={() => {
                            setIsBreedIdentifierOpen(false);
                            setActiveTab('contact');
                          }}
                          className="mt-2 px-4 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors inline-block"
                        >
                          Request Custom Breed Placement
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
