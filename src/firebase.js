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
  appId: "1:536287026211:web:a9b6f4e600a6fbd668a596",
  measurementId: "G-C0THBLSP50"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;