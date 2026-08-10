export interface UserAccount {
  name: string;
  email: string;
  uid?: string;
  role?: 'customer' | 'admin';
  twoFactorVerified?: boolean;
  isLoggedIn: boolean;
  memberSince?: string;
}

export type Species = 'dog' | 'cat';
export type BreedType = 'rare' | 'standard';
export type Gender = 'Male' | 'Female';
export type PetStatus = 'available' | 'reserved' | 'sold';

export interface MedicalInfo {
  overallHealth: 'Excellent' | 'Good' | 'Fair';
  vetExamPassed: boolean;
  vaccinated: boolean;
  vaccinatedDates?: string[];
  dewormed: boolean;
  microchipped: boolean;
  healthCertIncluded: boolean;
  pedigreeCertIncluded: boolean;
  dnaScreeningPassed: boolean;
  lastVetCheckDate: string;
  nextVaccinationDue: string;
  healthGuaranteeDays: number; // e.g. 30, 60, 90
}

export interface BreedDetails {
  history: string;
  lifespan: string;
  exerciseNeeds: 'Low' | 'Moderate' | 'High' | 'Very High';
  groomingRequirements: 'Low' | 'Moderate' | 'High';
  climateSuitability: string;
  temperament: string[];
  commonHealthConcerns: string[];
  trainingDifficulty: 'Easy' | 'Moderate' | 'Advanced';
  recommendedHome: string;
}

export interface Breeder {
  id: string;
  name: string;
  photo: string;
  bio: string;
  experienceYears: number;
  certifications: string[];
  petsSold: number;
  rating: number;
  verified: boolean;
  location: string;
  phone?: string;
  email?: string;
}

export interface Pet {
  id: string;
  name: string;
  species: Species;
  breed: string;
  breedType: BreedType;
  generation?: string; // e.g. "F1", "Purebred AKC", "TICA Champion"
  badgeText?: string;
  ageMonths: number;
  gender: Gender;
  color: string;
  weightKg: number;
  heightCm: number;
  birthDate: string;
  priceUSD: number;
  status: PetStatus;
  rating: number;
  reviewsCount: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  medicalInfo: MedicalInfo;
  personalityTraits: string[];
  breedDetails: BreedDetails;
  images: string[];
  videoUrl?: string;
  views360?: string[];
  breeder: Breeder;
  purchaseIncludes: string[];
  locationCityState: string;
}

export interface CartItem {
  pet: Pet;
  selectedAddOns: {
    insurance: boolean;      // +$25/mo
    starterKit: boolean;     // +$85
    vipTransport: boolean;   // +$150
  };
  totalPriceUSD: number;
}

export interface FilterState {
  species: Species[];
  breedTypes: BreedType[];
  selectedBreeds: string[];
  genders: Gender[];
  minPriceUSD: number;
  maxPriceUSD: number;
  minAgeMonths: number;
  maxAgeMonths: number;
  traits: string[];
  vaccinatedOnly: boolean;
  microchippedOnly: boolean;
  searchQuery: string;
  sortBy: 'recommended' | 'price-asc' | 'price-desc' | 'newest' | 'rating';
}

export interface CustomerReview {
  id: string;
  authorName: string;
  avatar: string;
  rating: number;
  date: string;
  petName: string;
  petBreed: string;
  comment: string;
  verifiedBuyer: boolean;
  location: string;
  petPhotoUrl?: string;
}

export interface CareArticle {
  id: string;
  title: string;
  category: 'Preparation' | 'Nutrition' | 'Healthcare' | 'Grooming' | 'Training';
  summary: string;
  content: string;
  readTime: string;
  image: string;
  author: string;
  publishDate: string;
}

export interface Order {
  id: string;
  pet: Pet;
  orderDate: string;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Payment Confirmed' | 'Vet Pre-Flight Check' | 'Climate Transport Prepared' | 'In Transit' | 'Delivered';
  items?: Array<{ productName: string; quantity: number; price: number; total: number }>;
  buyerEmail?: string;
  subtotal: number;
  addonsTotal: number;
  taxes: number;
  deliveryCost: number;
  totalAmount: number;
  trackingNumber: string;
  estimatedDeliveryDate: string;
  customerName: string;
  deliveryAddress: string;
  cityStateZip: string;
  phone: string;
  paymentMethod: string;
  depositPaid?: boolean;
  depositAmount?: number;
}

export type Currency = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD';
export type Language = 'en' | 'fr' | 'es' | 'de';
