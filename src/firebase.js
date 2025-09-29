import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyBr44ELiMhReF2swR4lNThm1q959_1W7d0",
  authDomain: "wastemanagement-5886b.firebaseapp.com",
  projectId: "wastemanagement-5886b",
  storageBucket: "wastemanagement-5886b.firebasestorage.app",
  messagingSenderId: "536287026211",
  appId: "1:536287026211:web:336cd0b3ca221bc368a596",
  measurementId: "G-KZG0ZYQ2W6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;