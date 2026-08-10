import { Pet, Breeder, CustomerReview, CareArticle } from '../types';

export const SAMPLE_BREEDERS: Breeder[] = [
  {
    id: 'b1',
    name: 'Beverly Hills Pedigrees',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
    bio: 'Licensed AKC Master Breeder specializing in Golden Retrievers, French Bulldogs, and Teacup Puppies with over 18 years of ethical lineage preservation.',
    experienceYears: 18,
    certifications: ['AKC Breeder of Merit', 'PETA Ethical Partner', 'Licensed Vet Tech On-Staff'],
    petsSold: 1420,
    rating: 4.9,
    verified: true,
    location: 'Beverly Hills, California',
    email: 'contact@beverlyhillspedigrees.com',
    phone: '+1 (330) 516-1283'
  },
  {
    id: 'b2',
    name: 'Highland Exotic Reserve',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    bio: 'Pioneering international breeder of certified rare feline baby lineages including F1 Savannahs, Sphynx, and TICA Champion Bengals.',
    experienceYears: 14,
    certifications: ['TICA Master Cattery', 'International Feline Genetics Board', 'USDA Class A Certified'],
    petsSold: 890,
    rating: 5.0,
    verified: true,
    location: 'Aspen, Colorado',
    email: 'info@highlandexotics.com',
    phone: '+1 (330) 516-1283'
  },
  {
    id: 'b3',
    name: 'Royal Heritage Kennels',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
    bio: 'Dedicated to preserving ancient standard and rare canine baby breeds with pristine DNA health clearances and royal lineage heritage.',
    experienceYears: 22,
    certifications: ['FCI Global Excellence Award', 'Orthopedic Foundation for Animals (OFA) Gold Partner'],
    petsSold: 2100,
    rating: 4.95,
    verified: true,
    location: 'Greenwich, Connecticut',
    email: 'concierge@royalheritage.com',
    phone: '+1 (330) 516-1283'
  }
];

