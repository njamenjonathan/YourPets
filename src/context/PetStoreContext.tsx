import React, { createContext, useContext, useState, useEffect } from 'react';
import { Pet, CartItem, FilterState, Order, Currency, Breeder, UserAccount } from '../types';
import { SAMPLE_PETS, SAMPLE_BREEDERS } from '../data/pets';
import { addOnsTotalUSD, taxesUSD, DELIVERY_COST_USD } from '../lib/pricing';
import {
  auth,
  db,
  firebaseSetup,
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
  collection,
  query,
  onSnapshot,
  orderBy
} from '../lib/firebase';
import { where } from 'firebase/firestore';

/**
 * Keeps a single listing per pet id so the same companion can never show up
 * twice in the catalog (or in any grid derived from it).
 */
const dedupePets = (list: Pet[]): Pet[] => {
  const seen = new Set<string>();
  return list.filter(pet => {
    if (seen.has(pet.id)) return false;
    seen.add(pet.id);
    return true;
  });
};

const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || 'craftking990@gmail.com').toLowerCase();

/** Builds the app's user object from a Firebase user. */
const toUserAccount = (fbUser: { uid: string; email: string | null; displayName: string | null }): UserAccount => {
  const email = (fbUser.email || '').toLowerCase();
  return {
    uid: fbUser.uid,
    name: fbUser.displayName || email.split('@')[0] || 'Member',
    email,
    role: email === ADMIN_EMAIL ? 'admin' : 'customer',
    isLoggedIn: true,
    memberSince: new Date().getFullYear().toString()
  };
};

/**
 * What a customer sees for each Firebase error, plus — for the failures that
 * only a developer can fix — a precise note in the console saying what to do.
 * Every case gets its own message; nothing falls back to a generic one except
 * genuinely unknown codes.
 */
const AUTH_MESSAGES: Record<string, string> = {
  // --- Things the customer can fix -----------------------------------------
  'auth/invalid-email': 'That email address does not look right. Please check it and try again.',
  'auth/missing-email': 'Please enter your email address.',
  'auth/missing-password': 'Please enter your password.',
  'auth/user-not-found': 'No account found with that email. Use "Create Account" to register.',
  'auth/wrong-password': 'That password is not correct. Try again, or use "Forgot password?".',
  'auth/invalid-credential': 'Email or password is incorrect. If you have not registered yet, use "Create Account".',
  'auth/invalid-login-credentials': 'Email or password is incorrect. If you have not registered yet, use "Create Account".',
  'auth/email-already-in-use': 'An account with this email already exists. Please sign in instead, or use "Forgot password?".',
  'auth/weak-password': 'Please choose a longer password — at least 6 characters.',
  'auth/user-disabled': 'This account has been disabled. Please contact us on WhatsApp.',
  'auth/too-many-requests': 'Too many attempts. Please wait a few minutes and try again.',
  'auth/network-request-failed': 'Network problem. Check your connection and try again.',
  'auth/requires-recent-login': 'For security, please sign in again before making this change.',

  // --- Google sign-in ------------------------------------------------------
  'auth/popup-closed-by-user': 'Google sign-in was closed before it finished. Please try again.',
  'auth/cancelled-popup-request': 'Google sign-in was interrupted. Please try again.',
  'auth/popup-blocked': 'Your browser blocked the Google sign-in window. Allow pop-ups for this site and try again.',
  'auth/account-exists-with-different-credential':
    'You already have an account with this email using a different sign-in method. Try signing in with email and password.',

  // --- Setup problems: friendly outside, precise in the console ------------
  'auth/operation-not-allowed':
    'Email and password sign-up is switched off for this site. Please contact us on WhatsApp and we will set your account up.',
  'auth/admin-restricted-operation':
    'New sign-ups are currently closed. Please contact us on WhatsApp and we will set your account up.',
  'auth/unauthorized-domain':
    'Sign-in is not allowed from this web address yet. Please contact us on WhatsApp.',
  'auth/api-key-not-valid': 'Sign-in is temporarily unavailable. Please contact us on WhatsApp.',
  'auth/invalid-api-key': 'Sign-in is temporarily unavailable. Please contact us on WhatsApp.',
  'auth/configuration-not-found': 'Sign-in is temporarily unavailable. Please contact us on WhatsApp.',
  'auth/operation-not-supported-in-this-environment':
    'This browser cannot complete sign-in. Please try a different browser.'
};

