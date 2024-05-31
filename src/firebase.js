import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDCYDpYIWpWf3ovrDHwBwQZkAnYicSngN4",
  authDomain: "yazi-34399.firebaseapp.com",
  projectId: "yazi-34399",
  storageBucket: "yazi-34399.appspot.com",
  messagingSenderId: "890627149584",
  appId: "1:890627149584:web:1a9501d8cda3504edd9f95",
  measurementId: "G-Q601E47GMP"
};
export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