export const SAMPLE_PETS: Pet[] = [
  // 1. Golden Retriever - Bella
  {
    id: 'pet-1',
    name: 'Bella',
    species: 'dog',
    breed: 'Golden Retriever',
    breedType: 'standard',
    generation: 'Purebred AKC Baby',
    badgeText: 'Best Seller',
    ageMonths: 2,
    gender: 'Female',
    color: 'Honey Cream',
    weightKg: 2.1,
    heightCm: 16,
    birthDate: '2026-06-01',
    priceUSD: 220,
    status: 'available',
    rating: 4.9,
    reviewsCount: 38,
    isFeatured: true,
    isBestSeller: true,
    locationCityState: 'Beverly Hills, CA',
    breeder: SAMPLE_BREEDERS[0],
    medicalInfo: {
      overallHealth: 'Excellent',
      vetExamPassed: true,
      vaccinated: true,
      vaccinatedDates: ['2026-07-01', '2026-07-20'],
      dewormed: true,
      microchipped: true,
      healthCertIncluded: true,
      pedigreeCertIncluded: true,
      dnaScreeningPassed: true,
      lastVetCheckDate: '2026-08-01',
      nextVaccinationDue: '2026-09-15',
      healthGuaranteeDays: 90
    },
    personalityTraits: ['Friendly', 'Playful', 'Gentle', 'Intelligent', 'Affectionate', 'Good with Children'],
    breedDetails: {
      history: 'Originating in Scotland in the mid-19th century, Golden Retrievers are world-famous for their loving demeanor and intelligence.',
      lifespan: '10 - 12 years',
      exerciseNeeds: 'High',
      groomingRequirements: 'Moderate',
      climateSuitability: 'Adaptable',
      temperament: ['Gentle', 'Playful', 'Eager to please'],
      commonHealthConcerns: ['Hip Dysplasia', 'Eye Clearances'],
      trainingDifficulty: 'Easy',
      recommendedHome: 'Family homes with yard space.'
    },
    images: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/Golden%20Retriever%20puppy%20standing.jpg?width=1200'
    ],
    purchaseIncludes: [
      'Official Veterinary Health Certificate',
      'AKC Registration & Pedigree Papers',
      'Vaccination Passport & Microchip',
      'Puppy Starter Pack & Plush Toy',
      '90-Day Health Guarantee'
    ]
  },
  // 1b. Golden Retriever - Cooper (Second Golden Retriever Puppy)
  {
    id: 'pet-1b',
    name: 'Cooper',
    species: 'dog',
    breed: 'Golden Retriever',
    breedType: 'standard',
    generation: 'AKC Master Lineage',
    badgeText: 'New Arrival',
    ageMonths: 2,
    gender: 'Male',
    color: 'Golden Amber',
    weightKg: 2.3,
    heightCm: 17,
    birthDate: '2026-06-05',
    priceUSD: 240,
    status: 'available',
    rating: 4.95,
    reviewsCount: 15,
    isNewArrival: true,
    locationCityState: 'Beverly Hills, CA',
    breeder: SAMPLE_BREEDERS[0],
    medicalInfo: {
      overallHealth: 'Excellent',
      vetExamPassed: true,
      vaccinated: true,
      vaccinatedDates: ['2026-07-05', '2026-07-25'],
      dewormed: true,
      microchipped: true,
      healthCertIncluded: true,
      pedigreeCertIncluded: true,
      dnaScreeningPassed: true,
      lastVetCheckDate: '2026-08-02',
      nextVaccinationDue: '2026-09-18',
      healthGuaranteeDays: 90
    },
    personalityTraits: ['Playful', 'Cuddly', 'Eager to Please', 'Good with Children', 'Social'],
    breedDetails: {
      history: 'Famous for intelligence, warmth, and loyal devotion to family members.',
      lifespan: '10 - 12 years',
      exerciseNeeds: 'High',
      groomingRequirements: 'Moderate',
      climateSuitability: 'Adaptable',
      temperament: ['Gentle', 'Friendly', 'Intelligent'],
      commonHealthConcerns: ['Hip & Elbow Certified Clear'],
      trainingDifficulty: 'Easy',
      recommendedHome: 'Family homes and active owners.'
    },
    images: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/Golden%20Retriever%20puppy%20%283813393%29.jpg?width=1200'
    ],
    purchaseIncludes: [
      'AKC Pedigree Papers',
      'Full Vet Exam Clearance',
      'Puppy Collar & Starter Kibble',
      '90-Day Guarantee'
    ]
  },
  // 2. F1 Savannah Cat - Aura
  {
    id: 'pet-2',
    name: 'Aura',
    species: 'cat',
    breed: 'Savannah Cat',
    breedType: 'rare',
    generation: 'F1 Generation Baby',
    badgeText: 'Rare Breed VIP',
    ageMonths: 2,
    gender: 'Female',
    color: 'Leopard Spotted',
    weightKg: 1.2,
    heightCm: 18,
    birthDate: '2026-06-05',
    priceUSD: 300,
    status: 'available',
    rating: 5.0,
    reviewsCount: 14,
    isFeatured: true,
    locationCityState: 'Aspen, CO',
    breeder: SAMPLE_BREEDERS[1],
    medicalInfo: {
      overallHealth: 'Excellent',
      vetExamPassed: true,
      vaccinated: true,
      vaccinatedDates: ['2026-07-10', '2026-07-28'],
      dewormed: true,
      microchipped: true,
      healthCertIncluded: true,
      pedigreeCertIncluded: true,
      dnaScreeningPassed: true,
      lastVetCheckDate: '2026-08-02',
      nextVaccinationDue: '2026-09-10',
      healthGuaranteeDays: 90
    },
    personalityTraits: ['Intelligent', 'Energetic', 'Affectionate', 'Loyal', 'Majestic'],
    breedDetails: {
      history: 'A hybrid cross between a domestic feline and an African Serval. Rare cheetah-like tear stains and dog-like devotion.',
      lifespan: '15 - 20 years',
      exerciseNeeds: 'High',
      groomingRequirements: 'Low',
      climateSuitability: 'Indoor Climate-Controlled',
      temperament: ['Curious', 'Devoted', 'Playful'],
      commonHealthConcerns: ['HCM Screened Clear'],
      trainingDifficulty: 'Moderate',
      recommendedHome: 'Enriched home with play space.'
    },
    images: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/Savannah%20kitten.jpg?width=1200'
    ],
    purchaseIncludes: [
      'TICA Certified F1 Pedigree Certificate',
      'DNA Screening Report',
      'Microchip & GPS Collar Tag',
      '90-Day VIP Health Guarantee'
    ]
  },
  // 2b. F1 Savannah Cat - Zelda (Second Savannah Kitten)
  {
    id: 'pet-2b',
    name: 'Zelda',
    species: 'cat',
    breed: 'Savannah Cat',
    breedType: 'rare',
    generation: 'F2 Generation Baby',
    badgeText: 'Rare Exotic',
    ageMonths: 2,
    gender: 'Female',
    color: 'Silver Serval Rosettes',
    weightKg: 1.1,
    heightCm: 17,
    birthDate: '2026-06-12',
    priceUSD: 280,
    status: 'available',
    rating: 4.95,
    reviewsCount: 11,
    isFeatured: true,
    locationCityState: 'Aspen, CO',
    breeder: SAMPLE_BREEDERS[1],
    medicalInfo: {
      overallHealth: 'Excellent',
      vetExamPassed: true,
      vaccinated: true,
      vaccinatedDates: ['2026-07-12'],
      dewormed: true,
      microchipped: true,
      healthCertIncluded: true,
      pedigreeCertIncluded: true,
      dnaScreeningPassed: true,
      lastVetCheckDate: '2026-08-01',
      nextVaccinationDue: '2026-09-08',
      healthGuaranteeDays: 90
    },
    personalityTraits: ['Curious', 'Playful', 'Hypoallergenic', 'Smart', 'Athletic'],
    breedDetails: {
      history: 'Graceful wild rosettes and exotic tall ears combined with sweet housecat affection.',
      lifespan: '15 - 20 years',
      exerciseNeeds: 'High',
      groomingRequirements: 'Low',
      climateSuitability: 'Indoor',
      temperament: ['Active', 'Intelligent', 'Loving'],
      commonHealthConcerns: ['Genetic Screening Passed'],
      trainingDifficulty: 'Easy',
      recommendedHome: 'Attentive, active owners.'
    },
    images: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/Savannah%20Kittens%20F2b%201week%20old.jpg?width=1200'
    ],
    purchaseIncludes: [
      'TICA Registration Papers',
      'Veterinary Health Certificate',
      'Kitten Play Tunnel & Toys',
      '90-Day Guarantee'
    ]
  },
  // 3. French Bulldog - Milo
  {
    id: 'pet-3',
    name: 'Milo',
    species: 'dog',
    breed: 'French Bulldog',
    breedType: 'standard',
    generation: 'AKC Registered Baby',
    badgeText: 'Featured',
    ageMonths: 1,
    gender: 'Male',
    color: 'Lilac Fawn',
    weightKg: 1.1,
    heightCm: 12,
    birthDate: '2026-06-25',
    priceUSD: 260,
    status: 'available',
    rating: 4.95,
    reviewsCount: 41,
    isFeatured: true,
    locationCityState: 'Beverly Hills, CA',
    breeder: SAMPLE_BREEDERS[0],
    medicalInfo: {
      overallHealth: 'Excellent',
      vetExamPassed: true,
      vaccinated: true,
      vaccinatedDates: ['2026-07-20'],
      dewormed: true,
      microchipped: true,
      healthCertIncluded: true,
      pedigreeCertIncluded: true,
      dnaScreeningPassed: true,
      lastVetCheckDate: '2026-08-01',
      nextVaccinationDue: '2026-08-28',
      healthGuaranteeDays: 90
    },
    personalityTraits: ['Playful', 'Affectionate', 'Apartment Friendly', 'Good with Children', 'Easy to Train'],
    breedDetails: {
      history: 'Famous for bat ears, compact sturdy body, and affectionate clownish behavior.',
      lifespan: '10 - 12 years',
      exerciseNeeds: 'Low',
      groomingRequirements: 'Low',
      climateSuitability: 'Indoor Air-Conditioned',
      temperament: ['Loving', 'Comical', 'Adaptable'],
      commonHealthConcerns: ['Airway Clearance Passed'],
      trainingDifficulty: 'Easy',
      recommendedHome: 'Apartments or cozy residences.'
    },
    images: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/French%20Bulldog%20puppy%20259A41731102.jpg?width=1200'
    ],
    purchaseIncludes: [
      'AKC Pedigree Papers',
      'Full Vet Exam Clearance',
      'Microchip & Starter Harness',
      '90-Day Guarantee'
    ]
  },
  // 3b. French Bulldog - Pierre (Second Frenchie Puppy)
  {
    id: 'pet-3b',
    name: 'Pierre',
    species: 'dog',
    breed: 'French Bulldog',
    breedType: 'rare',
    generation: 'Isabella Blue Lineage',
    badgeText: 'Rare Colorway',
    ageMonths: 2,
    gender: 'Male',
    color: 'Platinum Blue Brindle',
    weightKg: 1.3,
    heightCm: 13,
    birthDate: '2026-06-10',
    priceUSD: 290,
    status: 'available',
    rating: 5.0,
    reviewsCount: 22,
    isFeatured: true,
    locationCityState: 'Beverly Hills, CA',
    breeder: SAMPLE_BREEDERS[0],
    medicalInfo: {
      overallHealth: 'Excellent',
      vetExamPassed: true,
      vaccinated: true,
      vaccinatedDates: ['2026-07-10', '2026-07-28'],
      dewormed: true,
      microchipped: true,
      healthCertIncluded: true,
      pedigreeCertIncluded: true,
      dnaScreeningPassed: true,
      lastVetCheckDate: '2026-08-01',
      nextVaccinationDue: '2026-09-05',
      healthGuaranteeDays: 90
    },
    personalityTraits: ['Cuddly', 'Calm', 'Apartment Friendly', 'Gentle', 'Loyal'],
    breedDetails: {
      history: 'Ultra-chunky compact Frenchie with soft coat and quiet, loving indoor disposition.',
      lifespan: '10 - 12 years',
      exerciseNeeds: 'Low',
      groomingRequirements: 'Low',
      climateSuitability: 'Indoor',
      temperament: ['Comical', 'Sweet', 'Loving'],
      commonHealthConcerns: ['Nostril & Airway Verified Clear'],
      trainingDifficulty: 'Easy',
      recommendedHome: 'Apartment and city living.'
    },
    images: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/Merle%20French%20Bulldog%20puppy.jpg?width=1200'
    ],
    purchaseIncludes: [
      'AKC Platinum Pedigree Registration',
      'Vet Examination Passport',
      'Soft Memory Foam Bed',
      '90-Day Guarantee'
    ]
  },
  // 4. Persian Kitten - Snowball
  {
    id: 'pet-4',
    name: 'Snowball',
    species: 'cat',
    breed: 'Persian Kitten',
    breedType: 'standard',
    generation: 'Purebred TICA Baby',
    badgeText: 'New Arrival',
    ageMonths: 1,
    gender: 'Female',
    color: 'Snow White',
    weightKg: 0.6,
    heightCm: 11,
    birthDate: '2026-06-20',
    priceUSD: 180,
    status: 'available',
    rating: 4.8,
    reviewsCount: 19,
    isNewArrival: true,
    locationCityState: 'Beverly Hills, CA',
    breeder: SAMPLE_BREEDERS[0],
    medicalInfo: {
      overallHealth: 'Excellent',
      vetExamPassed: true,
      vaccinated: true,
      vaccinatedDates: ['2026-07-22'],
      dewormed: true,
      microchipped: true,
      healthCertIncluded: true,
      pedigreeCertIncluded: true,
      dnaScreeningPassed: true,
      lastVetCheckDate: '2026-07-29',
      nextVaccinationDue: '2026-09-01',
      healthGuaranteeDays: 60
    },
    personalityTraits: ['Calm', 'Gentle', 'Affectionate', 'Apartment Friendly', 'First-Time Owner Friendly'],
    breedDetails: {
      history: 'Celebrated as royal companions with lush coat, sweet face, and peaceful nature.',
      lifespan: '12 - 17 years',
      exerciseNeeds: 'Low',
      groomingRequirements: 'High',
      climateSuitability: 'Indoor',
      temperament: ['Quiet', 'Lap Cat', 'Affectionate'],
      commonHealthConcerns: ['PKD DNA Clear'],
      trainingDifficulty: 'Easy',
      recommendedHome: 'Apartments or quiet residences.'
    },
    images: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/Persian%20kitten%20%28closeup%20of%20face%29.jpg?width=1200'
    ],
    purchaseIncludes: [
      'TICA Registration Certificate',
      'Grooming Starter Kit & Silk Brush',
      'Kitten Formula & Velvet Bed',
      '60-Day Health Guarantee'
    ]
  },
  // 4b. Persian Kitten - Pearl (Second Persian Kitten)
  {
    id: 'pet-4b',
    name: 'Pearl',
    species: 'cat',
    breed: 'Persian Kitten',
    breedType: 'standard',
    generation: 'Doll Face Persian Baby',
    badgeText: 'Fluffy Angel',
    ageMonths: 1,
    gender: 'Female',
    color: 'Silver Tabby Silk',
    weightKg: 0.5,
    heightCm: 10,
    birthDate: '2026-06-25',
    priceUSD: 195,
    status: 'available',
    rating: 4.9,
    reviewsCount: 14,
    isNewArrival: true,
    locationCityState: 'Beverly Hills, CA',
    breeder: SAMPLE_BREEDERS[0],
    medicalInfo: {
      overallHealth: 'Excellent',
      vetExamPassed: true,
      vaccinated: true,
      vaccinatedDates: ['2026-07-25'],
      dewormed: true,
      microchipped: true,
      healthCertIncluded: true,
      pedigreeCertIncluded: true,
      dnaScreeningPassed: true,
      lastVetCheckDate: '2026-08-01',
      nextVaccinationDue: '2026-09-05',
      healthGuaranteeDays: 60
    },
    personalityTraits: ['Sweet', 'Quiet', 'Lap Cat', 'Cuddly', 'Gentle'],
    breedDetails: {
      history: 'Plush coat and affectionate lap-cat disposition for calm indoor relaxing.',
      lifespan: '12 - 17 years',
      exerciseNeeds: 'Low',
      groomingRequirements: 'High',
      climateSuitability: 'Indoor',
      temperament: ['Peaceful', 'Loving', 'Gentle'],
      commonHealthConcerns: ['PKD Clear'],
      trainingDifficulty: 'Easy',
      recommendedHome: 'Apartments and quiet homes.'
    },
    images: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/Persian%20kitten%20-%20blue.jpg?width=1200'
    ],
    purchaseIncludes: [
      'TICA Pedigree Papers',
      'Silk Coat Grooming Brush',
      'Kitten Starter Package',
      '60-Day Guarantee'
    ]
  },
  // 5. Samoyed - Yuki
  {
    id: 'pet-7',
    name: 'Yuki',
    species: 'dog',
    breed: 'Samoyed',
    breedType: 'standard',
    generation: 'Arctic White Baby',
    badgeText: 'Best Seller',
    ageMonths: 1,
    gender: 'Male',
    color: 'Pure Snow White',
    weightKg: 1.8,
    heightCm: 15,
    birthDate: '2026-06-22',
    priceUSD: 250,
    status: 'available',
    rating: 4.9,
    reviewsCount: 33,
    isBestSeller: true,
    locationCityState: 'Greenwich, CT',
    breeder: SAMPLE_BREEDERS[2],
    medicalInfo: {
      overallHealth: 'Excellent',
      vetExamPassed: true,
      vaccinated: true,
      vaccinatedDates: ['2026-07-20'],
      dewormed: true,
      microchipped: true,
      healthCertIncluded: true,
      pedigreeCertIncluded: true,
      dnaScreeningPassed: true,
      lastVetCheckDate: '2026-08-01',
      nextVaccinationDue: '2026-09-05',
      healthGuaranteeDays: 90
    },
    personalityTraits: ['Friendly', 'Gentle', 'Loyal', 'Good with Children', 'Affectionate', 'Playful'],
    breedDetails: {
      history: 'Famous for their fluffy cloud-like coat and perpetual Sammie smile.',
      lifespan: '12 - 14 years',
      exerciseNeeds: 'High',
      groomingRequirements: 'High',
      climateSuitability: 'Cool or Temperate',
      temperament: ['Gentle', 'Sociable', 'Happy'],
      commonHealthConcerns: ['OFA Clearances'],
      trainingDifficulty: 'Moderate',
      recommendedHome: 'Active family homes.'
    },
    images: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/Samoyed-dog.jpg?width=1200'
    ],
    purchaseIncludes: [
      'AKC Registration Papers',
      'De-shedding Comb & Fluff Brush',
      'Puppy Care Starter Kit',
      '90-Day Guarantee'
    ]
  },
  // 5b. Samoyed - Ghost (Second Samoyed Puppy)
  {
    id: 'pet-7b',
    name: 'Ghost',
    species: 'dog',
    breed: 'Samoyed',
    breedType: 'standard',
    generation: 'AKC Cloud Lineage',
    badgeText: 'Fluffy Cloud',
    ageMonths: 2,
    gender: 'Female',
    color: 'Icy White',
    weightKg: 2.0,
    heightCm: 16,
    birthDate: '2026-06-15',
    priceUSD: 270,
    status: 'available',
    rating: 4.95,
    reviewsCount: 18,
    isFeatured: true,
    locationCityState: 'Greenwich, CT',
    breeder: SAMPLE_BREEDERS[2],
    medicalInfo: {
      overallHealth: 'Excellent',
      vetExamPassed: true,
      vaccinated: true,
      vaccinatedDates: ['2026-07-15'],
      dewormed: true,
      microchipped: true,
      healthCertIncluded: true,
      pedigreeCertIncluded: true,
      dnaScreeningPassed: true,
      lastVetCheckDate: '2026-08-01',
      nextVaccinationDue: '2026-09-10',
      healthGuaranteeDays: 90
    },
    personalityTraits: ['Happy', 'Affectionate', 'Fluffy', 'Gentle', 'Good with Kids'],
    breedDetails: {
      history: 'Bred for arctic warmth and friendly smiling companion demeanor.',
      lifespan: '12 - 14 years',
      exerciseNeeds: 'High',
      groomingRequirements: 'High',
      climateSuitability: 'Cool or Temperate',
      temperament: ['Gentle', 'Outgoing', 'Loyal'],
      commonHealthConcerns: ['Hip & Eye Certified'],
      trainingDifficulty: 'Easy',
      recommendedHome: 'Family homes.'
    },
    images: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/Samoyed-and-teddy-bear.jpg?width=1200'
    ],
    purchaseIncludes: [
      'AKC Pedigree Registration',
      'Vet Health Passport',
      'Fluff Grooming Comb',
      '90-Day Guarantee'
    ]
  },
  // 6. Teacup Pomeranian - Teddy
  {
    id: 'pet-8',
    name: 'Teddy',
    species: 'dog',
    breed: 'Teacup Pomeranian',
    breedType: 'rare',
    generation: 'Micro Fluffy Baby',
    badgeText: 'Rare Teacup',
    ageMonths: 1,
    gender: 'Male',
    color: 'Teddy Bear Cinnamon',
    weightKg: 0.5,
    heightCm: 10,
    birthDate: '2026-06-28',
    priceUSD: 280,
    status: 'available',
    rating: 5.0,
    reviewsCount: 31,
    isFeatured: true,
    isNewArrival: true,
    locationCityState: 'Beverly Hills, CA',
    breeder: SAMPLE_BREEDERS[0],
    medicalInfo: {
      overallHealth: 'Excellent',
      vetExamPassed: true,
      vaccinated: true,
      vaccinatedDates: ['2026-07-25'],
      dewormed: true,
      microchipped: true,
      healthCertIncluded: true,
      pedigreeCertIncluded: true,
      dnaScreeningPassed: true,
      lastVetCheckDate: '2026-08-02',
      nextVaccinationDue: '2026-09-01',
      healthGuaranteeDays: 90
    },
    personalityTraits: ['Cuddly', 'Playful', 'Apartment Friendly', 'Affectionate', 'Loyal'],
    breedDetails: {
      history: 'Ultra-compact fluffy teddy bear face Pomeranian baby bred for companionship.',
      lifespan: '12 - 16 years',
      exerciseNeeds: 'Low',
      groomingRequirements: 'Moderate',
      climateSuitability: 'Indoor',
      temperament: ['Spirited', 'Loving', 'Cuddly'],
      commonHealthConcerns: ['Patella Clear'],
      trainingDifficulty: 'Easy',
      recommendedHome: 'Apartments or loving indoor homes.'
    },
    images: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/Pomeranian%20Pup.JPG?width=1200'
    ],
    purchaseIncludes: [
      'AKC Teacup Pedigree Papers',
      'Soft Fleece Bed & Teacup Carrier',
      'Vet Health Certificate',
      '90-Day Health Guarantee'
    ]
  },
  // 7. Pembroke Welsh Corgi - Oliver
  {
    id: 'pet-10',
    name: 'Oliver',
    species: 'dog',
    breed: 'Pembroke Welsh Corgi',
    breedType: 'standard',
    generation: 'AKC Baby Corgi',
    badgeText: 'Best Seller',
    ageMonths: 2,
    gender: 'Male',
    color: 'Red & White Sable',
    weightKg: 1.9,
    heightCm: 14,
    birthDate: '2026-06-08',
    priceUSD: 230,
    status: 'available',
    rating: 4.9,
    reviewsCount: 36,
    isBestSeller: true,
    locationCityState: 'Beverly Hills, CA',
    breeder: SAMPLE_BREEDERS[0],
    medicalInfo: {
      overallHealth: 'Excellent',
      vetExamPassed: true,
      vaccinated: true,
      vaccinatedDates: ['2026-07-10', '2026-07-28'],
      dewormed: true,
      microchipped: true,
      healthCertIncluded: true,
      pedigreeCertIncluded: true,
      dnaScreeningPassed: true,
      lastVetCheckDate: '2026-08-01',
      nextVaccinationDue: '2026-09-10',
      healthGuaranteeDays: 90
    },
    personalityTraits: ['Playful', 'Intelligent', 'Loyal', 'Affectionate', 'Energetic'],
    breedDetails: {
      history: 'Beloved royal Welsh herding dogs with short legs, big ears, and cheerful personalities.',
      lifespan: '12 - 15 years',
      exerciseNeeds: 'Moderate',
      groomingRequirements: 'Moderate',
      climateSuitability: 'Adaptable',
      temperament: ['Bold', 'Loving', 'Fun-loving'],
      commonHealthConcerns: ['DM Clear', 'vWD1 Clear'],
      trainingDifficulty: 'Easy',
      recommendedHome: 'Family homes.'
    },
    images: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/Archie%20the%20Pembroke%20Welsh%20Corgi.jpg?width=1200'
    ],
    purchaseIncludes: [
      'AKC Pedigree Registration',
      'Vet Health Certificate',
      'Chew Toy & Puppy Collar',
      '90-Day Guarantee'
    ]
  },
  // 8. Miniature Dachshund - Buster
  {
    id: 'pet-18',
    name: 'Buster',
    species: 'dog',
    breed: 'Miniature Dachshund',
    breedType: 'standard',
    generation: 'Wiener Puppy Baby',
    badgeText: 'New Arrival',
    ageMonths: 1,
    gender: 'Male',
    color: 'Chocolate & Tan',
    weightKg: 0.8,
    heightCm: 10,
    birthDate: '2026-06-27',
    priceUSD: 160,
    status: 'available',
    rating: 4.85,
    reviewsCount: 24,
    isNewArrival: true,
    locationCityState: 'Beverly Hills, CA',
    breeder: SAMPLE_BREEDERS[0],
    medicalInfo: {
      overallHealth: 'Excellent',
      vetExamPassed: true,
      vaccinated: true,
      vaccinatedDates: ['2026-07-24'],
      dewormed: true,
      microchipped: true,
      healthCertIncluded: true,
      pedigreeCertIncluded: true,
      dnaScreeningPassed: true,
      lastVetCheckDate: '2026-08-01',
      nextVaccinationDue: '2026-09-01',
      healthGuaranteeDays: 60
    },
    personalityTraits: ['Playful', 'Spirited', 'Loyal', 'Apartment Friendly', 'Affectionate'],
    breedDetails: {
      history: 'Charming sausage puppy known for big personality, long back, and loyal heart.',
      lifespan: '12 - 16 years',
      exerciseNeeds: 'Low',
      groomingRequirements: 'Low',
      climateSuitability: 'Adaptable',
      temperament: ['Curious', 'Bold', 'Loving'],
      commonHealthConcerns: ['Back Evaluation Clear'],
      trainingDifficulty: 'Easy',
      recommendedHome: 'Apartments or cozy homes.'
    },
    images: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/Smooth%20Miniature%20Dachshund%20puppy.jpg?width=1200'
    ],
    purchaseIncludes: [
      'AKC Registration Papers',
      'Puppy Ramp & Soft Harness',
      'Vet Examination Record',
      '60-Day Guarantee'
    ]
  },
  // 9. Bengal Kitten - Suki
  {
    id: 'pet-6',
    name: 'Suki',
    species: 'cat',
    breed: 'Bengal Kitten',
    breedType: 'rare',
    generation: 'Rosetted Wild Gold Baby',
    badgeText: 'Rare Breed',
    ageMonths: 2,
    gender: 'Female',
    color: 'Rosetted Leopard',
    weightKg: 0.9,
    heightCm: 14,
    birthDate: '2026-06-10',
    priceUSD: 290,
    status: 'available',
    rating: 5.0,
    reviewsCount: 29,
    isFeatured: true,
    locationCityState: 'Aspen, CO',
    breeder: SAMPLE_BREEDERS[1],
    medicalInfo: {
      overallHealth: 'Excellent',
      vetExamPassed: true,
      vaccinated: true,
      vaccinatedDates: ['2026-07-12'],
      dewormed: true,
      microchipped: true,
      healthCertIncluded: true,
      pedigreeCertIncluded: true,
      dnaScreeningPassed: true,
      lastVetCheckDate: '2026-07-25',
      nextVaccinationDue: '2026-09-01',
      healthGuaranteeDays: 90
    },
    personalityTraits: ['Energetic', 'Playful', 'Curious', 'Intelligent', 'Good with Other Pets'],
    breedDetails: {
      history: 'Wild leopard coat pattern with affectionate household cat personality.',
      lifespan: '12 - 16 years',
      exerciseNeeds: 'High',
      groomingRequirements: 'Low',
      climateSuitability: 'Temperate',
      temperament: ['Active', 'High-IQ', 'Playful'],
      commonHealthConcerns: ['PRA-b & PK-Def Clear'],
      trainingDifficulty: 'Easy',
      recommendedHome: 'Interactive and playful owners.'
    },
    images: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/Bengal%20cat%2C%2012%20weeks%20old%20%282308642374%29.jpg?width=1200'
    ],
    purchaseIncludes: [
      'TICA Pedigree Certificate',
      'DNA Genetic Clearances',
      'Kitten Starter Toys & Food',
      '90-Day Health Guarantee'
    ]
  },
  // 10. Scottish Fold Kitten - Luna
  {
    id: 'pet-9',
    name: 'Luna',
    species: 'cat',
    breed: 'Scottish Fold Kitten',
    breedType: 'rare',
    generation: 'Folded Ear Baby',
    badgeText: 'Rare Breed',
    ageMonths: 1,
    gender: 'Female',
    color: 'Silver Chinchilla',
    weightKg: 0.5,
    heightCm: 10,
    birthDate: '2026-06-21',
    priceUSD: 270,
    status: 'available',
    rating: 4.95,
    reviewsCount: 25,
    isFeatured: true,
    locationCityState: 'Aspen, CO',
    breeder: SAMPLE_BREEDERS[1],
    medicalInfo: {
      overallHealth: 'Excellent',
      vetExamPassed: true,
      vaccinated: true,
      vaccinatedDates: ['2026-07-20'],
      dewormed: true,
      microchipped: true,
      healthCertIncluded: true,
      pedigreeCertIncluded: true,
      dnaScreeningPassed: true,
      lastVetCheckDate: '2026-07-31',
      nextVaccinationDue: '2026-09-01',
      healthGuaranteeDays: 90
    },
    personalityTraits: ['Sweet', 'Quiet', 'Lap Cat', 'Affectionate', 'Gentle'],
    breedDetails: {
      history: 'Famous owl-like round face and folded ears, known for sitting like a human (Buddha stance).',
      lifespan: '12 - 15 years',
      exerciseNeeds: 'Low',
      groomingRequirements: 'Low',
      climateSuitability: 'Indoor',
      temperament: ['Gentle', 'Placid', 'Sweet'],
      commonHealthConcerns: ['Osteochondrodysplasia DNA Tested Clear'],
      trainingDifficulty: 'Easy',
      recommendedHome: 'Apartments and quiet homes.'
    },
    images: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/Silver%20tabby%20Scottish%20Fold%20Kitten.jpg?width=1200'
    ],
    purchaseIncludes: [
      'TICA Scottish Fold Pedigree',
      'DNA Screening Certificate',
      'Specialty Kitten Milk Formula',
      '90-Day Health Guarantee'
    ]
  },
  // 11. Munchkin Kitten - Mochi
  {
    id: 'pet-13',
    name: 'Mochi',
    species: 'cat',
    breed: 'Munchkin Short-Leg Kitten',
    breedType: 'rare',
    generation: 'Standard Shorty Baby',
    badgeText: 'Rare Munchkin',
    ageMonths: 1,
    gender: 'Male',
    color: 'Cream & Peach',
    weightKg: 0.5,
    heightCm: 8,
    birthDate: '2026-06-24',
    priceUSD: 285,
    status: 'available',
    rating: 5.0,
    reviewsCount: 22,
    isFeatured: true,
    locationCityState: 'Aspen, CO',
    breeder: SAMPLE_BREEDERS[1],
    medicalInfo: {
      overallHealth: 'Excellent',
      vetExamPassed: true,
      vaccinated: true,
      vaccinatedDates: ['2026-07-22'],
      dewormed: true,
      microchipped: true,
      healthCertIncluded: true,
      pedigreeCertIncluded: true,
      dnaScreeningPassed: true,
      lastVetCheckDate: '2026-08-02',
      nextVaccinationDue: '2026-09-01',
      healthGuaranteeDays: 90
    },
    personalityTraits: ['Playful', 'Adorable', 'Affectionate', 'Good with Other Pets', 'Energetic'],
    breedDetails: {
      history: 'Short-legged adorable kitten breed known for running like a sports car and sitting on hind legs like a meerkat.',
      lifespan: '12 - 15 years',
      exerciseNeeds: 'Moderate',
      groomingRequirements: 'Low',
      climateSuitability: 'Indoor',
      temperament: ['Comical', 'Sweet', 'Playful'],
      commonHealthConcerns: ['Spine & Joint Clear'],
      trainingDifficulty: 'Easy',
      recommendedHome: 'Indoor cozy residences.'
    },
    images: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/Munchkin%20Kitten.jpg?width=1200'
    ],
    purchaseIncludes: [
      'TICA Pedigree Papers',
      'Low-Rider Play Ramp & Ball Toys',
      'Vet Examination Passport',
      '90-Day Guarantee'
    ]
  },
  // 12. Ragdoll Kitten - Nala
  {
    id: 'pet-15',
    name: 'Nala',
    species: 'cat',
    breed: 'Ragdoll Kitten',
    breedType: 'standard',
    generation: 'Purebred Blue Point Baby',
    badgeText: 'New Arrival',
    ageMonths: 1,
    gender: 'Female',
    color: 'Blue Point Silk',
    weightKg: 0.7,
    heightCm: 12,
    birthDate: '2026-06-18',
    priceUSD: 195,
    status: 'available',
    rating: 4.95,
    reviewsCount: 27,
    isNewArrival: true,
    locationCityState: 'Aspen, CO',
    breeder: SAMPLE_BREEDERS[1],
    medicalInfo: {
      overallHealth: 'Excellent',
      vetExamPassed: true,
      vaccinated: true,
      vaccinatedDates: ['2026-07-18'],
      dewormed: true,
      microchipped: true,
      healthCertIncluded: true,
      pedigreeCertIncluded: true,
      dnaScreeningPassed: true,
      lastVetCheckDate: '2026-07-28',
      nextVaccinationDue: '2026-09-01',
      healthGuaranteeDays: 90
    },
    personalityTraits: ['Flop Cuddler', 'Sweet', 'Gentle', 'Good with Children', 'Affectionate'],
    breedDetails: {
      history: 'Named for going limp like a ragdoll when held. Deep blue eyes and ultra-soft silky coat.',
      lifespan: '12 - 17 years',
      exerciseNeeds: 'Low',
      groomingRequirements: 'Moderate',
      climateSuitability: 'Indoor',
      temperament: ['Placid', 'Affectionate', 'Gentle'],
      commonHealthConcerns: ['HCM DNA Clear'],
      trainingDifficulty: 'Easy',
      recommendedHome: 'Loving family indoor homes.'
    },
    images: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/Ragdoll%20Kitten%20%2837508871054%29.jpg?width=1200'
    ],
    purchaseIncludes: [
      'TICA Ragdoll Pedigree',
      'Grooming Silk Comb',
      'Kitten Starter Package',
      '90-Day Health Guarantee'
    ]
  },
  // 13. British Shorthair - Simba
  {
    id: 'pet-17',
    name: 'Simba',
    species: 'cat',
    breed: 'British Shorthair',
    breedType: 'standard',
    generation: 'Chubby Cheeks Baby',
    badgeText: 'Best Seller',
    ageMonths: 1,
    gender: 'Male',
    color: 'British Blue',
    weightKg: 0.6,
    heightCm: 11,
    birthDate: '2026-06-23',
    priceUSD: 175,
    status: 'available',
    rating: 4.8,
    reviewsCount: 31,
    isBestSeller: true,
    locationCityState: 'Aspen, CO',
    breeder: SAMPLE_BREEDERS[1],
    medicalInfo: {
      overallHealth: 'Excellent',
      vetExamPassed: true,
      vaccinated: true,
      vaccinatedDates: ['2026-07-20'],
      dewormed: true,
      microchipped: true,
      healthCertIncluded: true,
      pedigreeCertIncluded: true,
      dnaScreeningPassed: true,
      lastVetCheckDate: '2026-07-30',
      nextVaccinationDue: '2026-09-01',
      healthGuaranteeDays: 60
    },
    personalityTraits: ['Calm', 'Teddy Bear Face', 'Apartment Friendly', 'Gentle', 'Easygoing'],
    breedDetails: {
      history: 'Famous for round cheeks, copper eyes, plush coat, and calm teddy-bear temperament.',
      lifespan: '12 - 17 years',
      exerciseNeeds: 'Low',
      groomingRequirements: 'Low',
      climateSuitability: 'Indoor',
      temperament: ['Placid', 'Independent', 'Loving'],
      commonHealthConcerns: ['HCM Clear'],
      trainingDifficulty: 'Easy',
      recommendedHome: 'Apartments or quiet residences.'
    },
    images: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/British%20shorthair%20kitten%20Erray%20Starfall%20LT.jpg?width=1200'
    ],
    purchaseIncludes: [
      'GCCF/TICA Pedigree',
      'Vet Health Certificate',
      'Kitten Food Starter Bag',
      '60-Day Guarantee'
    ]
  },
  // 14. Maine Coon Kitten - Leo
  {
    id: 'pet-21',
    name: 'Leo',
    species: 'cat',
    breed: 'Maine Coon',
    breedType: 'standard',
    generation: 'Gentle Giant Lineage',
    badgeText: 'New Arrival',
    ageMonths: 2,
    gender: 'Male',
    color: 'Silver Tabby Fluff',
    weightKg: 1.4,
    heightCm: 16,
    birthDate: '2026-06-02',
    priceUSD: 235,
    status: 'available',
    rating: 4.95,
    reviewsCount: 17,
    isNewArrival: true,
    locationCityState: 'Aspen, CO',
    breeder: SAMPLE_BREEDERS[1],
    medicalInfo: {
      overallHealth: 'Excellent',
      vetExamPassed: true,
      vaccinated: true,
      vaccinatedDates: ['2026-07-05'],
      dewormed: true,
      microchipped: true,
      healthCertIncluded: true,
      pedigreeCertIncluded: true,
      dnaScreeningPassed: true,
      lastVetCheckDate: '2026-08-01',
      nextVaccinationDue: '2026-09-10',
      healthGuaranteeDays: 90
    },
    personalityTraits: ['Friendly', 'Dog-like', 'Majestic', 'Affectionate', 'Playful'],
    breedDetails: {
      history: 'Largest domesticated cat breed with lynx-like ear tufts and intelligent, loving disposition.',
      lifespan: '12 - 15 years',
      exerciseNeeds: 'Moderate',
      groomingRequirements: 'Moderate',
      climateSuitability: 'Adaptable',
      temperament: ['Gentle', 'Friendly', 'Smart'],
      commonHealthConcerns: ['HCM & SMA Clear'],
      trainingDifficulty: 'Easy',
      recommendedHome: 'Family homes.'
    },
    images: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/Maine%20Coon%20male%20kitten%20portrait.jpg?width=1200'
    ],
    purchaseIncludes: [
      'TICA Pedigree Registration',
      'Vet Health Certificate',
      'Grooming Brush',
      '90-Day Guarantee'
    ]
  },
  // 15. German Shepherd Puppy - Rex
  {
    id: 'pet-22',
    name: 'Rex',
    species: 'dog',
    breed: 'German Shepherd',
    breedType: 'standard',
    generation: 'Purebred AKC Working Lineage',
    badgeText: 'Noble Guardian',
    ageMonths: 2,
    gender: 'Male',
    color: 'Black & Tan Saddle',
    weightKg: 3.1,
    heightCm: 20,
    birthDate: '2026-06-01',
    priceUSD: 250,
    status: 'available',
    rating: 4.9,
    reviewsCount: 28,
    isFeatured: true,
    locationCityState: 'Greenwich, CT',
    breeder: SAMPLE_BREEDERS[2],
    medicalInfo: {
      overallHealth: 'Excellent',
      vetExamPassed: true,
      vaccinated: true,
      vaccinatedDates: ['2026-07-02', '2026-07-22'],
      dewormed: true,
      microchipped: true,
      healthCertIncluded: true,
      pedigreeCertIncluded: true,
      dnaScreeningPassed: true,
      lastVetCheckDate: '2026-08-01',
      nextVaccinationDue: '2026-09-01',
      healthGuaranteeDays: 90
    },
    personalityTraits: ['Loyal', 'Intelligent', 'Protective', 'Eager to Train', 'Courageous'],
    breedDetails: {
      history: 'World-famous working breed known for supreme intelligence, loyalty, and noble character.',
      lifespan: '10 - 13 years',
      exerciseNeeds: 'High',
      groomingRequirements: 'Moderate',
      climateSuitability: 'Adaptable',
      temperament: ['Confident', 'Smart', 'Loyal'],
      commonHealthConcerns: ['OFA Hips Certified'],
      trainingDifficulty: 'Easy',
      recommendedHome: 'Active owners or families with yard.'
    },
    images: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/8-Week%20Old%20German%20Shepherd%20Puppy.jpg?width=1200'
    ],
    purchaseIncludes: [
      'AKC Registration Papers',
      'OFA DNA Health Clearances',
      'Training Leash & Collar',
      '90-Day Guarantee'
    ]
  },
  // 16. Australian Shepherd Puppy - Blue
  {
    id: 'pet-23',
    name: 'Blue',
    species: 'dog',
    breed: 'Australian Shepherd',
    breedType: 'standard',
    generation: 'Blue Merle Lineage',
    badgeText: 'Stunning Eyes',
    ageMonths: 2,
    gender: 'Male',
    color: 'Blue Merle Multi',
    weightKg: 2.2,
    heightCm: 18,
    birthDate: '2026-06-03',
    priceUSD: 265,
    status: 'available',
    rating: 5.0,
    reviewsCount: 19,
    isFeatured: true,
    locationCityState: 'Greenwich, CT',
    breeder: SAMPLE_BREEDERS[2],
    medicalInfo: {
      overallHealth: 'Excellent',
      vetExamPassed: true,
      vaccinated: true,
      vaccinatedDates: ['2026-07-03', '2026-07-24'],
      dewormed: true,
      microchipped: true,
      healthCertIncluded: true,
      pedigreeCertIncluded: true,
      dnaScreeningPassed: true,
      lastVetCheckDate: '2026-08-01',
      nextVaccinationDue: '2026-09-05',
      healthGuaranteeDays: 90
    },
    personalityTraits: ['Energetic', 'Super Smart', 'Loyal', 'Playful', 'Affectionate'],
    breedDetails: {
      history: 'Known for eye-catching merle coats, high IQ, and agile athletic companion instincts.',
      lifespan: '12 - 15 years',
      exerciseNeeds: 'High',
      groomingRequirements: 'Moderate',
      climateSuitability: 'Adaptable',
      temperament: ['Smart', 'Work-oriented', 'Affectionate'],
      commonHealthConcerns: ['MDR1 Clear'],
      trainingDifficulty: 'Easy',
      recommendedHome: 'Active households.'
    },
    images: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/Australian%20Shepherd%20puppy%20red-merle.jpg?width=1200'
    ],
    purchaseIncludes: [
      'AKC Pedigree Papers',
      'MDR1 DNA Certificate',
      'Agility Starter Toy Set',
      '90-Day Guarantee'
    ]
  },
  // 17. Sphynx Kitten - Cleo
  {
    id: 'pet-11',
    name: 'Cleo',
    species: 'cat',
    breed: 'Sphynx Hairless Kitten',
    breedType: 'rare',
    generation: 'Peach-fuzz Velvet Baby',
    badgeText: 'Hypoallergenic Rare',
    ageMonths: 2,
    gender: 'Female',
    color: 'Warm Nude Velvet',
    weightKg: 0.8,
    heightCm: 13,
    birthDate: '2026-06-03',
    priceUSD: 295,
    status: 'available',
    rating: 5.0,
    reviewsCount: 18,
    isFeatured: true,
    locationCityState: 'Aspen, CO',
    breeder: SAMPLE_BREEDERS[1],
    medicalInfo: {
      overallHealth: 'Excellent',
      vetExamPassed: true,
      vaccinated: true,
      vaccinatedDates: ['2026-07-08', '2026-07-26'],
      dewormed: true,
      microchipped: true,
      healthCertIncluded: true,
      pedigreeCertIncluded: true,
      dnaScreeningPassed: true,
      lastVetCheckDate: '2026-08-01',
      nextVaccinationDue: '2026-09-12',
      healthGuaranteeDays: 90
    },
    personalityTraits: ['Warm Cuddler', 'Human-focused', 'Affectionate', 'Playful', 'Hypoallergenic'],
    breedDetails: {
      history: 'Renowned hairless companion cat with warm suede-like skin and intensely loving nature.',
      lifespan: '12 - 15 years',
      exerciseNeeds: 'Moderate',
      groomingRequirements: 'Low',
      climateSuitability: 'Indoor Warm',
      temperament: ['Velcro cat', 'Affectionate', 'Comical'],
      commonHealthConcerns: ['HCM Scan Clear'],
      trainingDifficulty: 'Easy',
      recommendedHome: 'Indoor climate controlled homes.'
    },
    images: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/Sphynx%20kitten.JPG?width=1200'
    ],
    purchaseIncludes: [
      'TICA Pedigree Papers',
      'Custom Cashmere Sweater & Heated Mat',
      'Vet Health Certificate',
      '90-Day Health Guarantee'
    ]
  }
];