/** Console guidance for the codes that only the site owner can resolve. */
const AUTH_SETUP_HELP: Record<string, string> = {
  'auth/operation-not-allowed':
    `Email/Password sign-in is DISABLED in Firebase project "${firebaseSetup.projectId}". ` +
    'Fix: Firebase console -> Authentication -> Sign-in method -> Email/Password -> Enable. ' +
    'If you do not have access to that project, create your own and set VITE_FIREBASE_API_KEY, ' +
    'VITE_FIREBASE_PROJECT_ID and VITE_FIREBASE_APP_ID in .env.',
  'auth/admin-restricted-operation':
    `Public sign-up is blocked in Firebase project "${firebaseSetup.projectId}". ` +
    'Fix: Firebase console -> Authentication -> Settings -> User actions -> allow "Create (sign-up)".',
  'auth/unauthorized-domain':
    `"${window.location.hostname}" is not an authorised domain for project "${firebaseSetup.projectId}". ` +
    'Fix: Firebase console -> Authentication -> Settings -> Authorized domains -> Add domain.',
  'auth/api-key-not-valid':
    'The Firebase API key is rejected. Check VITE_FIREBASE_API_KEY, or the apiKey in firebase-applet-config.json, ' +
    'against Firebase console -> Project settings -> General -> Your apps -> SDK setup and config.',
  'auth/invalid-api-key':
    'The Firebase API key is malformed. Check VITE_FIREBASE_API_KEY or firebase-applet-config.json.',
  'auth/configuration-not-found':
    `Firebase Authentication has not been set up on project "${firebaseSetup.projectId}". ` +
    'Fix: Firebase console -> Authentication -> Get started.'
};

/**
 * Finds the entry for a code. Firebase sometimes appends the server text to the
 * code itself — a bad key arrives as
 * "auth/api-key-not-valid.-please-pass-a-valid-api-key." — so an exact lookup
 * is not enough; fall back to the longest matching prefix.
 */
const lookupByCode = <T,>(table: Record<string, T>, code: string): T | undefined => {
  if (table[code]) return table[code];
  const prefix = Object.keys(table)
    .filter(key => code.startsWith(key))
    .sort((a, b) => b.length - a.length)[0];
  return prefix ? table[prefix] : undefined;
};

/** Turns a Firebase error into a message for the customer. */
const authErrorMessage = (err: unknown): string => {
  const code = (err as { code?: string })?.code || '';

  const setupHelp = lookupByCode(AUTH_SETUP_HELP, code);
  if (setupHelp) {
    console.error(`[YourPets auth] ${code}\n  ${setupHelp}`);
  } else if (code) {
    console.warn(`[YourPets auth] ${code}`);
  }

  const message = lookupByCode(AUTH_MESSAGES, code);
  if (message) return message;

  if (!firebaseSetup.looksConfigured) {
    console.error('[YourPets auth] Firebase settings are missing or placeholders — see src/lib/firebase.ts.');
    return 'Sign-in is not available right now. Please contact us on WhatsApp.';
  }

  console.error('[YourPets auth] Unhandled error:', err);
  return (err as { message?: string })?.message || 'Something went wrong. Please try again.';
};

const CURRENCY_STORAGE_KEY = 'yourpets_currency';

const CURRENCY_RATES: Record<Currency, { symbol: string; rate: number }> = {
  USD: { symbol: '$', rate: 1.0 },
  EUR: { symbol: '€', rate: 0.92 },
  GBP: { symbol: '£', rate: 0.78 },
  CAD: { symbol: 'CA$', rate: 1.36 },
  AUD: { symbol: 'AU$', rate: 1.52 }
};

const readStoredCurrency = (): Currency => {
  const stored = localStorage.getItem(CURRENCY_STORAGE_KEY);
  return stored && stored in CURRENCY_RATES ? (stored as Currency) : 'USD';
};

