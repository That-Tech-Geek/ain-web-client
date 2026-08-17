import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCYwi3LgznOmjq0FUunqJyRAXfbWxERtOU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ain-research-api.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ain-research-api",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ain-research-api.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "405317069105",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:405317069105:web:d334a4616a173fe92d2810",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-ETNEJCDTXX"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