export const SAMPLE_REVIEWS: CustomerReview[] = [
  {
    id: 'r1',
    authorName: 'Eleanor Vance',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    rating: 5,
    date: 'July 28, 2026',
    petName: 'Bella',
    petBreed: 'Golden Retriever',
    comment: 'YourPets provided white-glove service from start to finish! Bella arrived in flawless health at 2 months old with her complete medical passport and custom starter kit. WhatsApp updates and email order tracking were fantastic.',
    verifiedBuyer: true,
    location: 'Beverly Hills, CA',
    petPhotoUrl: 'https://images.unsplash.com/photo-1591160690555-5debfba289f0?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'r2',
    authorName: 'Marcus Sterling',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    rating: 5,
    date: 'June 14, 2026',
    petName: 'Aura',
    petBreed: 'F1 Savannah Cat',
    comment: 'Finding a legitimate, ethically raised F1 Savannah kitten with verified genetic screening for $300 is an incredible milestone. Highland Exotics and YourPets exceeded all expectations!',
    verifiedBuyer: true,
    location: 'Miami, FL',
    petPhotoUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'r3',
    authorName: 'Sophia Lin',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    rating: 5,
    date: 'May 02, 2026',
    petName: 'Milo',
    petBreed: 'French Bulldog',
    comment: 'The 360° view and full vet records allowed us to reserve Milo with total peace of mind. He has brought so much joy into our apartment. Truly world-class transparency!',
    verifiedBuyer: true,
    location: 'New York, NY',
    petPhotoUrl: 'https://images.unsplash.com/photo-1508948956644-0017e845d797?auto=format&fit=crop&q=80&w=400'
  }
];

