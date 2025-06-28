// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtSiStEJFUQSHyXbcCFrI3aEPJjDS8r-k",
  authDomain: "gameverse-pz2qf.firebaseapp.com",
  projectId: "gameverse-pz2qf",
  storageBucket: "gameverse-pz2qf.appspot.com",
  messagingSenderId: "555263507101",
  appId: "1:555263507101:web:e4ae41b7c072ddd6777274"
};

// Initialize Firebase
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