/**
 * Renders a USD amount in the currency the shopper picked. Every price the site
 * shows goes through here, so a page never mixes a converted total with a
 * hardcoded dollar figure.
 */
const formatPriceIn = (currency: Currency, priceUSD: number): string => {
  const { symbol, rate } = CURRENCY_RATES[currency];
  const converted = Math.round(priceUSD * rate);
  // Grouping is pinned to en-US so it always matches the leading symbol; the
  // visitor's OS locale would otherwise render "€1.234" next to "$1,234".
  return `${symbol}${converted.toLocaleString('en-US')}`;
};

interface PetStoreContextType {
  pets: Pet[];
  breeders: Breeder[];
  currency: Currency;
  darkMode: boolean;
  wishlist: string[];
  cart: CartItem[];
  orders: Order[];
  activeTab: string;
  selectedPetId: string | null;
  selectedOrder: Order | null;
  searchQuery: string;
  filterState: FilterState;
  isQuizOpen: boolean;
  isBreedIdentifierOpen: boolean;
  isQuickViewOpen: boolean;
  quickViewPet: Pet | null;
  isChatOpen: boolean;
  isReserveModalOpen: boolean;
  reservePetTarget: Pet | null;
  notification: string | null;

  // Authentication State & Actions
  currentUser: UserAccount | null;
  isAuthLoading: boolean;
  rememberedEmail: string;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  loginUser: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; message: string }>;
  registerUser: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logoutUser: () => void;
  setRememberedEmail: (email: string) => void;

  // Actions
  setCurrency: (c: Currency) => void;
  setDarkMode: (d: boolean | ((prev: boolean) => boolean)) => void;
  setActiveTab: (tab: string) => void;
  setSelectedPetId: (id: string | null) => void;
  setSelectedOrder: (order: Order | null) => void;
  setSearchQuery: (query: string) => void;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  setIsQuizOpen: (open: boolean) => void;
  setIsBreedIdentifierOpen: (open: boolean) => void;
  setIsChatOpen: (open: boolean) => void;
  setQuickViewPet: (pet: Pet | null) => void;
  openReserveModal: (pet: Pet) => void;
  closeReserveModal: () => void;

  toggleWishlist: (petId: string) => void;
  addToCart: (pet: Pet, addOns?: { insurance: boolean; starterKit: boolean; vipTransport: boolean }) => void;
  removeFromCart: (petId: string) => void;
  updateCartAddons: (petId: string, addOns: { insurance: boolean; starterKit: boolean; vipTransport: boolean }) => void;
  clearCart: () => void;
  placeOrder: (orderDetails: Partial<Order>) => Order;
  showNotification: (msg: string) => void;
  
  formatPrice: (priceUSD: number) => string;
  formatAge: (months: number) => string;

  // Admin Actions
  addPet: (newPet: Pet) => void;
  updatePet: (petId: string, updated: Partial<Pet>) => void;
  deletePet: (petId: string) => void;
}

export const INITIAL_FILTER_STATE: FilterState = {
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
  sortBy: 'recommended'
};

const PetStoreContext = createContext<PetStoreContextType | undefined>(undefined);

