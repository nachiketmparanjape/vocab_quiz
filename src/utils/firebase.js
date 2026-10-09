import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut as fbSignOut } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBGEMuRUrkTBT-GwgZobomdSAEiNg7jsH8",
  authDomain: "vocab-quiz-f99cb.firebaseapp.com",
  projectId: "vocab-quiz-f99cb",
  storageBucket: "vocab-quiz-f99cb.firebasestorage.app",
  messagingSenderId: "786443533926",
  appId: "1:786443533926:web:79d6be78d4cde3b24fb7a7",
  measurementId: "G-D66X6ZYJZX",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Enable offline persistence so the app works without network
enableIndexedDbPersistence(db).catch(() => {});

const googleProvider = new GoogleAuthProvider();

export function onAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

export function signInWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export function signOut() {
  return fbSignOut(auth);
}

export function getUid() {
  return auth.currentUser?.uid;
}

export { db, auth };