export const SAMPLE_ARTICLES: CareArticle[] = [
  {
    id: 'a1',
    title: 'Preparing Your Home for a New Baby Puppy or Kitten',
    category: 'Preparation',
    summary: 'Essential checklist for home safety, climate control, nursery setups, and stress-free arrival protocols for 1-2 month old pets.',
    content: 'Bringing a young baby companion into your home requires strategic preparation. Secure low-hanging wires, establish a quiet sanctuary space, and set up air purification filters to ensure seamless acclimatization...',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800',
    author: 'Dr. Evelyn Hayes, DVM',
    publishDate: 'August 1, 2026'
  },
  {
    id: 'a2',
    title: 'The Science of Feline & Canine Genetic Clearances',
    category: 'Healthcare',
    summary: 'How DNA screening and orthopedic checks guarantee lifelong vitality for rare and standard baby breeds.',
    content: 'Genetic screening screens against hereditary conditions such as HCM in felines and Hip Dysplasia in canines. By demanding full transparency from verified master breeders...',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=800',
    author: 'Dr. Robert Vance, Chief Geneticist',
    publishDate: 'July 20, 2026'
  },
  {
    id: 'a3',
    title: 'Optimal Feeding Schedules & Nutrition for 1-2 Month Old Baby Pets',
    category: 'Nutrition',
    summary: 'Tailoring milk formulas, freeze-dried kibble, and hydration routines for growing baby puppies and kittens.',
    content: 'Nutrition in early development stages lays the foundation for coat luster and immune strength. High-protein freeze-dried diets matched with omega-3 fatty acids foster optimal cognitive growth...',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&q=80&w=800',
    author: 'Claire Beaumont, Certified Pet Nutritionist',
    publishDate: 'June 18, 2026'
  }
];

export const SAMPLE_FAQS = [
  {
    q: 'Are all baby pets on YourPets fully vaccinated and vet certified?',
    a: 'Yes, 100%. Every puppy and kitten listed on YourPets undergoes a comprehensive 40-point health check by a licensed veterinarian. All pets are up-to-date on age-appropriate core vaccinations, dewormed, and microchipped prior to delivery.'
  },
  {
    q: 'Why are prices between $150 and $300?',
    a: 'We work directly with certified master breeders and ethical reserves to offer complete transparency and accessible prices for all standard and rare baby pets ($150 to $300 max).'
  },
  {
    q: 'How does the dynamic delivery pricing ($100 vs $200) work?',
    a: 'Domestic delivery (within USA) is $100 for Express Climate Flight Nanny. International overseas delivery (to another country) is $200 due to customs flight nanny protocols.'
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept Credit/Debit Cards, Chime ($ChimeSign / Chime Pay), Apple Pay / Apple Gift Cards, and Bank Wire Transfer.'
  },
  {
    q: 'How can I contact the concierge directly on WhatsApp?',
    a: 'You can chat directly with our 24/7 Veterinary Concierge on WhatsApp at +1 (330) 516-1283 for instant photos, flight tracking, and reservation assistance.'
  }
];
