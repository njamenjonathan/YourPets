import React, { createContext, useContext, useState, useEffect } from 'react';
import { Pet, CartItem, FilterState, Order, Currency, Language, Breeder, UserAccount } from '../types';
import { SAMPLE_PETS, SAMPLE_BREEDERS } from '../data/pets';
import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  onSnapshot
} from '../lib/firebase';

const CURRENCY_RATES: Record<Currency, { symbol: string; rate: number }> = {
  USD: { symbol: '$', rate: 1.0 },
  EUR: { symbol: '€', rate: 0.92 },
  GBP: { symbol: '£', rate: 0.78 },
  CAD: { symbol: 'CA$', rate: 1.36 },
  AUD: { symbol: 'AU$', rate: 1.52 }
};

interface PetStoreContextType {
  pets: Pet[];
  breeders: Breeder[];
  currency: Currency;
  language: Language;
  darkMode: boolean;
  wishlist: string[];
  cart: CartItem[];
  recentlyViewed: Pet[];
  compareList: Pet[];
  orders: Order[];
  activeTab: string;
  selectedPetId: string | null;
  selectedOrder: Order | null;
  selectedBreeder: Breeder | null;
  searchQuery: string;
  filterState: FilterState;
  isQuizOpen: boolean;
  isBreedIdentifierOpen: boolean;
  isCompareOpen: boolean;
  isQuickViewOpen: boolean;
  quickViewPet: Pet | null;
  isChatOpen: boolean;
  isReserveModalOpen: boolean;
  reservePetTarget: Pet | null;
  notification: string | null;

  // Authentication State & Actions
  currentUser: UserAccount | null;
  rememberedEmail: string;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  loginUser: (email: string, password: string) => { success: boolean; message: string };
  loginWithGoogle: () => Promise<{ success: boolean; message: string }>;
  registerUser: (name: string, email: string, password: string) => { success: boolean; message: string };
  logoutUser: () => void;
  setRememberedEmail: (email: string) => void;

  // Actions
  setCurrency: (c: Currency) => void;
  setLanguage: (l: Language) => void;
  setDarkMode: (d: boolean | ((prev: boolean) => boolean)) => void;
  setActiveTab: (tab: string) => void;
  setSelectedPetId: (id: string | null) => void;
  setSelectedOrder: (order: Order | null) => void;
  setSelectedBreeder: (breeder: Breeder | null) => void;
  setSearchQuery: (query: string) => void;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  setIsQuizOpen: (open: boolean) => void;
  setIsBreedIdentifierOpen: (open: boolean) => void;
  setIsCompareOpen: (open: boolean) => void;
  setIsChatOpen: (open: boolean) => void;
  setQuickViewPet: (pet: Pet | null) => void;
  openReserveModal: (pet: Pet) => void;
  closeReserveModal: () => void;
  
  toggleWishlist: (petId: string) => void;
  addToCart: (pet: Pet, addOns?: { insurance: boolean; starterKit: boolean; vipTransport: boolean }) => void;
  removeFromCart: (petId: string) => void;
  updateCartAddons: (petId: string, addOns: { insurance: boolean; starterKit: boolean; vipTransport: boolean }) => void;
  clearCart: () => void;
  toggleCompare: (pet: Pet) => void;
  recordPetView: (pet: Pet) => void;
  placeOrder: (orderDetails: Partial<Order>) => Order;
  showNotification: (msg: string) => void;
  
  formatPrice: (priceUSD: number) => string;
  formatAge: (months: number) => string;

  // Admin Actions
  addPet: (newPet: Pet) => void;
  updatePet: (petId: string, updated: Partial<Pet>) => void;
  deletePet: (petId: string) => void;
}

const initialFilterState: FilterState = {
  species: [],
  breedTypes: [],
  selectedBreeds: [],
  genders: [],
  minPriceUSD: 150,
  maxPriceUSD: 300,
  minAgeMonths: 1,
  maxAgeMonths: 6,
  traits: [],
  vaccinatedOnly: false,
  microchippedOnly: false,
  searchQuery: '',
  sortBy: 'recommended'
};

