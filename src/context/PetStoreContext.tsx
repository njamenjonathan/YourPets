import React, { createContext, useContext, useState, useEffect } from 'react';
import { Pet, CartItem, FilterState, Order, Currency, Language, Breeder, UserAccount } from '../types';
import { SAMPLE_PETS, SAMPLE_BREEDERS } from '../data/pets';
import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  onAuthStateChanged,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  onSnapshot,
  orderBy
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
  loginUser: (email: string, password: string) => Promise<{ success: boolean; message: string; needs2FA?: boolean }>;
  verifyTwoFactorCode: (code: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; message: string }>;
  registerUser: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
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
  const [activeTab, setActiveTabState] = useState<string>(() => window.location.hash.replace('#/', '') || 'home');
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
    return null;
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
          memberSince: '2026',
          uid: fbUser.uid,
          role: userEmail === (import.meta.env.VITE_ADMIN_EMAIL || 'craftking990@gmail.com') ? 'admin' : 'customer',
          twoFactorVerified: sessionStorage.getItem(`yourpets_2fa_${fbUser.uid}`) === 'verified'
        };

        setCurrentUser(userObj);
        setRememberedEmail(userEmail);
        localStorage.setItem('yourpets_current_user', JSON.stringify(userObj));

        // Save/Sync user profile to Firestore
        try {
          await setDoc(doc(db, 'users', fbUser.uid), {
            uid: fbUser.uid,
            displayName: userDisplayName,
            name: userDisplayName,
            email: userEmail,
            role: userEmail === (import.meta.env.VITE_ADMIN_EMAIL || 'craftking990@gmail.com') ? 'admin' : 'customer',
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

  useEffect(() => {
    const onPopState = () => setActiveTabState(window.location.hash.replace('#/', '') || 'home');
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    const nextHash = `#/${tab}`;
    if (window.location.hash !== nextHash) {
      window.history.pushState({ tab }, '', nextHash);
    }
  };

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
      const role = userEmail === (import.meta.env.VITE_ADMIN_EMAIL || 'craftking990@gmail.com') ? 'admin' : 'customer';

      const userObj: UserAccount = {
        uid: fbUser.uid,
        name: userDisplayName,
        email: userEmail,
        role,
        isLoggedIn: true,
        twoFactorVerified: true,
        memberSince: '2026'
      };

      sessionStorage.setItem(`yourpets_2fa_${fbUser.uid}`, 'verified');
      setCurrentUser(userObj);
      setRememberedEmail(userEmail);
      await setDoc(doc(db, 'users', fbUser.uid), {
        uid: fbUser.uid,
        displayName: userDisplayName,
        name: userDisplayName,
        email: userEmail,
        role,
        photoURL: fbUser.photoURL || '',
        updatedAt: new Date().toISOString()
      }, { merge: true });

      setIsAuthModalOpen(false);
      showNotification(`Welcome, ${userDisplayName}! Signed in with Google.`);
      return { success: true, message: 'Signed in with Google successfully' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Google Sign-In failed. Please try again.' };
    }
  };

  const loginUser = async (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail) || password.length < 6) {
      return { success: false, message: 'Enter a valid email and password.' };
    }
    try {
      const result = await signInWithEmailAndPassword(auth, cleanEmail, password);
      const token = await result.user.getIdToken();
      const res = await fetch('/api/auth/send-2fa-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email: cleanEmail })
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Unable to send verification code.');
      setCurrentUser({
        uid: result.user.uid,
        name: result.user.displayName || cleanEmail.split('@')[0],
        email: cleanEmail,
        role: cleanEmail === (import.meta.env.VITE_ADMIN_EMAIL || 'craftking990@gmail.com') ? 'admin' : 'customer',
        isLoggedIn: false,
        twoFactorVerified: false,
        memberSince: '2026'
      });
      setRememberedEmail(cleanEmail);
      return { success: true, needs2FA: true, message: 'Verification code sent to your email.' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Login failed.' };
    }
  };

  const verifyTwoFactorCode = async (code: string) => {
    if (!auth.currentUser) return { success: false, message: 'Please log in again.' };
    if (!/^\d{6}$/.test(code.trim())) return { success: false, message: 'Enter the 6-digit code.' };
    try {
      const token = await auth.currentUser.getIdToken();
      const res = await fetch('/api/auth/verify-2fa-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ code: code.trim() })
      });
      const data = await res.json();
      if (!res.ok) return { success: false, message: data.error || 'Invalid verification code.' };
      const email = auth.currentUser.email || '';
      const userObj: UserAccount = {
        uid: auth.currentUser.uid,
        name: auth.currentUser.displayName || email.split('@')[0],
        email,
        role: email === (import.meta.env.VITE_ADMIN_EMAIL || 'craftking990@gmail.com') ? 'admin' : 'customer',
        isLoggedIn: true,
        twoFactorVerified: true,
        memberSince: '2026'
      };
      sessionStorage.setItem(`yourpets_2fa_${auth.currentUser.uid}`, 'verified');
      setCurrentUser(userObj);
      setIsAuthModalOpen(false);
      showNotification(`Welcome back, ${userObj.name}!`);
      return { success: true, message: 'Login verified.' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Verification failed.' };
    }
  };

  const registerUser = async (name: string, email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    if (cleanName.length < 2 || !/^\S+@\S+\.\S+$/.test(cleanEmail) || password.length < 6) {
      return { success: false, message: 'Enter a name, valid email, and password of at least 6 characters.' };
    }
    try {
      const res = await fetch('/api/auth/signup-check', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: cleanEmail }) });
      if (!res.ok) throw new Error((await res.json()).error || 'Too many signup attempts.');
      const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      await updateProfile(cred.user, { displayName: cleanName });
      const role = cleanEmail === (import.meta.env.VITE_ADMIN_EMAIL || 'craftking990@gmail.com') ? 'admin' : 'customer';
      await setDoc(doc(db, 'users', cred.user.uid), { uid: cred.user.uid, name: cleanName, displayName: cleanName, email: cleanEmail, role, createdAt: new Date().toISOString() }, { merge: true });
      sessionStorage.setItem(`yourpets_2fa_${cred.user.uid}`, 'verified');
      setCurrentUser({ uid: cred.user.uid, name: cleanName, email: cleanEmail, role, isLoggedIn: true, twoFactorVerified: true, memberSince: new Date().getFullYear().toString() });
      setRememberedEmail(cleanEmail);
      setIsAuthModalOpen(false);
      showNotification(`Account created! Welcome, ${cleanName}!`);
      return { success: true, message: 'Account registered' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Account registration failed.' };
    }
  };

  const resetPassword = async (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) return { success: false, message: 'Enter a valid email address.' };
    try {
      await sendPasswordResetEmail(auth, cleanEmail);
      return { success: true, message: 'Password reset email sent.' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Could not send password reset email.' };
    }
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

  useEffect(() => {
    if (currentUser?.role !== 'admin' || !currentUser.isLoggedIn) return;
    const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const remoteOrders = snapshot.docs.map((orderDoc) => ({ id: orderDoc.id, ...orderDoc.data() } as Partial<Order> & { createdAt?: string }));
      setOrders(prev => {
        const merged = [...prev];
        remoteOrders.forEach(remote => {
          if (!merged.some(order => order.id === remote.id)) {
            merged.push({
              id: remote.id || 'unknown',
              pet: pets[0],
              orderDate: typeof remote.createdAt === 'string' ? new Date(remote.createdAt).toLocaleDateString() : 'Recent',
              status: (remote.status as Order['status']) || 'Pending',
              subtotal: Number(remote.subtotal || 0),
              addonsTotal: Number(remote.addonsTotal || 0),
              taxes: Number(remote.taxes || 0),
              deliveryCost: Number(remote.deliveryCost || 0),
              totalAmount: Number(remote.totalAmount || 0),
              trackingNumber: String(remote.trackingNumber || ''),
              estimatedDeliveryDate: String(remote.estimatedDeliveryDate || ''),
              customerName: String(remote.customerName || ''),
              deliveryAddress: String(remote.deliveryAddress || ''),
              cityStateZip: String(remote.cityStateZip || ''),
              phone: String(remote.phone || ''),
              paymentMethod: String(remote.paymentMethod || ''),
              buyerEmail: String(remote.buyerEmail || ''),
              items: remote.items || []
            });
          }
        });
        return merged;
      });
    }, (err) => console.warn('Admin orders subscription warning:', err));
    return () => unsubscribe();
  }, [currentUser?.role, currentUser?.isLoggedIn, pets]);

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
      status: 'Pending',
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
      buyerEmail: currentUser?.email,
      items: cart.map(item => ({ productName: item.pet.name, quantity: 1, price: item.pet.priceUSD, total: item.totalPriceUSD })),
      depositPaid: details.depositPaid || false,
      depositAmount: details.depositAmount || 0,
    };

    setOrders(prev => [newOrder, ...prev]);

    // Save order to Firestore if logged in
    if (auth.currentUser) {
      setDoc(doc(db, 'orders', newOrder.id), {
        userId: auth.currentUser.uid,
        petId: mainPet.id,
        items: newOrder.items || [],
        buyerEmail: currentUser?.email || '',
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
        verifyTwoFactorCode,
        resetPassword,
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
