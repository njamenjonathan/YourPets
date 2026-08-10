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
import firebaseConfig from '../../firebase-applet-config.json';

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