const PetStoreContext = createContext<PetStoreContextType | undefined>(undefined);

export const PetStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pets, setPets] = useState<Pet[]>(SAMPLE_PETS);
  const [breeders] = useState<Breeder[]>(SAMPLE_BREEDERS);
  const [currency, setCurrency] = useState<Currency>('USD');
  const [language, setLanguage] = useState<Language>('en');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Pet[]>([]);
  const [compareList, setCompareList] = useState<Pet[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedBreeder, setSelectedBreeder] = useState<Breeder | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterState, setFilterState] = useState<FilterState>(initialFilterState);
  
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isBreedIdentifierOpen, setIsBreedIdentifierOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [quickViewPet, setQuickViewPetState] = useState<Pet | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [reservePetTarget, setReservePetTarget] = useState<Pet | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // User Authentication State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [rememberedEmail, setRememberedEmailState] = useState<string>(() => {
    return localStorage.getItem('yourpets_remembered_email') || 'eleanor.vance@beverlyhills.org';
  });

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('yourpets_current_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
      name: 'Lady Eleanor Vance',
      email: 'eleanor.vance@beverlyhills.org',
      isLoggedIn: true,
      memberSince: '2026'
    };
  });

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const userEmail = fbUser.email || '';
        const userDisplayName = fbUser.displayName || userEmail.split('@')[0] || 'VIP Member';
        
        const userObj: UserAccount = {
          name: userDisplayName,
          email: userEmail,
          isLoggedIn: true,
          memberSince: '2026'
        };

        setCurrentUser(userObj);
        setRememberedEmail(userEmail);
        localStorage.setItem('yourpets_current_user', JSON.stringify(userObj));

        // Save/Sync user profile to Firestore
        try {
          await setDoc(doc(db, 'users', fbUser.uid), {
            uid: fbUser.uid,
            displayName: userDisplayName,
            email: userEmail,
            photoURL: fbUser.photoURL || '',
            createdAt: new Date().toISOString()
          }, { merge: true });
        } catch (e) {
          console.warn('Firestore user sync warning:', e);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const setRememberedEmail = (email: string) => {
    const clean = email.trim().toLowerCase();
    setRememberedEmailState(clean);
    localStorage.setItem('yourpets_remembered_email', clean);
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const userEmail = fbUser.email || '';
      const userDisplayName = fbUser.displayName || userEmail.split('@')[0] || 'VIP Member';

      const userObj: UserAccount = {
        name: userDisplayName,
        email: userEmail,
        isLoggedIn: true,
        memberSince: '2026'
      };

      setCurrentUser(userObj);
      setRememberedEmail(userEmail);
      localStorage.setItem('yourpets_current_user', JSON.stringify(userObj));

      // Save/Sync to Firestore
      await setDoc(doc(db, 'users', fbUser.uid), {
        uid: fbUser.uid,
        displayName: userDisplayName,
        email: userEmail,
        photoURL: fbUser.photoURL || '',
        createdAt: new Date().toISOString()
      }, { merge: true });

      setIsAuthModalOpen(false);
      showNotification(`Welcome, ${userDisplayName}! Signed in with Google.`);
      return { success: true, message: 'Signed in with Google successfully' };
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      return { success: false, message: err?.message || 'Google Sign-In failed. Please try again.' };
    }
  };

  const loginUser = (email: string, password?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    setRememberedEmail(cleanEmail);

    const storedUsersJson = localStorage.getItem('yourpets_registered_users');
    const registeredUsers: Record<string, { name: string; email: string; password?: string }> = storedUsersJson ? JSON.parse(storedUsersJson) : {};

    let userObj: UserAccount;
    if (registeredUsers[cleanEmail]) {
      const reg = registeredUsers[cleanEmail];
      if (reg.password && password && reg.password !== password) {
        return { success: false, message: 'Incorrect password. Please try again.' };
      }
      userObj = { name: reg.name, email: reg.email, isLoggedIn: true, memberSince: '2026' };
    } else {
      const defaultName = cleanEmail === 'eleanor.vance@beverlyhills.org' ? 'Lady Eleanor Vance' : cleanEmail.split('@')[0];
      userObj = { name: defaultName, email: cleanEmail, isLoggedIn: true, memberSince: '2026' };
    }

    setCurrentUser(userObj);
    localStorage.setItem('yourpets_current_user', JSON.stringify(userObj));
    setIsAuthModalOpen(false);
    showNotification(`Welcome back, ${userObj.name}!`);
    return { success: true, message: 'Logged in successfully' };
  };

  const registerUser = (name: string, email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    setRememberedEmail(cleanEmail);

    const storedUsersJson = localStorage.getItem('yourpets_registered_users');
    const registeredUsers: Record<string, { name: string; email: string; password?: string }> = storedUsersJson ? JSON.parse(storedUsersJson) : {};

    registeredUsers[cleanEmail] = { name: name.trim(), email: cleanEmail, password };
    localStorage.setItem('yourpets_registered_users', JSON.stringify(registeredUsers));

    const newUser: UserAccount = {
      name: name.trim(),
      email: cleanEmail,
      isLoggedIn: true,
      memberSince: new Date().getFullYear().toString()
    };

    setCurrentUser(newUser);
    localStorage.setItem('yourpets_current_user', JSON.stringify(newUser));
    setIsAuthModalOpen(false);
    showNotification(`Account created! Welcome, ${newUser.name}!`);
    return { success: true, message: 'Account registered' };
  };

  const logoutUser = () => {
    signOut(auth).catch(() => {});
    if (currentUser) {
      setCurrentUser({ ...currentUser, isLoggedIn: false });
      localStorage.setItem('yourpets_current_user', JSON.stringify({ ...currentUser, isLoggedIn: false }));
      showNotification('Logged out successfully');
    }
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const toggleWishlist = (petId: string) => {
    if (!currentUser?.isLoggedIn) {
      setIsAuthModalOpen(true);
      showNotification('Please sign in to save pets to your wishlist.');
      return;
    }
    setWishlist(prev => {
      const exists = prev.includes(petId);
      const updated = exists ? prev.filter(id => id !== petId) : [...prev, petId];
      
      showNotification(exists ? 'Removed from Wishlist' : 'Saved to Wishlist!');

      // Sync to Firestore if authenticated
      if (auth.currentUser) {
        setDoc(doc(db, 'wishlist', auth.currentUser.uid), {
          userId: auth.currentUser.uid,
          petIds: updated,
          updatedAt: new Date().toISOString()
        }, { merge: true }).catch(err => console.warn('Wishlist sync warning:', err));
      }

      return updated;
    });
  };

  const addToCart = (
    pet: Pet,
    addOns = { insurance: false, starterKit: true, vipTransport: false }
  ) => {
    if (!currentUser?.isLoggedIn) {
      setIsAuthModalOpen(true);
      showNotification('Please sign in to add pets to cart and place orders.');
      return;
    }
    setCart(prev => {
      const index = prev.findIndex(item => item.pet.id === pet.id);
      let addOnsTotal = 0;
      if (addOns.insurance) addOnsTotal += 25;
      if (addOns.starterKit) addOnsTotal += 85;
      if (addOns.vipTransport) addOnsTotal += 150;

      const totalPriceUSD = pet.priceUSD + addOnsTotal;

      if (index > -1) {
        const updated = [...prev];
        updated[index] = { pet, selectedAddOns: addOns, totalPriceUSD };
        showNotification(`${pet.name} updated in cart`);
        return updated;
      } else {
        showNotification(`${pet.name} added to cart!`);
        return [...prev, { pet, selectedAddOns: addOns, totalPriceUSD }];
      }
    });
  };

  const removeFromCart = (petId: string) => {
    setCart(prev => prev.filter(item => item.pet.id !== petId));
    showNotification('Item removed from cart');
  };

  const updateCartAddons = (
    petId: string,
    addOns: { insurance: boolean; starterKit: boolean; vipTransport: boolean }
  ) => {
    setCart(prev =>
      prev.map(item => {
        if (item.pet.id === petId) {
          let addOnsTotal = 0;
          if (addOns.insurance) addOnsTotal += 25;
          if (addOns.starterKit) addOnsTotal += 85;
          if (addOns.vipTransport) addOnsTotal += 150;
          return {
            ...item,
            selectedAddOns: addOns,
            totalPriceUSD: item.pet.priceUSD + addOnsTotal
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleCompare = (pet: Pet) => {
    setCompareList(prev => {
      const exists = prev.find(p => p.id === pet.id);
      if (exists) {
        showNotification(`${pet.breed} removed from comparison`);
        return prev.filter(p => p.id !== pet.id);
      }
      if (prev.length >= 4) {
        showNotification('Maximum 4 pets can be compared side-by-side');
        return prev;
      }
      showNotification(`${pet.breed} added to comparison list`);
      return [...prev, pet];
    });
  };

  const recordPetView = (pet: Pet) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== pet.id);
      return [pet, ...filtered].slice(0, 6);
    });
  };

  const setQuickViewPet = (pet: Pet | null) => {
    setQuickViewPetState(pet);
    setIsQuickViewOpen(!!pet);
  };

  const openReserveModal = (pet: Pet) => {
    if (!currentUser?.isLoggedIn) {
      setIsAuthModalOpen(true);
      showNotification('Please sign in to reserve a pet and place an order.');
      return;
    }
    setReservePetTarget(pet);
    setIsReserveModalOpen(true);
  };

  const closeReserveModal = () => {
    setIsReserveModalOpen(false);
    setReservePetTarget(null);
  };

  const placeOrder = (details: Partial<Order>): Order => {
    const mainPet = cart[0]?.pet || pets[0];
    const subtotal = cart.reduce((acc, item) => acc + item.pet.priceUSD, 0);
    const addonsTotal = cart.reduce((acc, item) => {
      let add = 0;
      if (item.selectedAddOns.insurance) add += 25;
      if (item.selectedAddOns.starterKit) add += 85;
      if (item.selectedAddOns.vipTransport) add += 150;
      return acc + add;
    }, 0);
    
    // Dynamic Location Pricing: $100 for Same Country (USA), $200 for Overseas/International
    const deliveryCost = details.deliveryCost !== undefined ? details.deliveryCost : 100;
    const taxes = Math.round((subtotal + addonsTotal) * 0.08);
    const totalAmount = subtotal + addonsTotal + deliveryCost + taxes;

    const newOrder: Order = {
      id: `YP-${Math.floor(100000 + Math.random() * 900000)}`,
      pet: mainPet,
      orderDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      status: 'Payment Confirmed',
      subtotal,
      addonsTotal,
      taxes,
      deliveryCost,
      totalAmount,
      trackingNumber: `TRACK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      estimatedDeliveryDate: new Date(Date.now() + 5 * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      customerName: details.customerName || 'Jane Doe',
      deliveryAddress: details.deliveryAddress || '123 Luxury Lane',
      cityStateZip: details.cityStateZip || 'Beverly Hills, CA 90210',
      phone: details.phone || '+1 (330) 516-1283',
      paymentMethod: details.paymentMethod || 'Credit Card (Visa)',
      depositPaid: details.depositPaid || false,
      depositAmount: details.depositAmount || 0,
    };

    setOrders(prev => [newOrder, ...prev]);

    // Save order to Firestore if logged in
    if (auth.currentUser) {
      setDoc(doc(db, 'orders', newOrder.id), {
        userId: auth.currentUser.uid,
        petId: mainPet.id,
        customerName: newOrder.customerName,
        phone: newOrder.phone,
        deliveryAddress: `${newOrder.deliveryAddress}, ${newOrder.cityStateZip}`,
        cityStateZip: newOrder.cityStateZip,
        deliveryCost,
        totalAmount,
        paymentMethod: newOrder.paymentMethod,
        status: newOrder.status,
        createdAt: new Date().toISOString()
      }).catch(err => console.warn('Firestore order save warning:', err));
    }
    
    // Mark pet status as reserved/sold
    setPets(prev => prev.map(p => p.id === mainPet.id ? { ...p, status: 'reserved' } : p));

    // Send HTTP Order Email Dispatch to Store Owner (craftking990@gmail.com)
    fetch('/api/orders/email-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: newOrder.id,
        petName: mainPet.name,
        breed: mainPet.breed,
        customerName: newOrder.customerName,
        email: 'craftking990@gmail.com',
        phone: newOrder.phone,
        deliveryAddress: `${newOrder.deliveryAddress}, ${newOrder.cityStateZip}`,
        destinationType: deliveryCost === 100 ? 'Domestic USA ($100)' : 'International Overseas ($200)',
        subtotal,
        deliveryCost,
        addonsTotal,
        totalAmount,
        paymentMethod: newOrder.paymentMethod
      })
    }).then(res => res.json()).then(data => {
      console.log('Order notification email dispatch result:', data);
    }).catch(err => console.error('Email notify error:', err));
    
    clearCart();
    setSelectedOrder(newOrder);
    showNotification(`Order #${newOrder.id} placed! Exact total of $${totalAmount} emailed to craftking990@gmail.com.`);
    return newOrder;
  };

  const formatPrice = (priceUSD: number): string => {
    const { symbol, rate } = CURRENCY_RATES[currency];
    const converted = Math.round(priceUSD * rate);
    return `${symbol}${converted.toLocaleString()}`;
  };

  const formatAge = (months: number): string => {
    if (months < 1) return '3 Weeks Old';
    if (months === 1) return '1 Month Old';
    if (months < 12) return `${months} Months Old`;
    const years = Math.floor(months / 12);
    const remMonths = months % 12;
    if (remMonths === 0) return `${years} ${years === 1 ? 'Year' : 'Years'} Old`;
    return `${years} Yr ${remMonths} Mo Old`;
  };

  // Admin CRUD
  const addPet = (newPet: Pet) => {
    setPets(prev => [newPet, ...prev]);
    showNotification(`New pet ${newPet.name} added to catalog!`);
  };

  const updatePet = (petId: string, updated: Partial<Pet>) => {
    setPets(prev => prev.map(p => p.id === petId ? { ...p, ...updated } : p));
    showNotification(`Pet details updated`);
  };

  const deletePet = (petId: string) => {
    setPets(prev => prev.filter(p => p.id !== petId));
    showNotification('Pet removed from inventory');
  };

  return (
    <PetStoreContext.Provider
      value={{
        pets,
        breeders,
        currency,
        language,
        darkMode,
        wishlist,
        cart,
        recentlyViewed,
        compareList,
        orders,
        activeTab,
        selectedPetId,
        selectedOrder,
        selectedBreeder,
        searchQuery,
        filterState,
        isQuizOpen,
        isBreedIdentifierOpen,
        isCompareOpen,
        isQuickViewOpen,
        quickViewPet,
        isChatOpen,
        isReserveModalOpen,
        reservePetTarget,
        notification,

        currentUser,
        rememberedEmail,
        isAuthModalOpen,
        setIsAuthModalOpen,
        loginUser,
        loginWithGoogle,
        registerUser,
        logoutUser,
        setRememberedEmail,

        setCurrency,
        setLanguage,
        setDarkMode,
        setActiveTab,
        setSelectedPetId,
        setSelectedOrder,
        setSelectedBreeder,
        setSearchQuery,
        setFilterState,
        setIsQuizOpen,
        setIsBreedIdentifierOpen,
        setIsCompareOpen,
        setIsChatOpen,
        setQuickViewPet,
        openReserveModal,
        closeReserveModal,

        toggleWishlist,
        addToCart,
        removeFromCart,
        updateCartAddons,
        clearCart,
        toggleCompare,
        recordPetView,
        placeOrder,
        showNotification,

        formatPrice,
        formatAge,

        addPet,
        updatePet,
        deletePet
      }}
    >
      {children}
    </PetStoreContext.Provider>
  );
};

export const usePetStore = () => {
  const context = useContext(PetStoreContext);
  if (!context) {
    throw new Error('usePetStore must be used within a PetStoreProvider');
  }
  return context;
};
