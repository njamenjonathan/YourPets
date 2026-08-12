import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  User as FirebaseUser
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import bundledConfig from '../../firebase-applet-config.json';

/**
 * Firebase project settings.
 *
 * By default the project that ships with this repository is used. To point the
 * site at your own Firebase project instead, set the VITE_FIREBASE_* variables
 * in .env — no committed file needs editing. Get the values from the Firebase
 * console: Project settings -> General -> Your apps -> SDK setup and config.
 */
const fromEnv = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID
};

const usingEnvConfig = Boolean(fromEnv.apiKey && fromEnv.projectId && fromEnv.appId);

const firebaseConfig = usingEnvConfig
  ? {
      apiKey: fromEnv.apiKey as string,
      authDomain: (fromEnv.authDomain as string) || `${fromEnv.projectId}.firebaseapp.com`,
      projectId: fromEnv.projectId as string,
      appId: fromEnv.appId as string,
      storageBucket: (fromEnv.storageBucket as string) || `${fromEnv.projectId}.appspot.com`,
      messagingSenderId: (fromEnv.messagingSenderId as string) || '',
      firestoreDatabaseId: (fromEnv.firestoreDatabaseId as string) || '(default)'
    }
  : bundledConfig;

/** Where the settings came from, and whether they look usable at all. */
export const firebaseSetup = {
  source: usingEnvConfig ? ('env' as const) : ('bundled' as const),
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  /** A blank or obviously placeholder key cannot talk to Firebase at all. */
  looksConfigured:
    Boolean(firebaseConfig.apiKey) &&
    Boolean(firebaseConfig.projectId) &&
    !/^(your|xxx|placeholder|changeme)/i.test(String(firebaseConfig.apiKey))
};

// A one-line note so you can confirm which project the site is talking to.
console.info(
  `[YourPets] Firebase project "${firebaseSetup.projectId}" ` +
    `(settings from ${firebaseSetup.source === 'env' ? '.env' : 'firebase-applet-config.json'})`
);

if (!firebaseSetup.looksConfigured) {
  console.error(
    '[YourPets] Firebase is not configured. Set VITE_FIREBASE_API_KEY, ' +
      'VITE_FIREBASE_PROJECT_ID and VITE_FIREBASE_APP_ID in .env — the values come from ' +
      'the Firebase console under Project settings -> General -> Your apps -> SDK setup and config.'
  );
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.warn('Firebase auth persistence warning:', err);
});
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export {
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
  orderBy
};
export type { FirebaseUser };