export const PetStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pets, setPets] = useState<Pet[]>(() => dedupePets(SAMPLE_PETS));
  const [breeders] = useState<Breeder[]>(SAMPLE_BREEDERS);
  const [currency, setCurrency] = useState<Currency>(readStoredCurrency);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTabState] = useState<string>(() => window.location.hash.replace('#/', '') || 'home');
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterState, setFilterState] = useState<FilterState>(INITIAL_FILTER_STATE);

  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isBreedIdentifierOpen, setIsBreedIdentifierOpen] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [quickViewPet, setQuickViewPetState] = useState<Pet | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [reservePetTarget, setReservePetTarget] = useState<Pet | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // User Authentication State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [rememberedEmail, setRememberedEmailState] = useState<string>(
    () => localStorage.getItem('yourpets_remembered_email') || ''
  );
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  // True until Firebase has told us whether a session exists, so gated pages do
  // not flash "sign in required" at someone who is already signed in.
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Firebase is the single source of truth for the session: it restores the
  // signed-in user on reload and clears it on sign-out.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setIsAuthLoading(false);

      if (!fbUser) {
        setCurrentUser(null);
        return;
      }

      const userObj = toUserAccount(fbUser);

      // On sign-up this listener can fire before updateProfile() has stored the
      // display name, which would replace the name just entered with the part
      // of the email before the @. Keep the better name when that happens.
      setCurrentUser(prev =>
        prev && prev.uid === userObj.uid && !fbUser.displayName ? { ...userObj, name: prev.name } : userObj
      );
      setRememberedEmail(userObj.email);

      // Mirror the profile into Firestore; failures here must never block login.
      try {
        await setDoc(
          doc(db, 'users', fbUser.uid),
          {
            uid: fbUser.uid,
            name: userObj.name,
            displayName: userObj.name,
            email: userObj.email,
            role: userObj.role,
            photoURL: fbUser.photoURL || '',
            updatedAt: new Date().toISOString()
          },
          { merge: true }
        );
      } catch (e) {
        console.warn('Firestore user sync warning:', e);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const onPopState = () => setActiveTabState(window.location.hash.replace('#/', '') || 'home');
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Keep the shopper's chosen currency across reloads instead of snapping back
  // to USD mid-purchase.
  useEffect(() => {
    localStorage.setItem(CURRENCY_STORAGE_KEY, currency);
  }, [currency]);

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
      const userObj = toUserAccount(result.user);
      setCurrentUser(userObj);
      setRememberedEmail(userObj.email);
      setIsAuthModalOpen(false);
      showNotification(`Welcome, ${userObj.name}!`);
      return { success: true, message: 'Signed in with Google.' };
    } catch (err) {
      return { success: false, message: authErrorMessage(err) };
    }
  };

  const loginUser = async (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      return { success: false, message: 'Please enter a valid email address.' };
    }
    if (password.length < 6) {
      return { success: false, message: 'Please enter your password (at least 6 characters).' };
    }
    try {
      const result = await signInWithEmailAndPassword(auth, cleanEmail, password);
      const userObj = toUserAccount(result.user);
      setCurrentUser(userObj);
      setRememberedEmail(userObj.email);
      setIsAuthModalOpen(false);
      showNotification(`Welcome back, ${userObj.name}!`);
      return { success: true, message: 'Signed in.' };
    } catch (err) {
      return { success: false, message: authErrorMessage(err) };
    }
  };

  const registerUser = async (name: string, email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    if (cleanName.length < 2) {
      return { success: false, message: 'Please enter your full name.' };
    }
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      return { success: false, message: 'Please enter a valid email address.' };
    }
    if (password.length < 6) {
      return { success: false, message: 'Please choose a password with at least 6 characters.' };
    }
    try {
      const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      await updateProfile(cred.user, { displayName: cleanName });
      const userObj = { ...toUserAccount(cred.user), name: cleanName };
      setCurrentUser(userObj);
      setRememberedEmail(cleanEmail);
      setIsAuthModalOpen(false);
      showNotification(`Account created. Welcome, ${cleanName}!`);
      return { success: true, message: 'Account created.' };
    } catch (err) {
      return { success: false, message: authErrorMessage(err) };
    }
  };

  const resetPassword = async (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      return { success: false, message: 'Please enter a valid email address.' };
    }
    try {
      await sendPasswordResetEmail(auth, cleanEmail);
      return { success: true, message: 'Password reset email sent. Check your inbox.' };
    } catch (err) {
      return { success: false, message: authErrorMessage(err) };
    }
  };

  const logoutUser = () => {
    signOut(auth)
      .then(() => showNotification('Signed out.'))
      .catch(() => showNotification('Could not sign out. Please try again.'));
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  /**
   * Loads orders from Firestore for the signed-in member.
   *
   * Admins subscribe to every order; a customer subscribes only to their own.
   * The `where` clause is not optional for customers: firestore.rules permits
   * reads only where userId matches the caller, and Firestore rejects a query
   * whose scope is wider than the rules allow rather than trimming the result.
   */
  useEffect(() => {
    if (!currentUser?.isLoggedIn) {
      // Signed out (or between accounts) — drop the previous member's orders.
      setOrders([]);
      return;
    }

    const isAdmin = currentUser.role === 'admin';
    const uid = currentUser.uid;
    if (!isAdmin && !uid) return;

    const ordersQuery = isAdmin
      ? query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
      : query(collection(db, 'orders'), where('userId', '==', uid), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const remoteOrders = snapshot.docs.map((orderDoc) => ({ id: orderDoc.id, ...orderDoc.data() } as Partial<Order> & { createdAt?: string; petId?: string }));
      setOrders(prev => {
        const merged = [...prev];
        remoteOrders.forEach(remote => {
          if (!merged.some(order => order.id === remote.id)) {
            merged.push({
              id: remote.id || 'unknown',
              // Restore the real pet from the stored petId; fall back only if it is gone.
              pet: pets.find(p => p.id === remote.petId) || pets[0],
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
    }, (err) => console.warn('Orders subscription warning:', err));
    return () => unsubscribe();
  }, [currentUser?.role, currentUser?.isLoggedIn, currentUser?.uid, pets]);

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
        showNotification(`${pet.breed} updated in cart`);
        return updated;
      } else {
        showNotification(`${pet.breed} added to cart!`);
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
    const addonsTotal = cart.reduce((acc, item) => acc + addOnsTotalUSD(item.selectedAddOns), 0);

    // Dynamic location pricing, in USD: domestic for the same country (USA),
    // international for overseas.
    const deliveryCost = details.deliveryCost !== undefined ? details.deliveryCost : DELIVERY_COST_USD.domestic;
    const taxes = taxesUSD(subtotal + addonsTotal);
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
      items: cart.map(item => ({ productName: `${item.pet.breed} (${item.pet.id})`, quantity: 1, price: item.pet.priceUSD, total: item.totalPriceUSD })),
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
        // Written so a reloaded order is complete rather than zeroed out.
        subtotal,
        addonsTotal,
        taxes,
        trackingNumber: newOrder.trackingNumber,
        estimatedDeliveryDate: newOrder.estimatedDeliveryDate,
        paymentMethod: newOrder.paymentMethod,
        status: newOrder.status,
        createdAt: new Date().toISOString()
      }).catch(err => console.warn('Firestore order save warning:', err));
    }
    
    // Mark pet status as reserved/sold
    setPets(prev => prev.map(p => p.id === mainPet.id ? { ...p, status: 'reserved' } : p));

    clearCart();
    setSelectedOrder(newOrder);
    showNotification(`Order #${newOrder.id} placed! Confirmation of your ${formatPriceIn(currency, totalAmount)} total is on its way to you.`);
    return newOrder;
  };

  const formatPrice = (priceUSD: number): string => formatPriceIn(currency, priceUSD);

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
    if (pets.some(p => p.id === newPet.id)) {
      showNotification('That listing is already in the catalog.');
      return;
    }
    setPets(prev => dedupePets([newPet, ...prev]));
    showNotification(`New ${newPet.breed} listing added to the catalog.`);
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
        darkMode,
        wishlist,
        cart,
        orders,
        activeTab,
        selectedPetId,
        selectedOrder,
        searchQuery,
        filterState,
        isQuizOpen,
        isBreedIdentifierOpen,
        isQuickViewOpen,
        quickViewPet,
        isChatOpen,
        isReserveModalOpen,
        reservePetTarget,
        notification,

        currentUser,
        isAuthLoading,
        rememberedEmail,
        isAuthModalOpen,
        setIsAuthModalOpen,
        loginUser,
        loginWithGoogle,
        resetPassword,
        registerUser,
        logoutUser,
        setRememberedEmail,

        setCurrency,
        setDarkMode,
        setActiveTab,
        setSelectedPetId,
        setSelectedOrder,
        setSearchQuery,
        setFilterState,
        setIsQuizOpen,
        setIsBreedIdentifierOpen,
        setIsChatOpen,
        setQuickViewPet,
        openReserveModal,
        closeReserveModal,

        toggleWishlist,
        addToCart,
        removeFromCart,
        updateCartAddons,
        clearCart,
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
