import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCYwi3LgznOmjq0FUunqJyRAXfbWxERtOU",
  authDomain: "ain-research-api.firebaseapp.com",
  projectId: "ain-research-api",
  storageBucket: "ain-research-api.firebasestorage.app",
  messagingSenderId: "405317069105",
  appId: "1:405317069105:web:d334a4616a173fe92d2810",
  measurementId: "G-ETNEJCDTXX"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
