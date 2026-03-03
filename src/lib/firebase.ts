import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "pi-3p-tads049.firebaseapp.com",
  projectId: "pi-3p-tads049",
  storageBucket: "pi-3p-tads049.appspot.com",
  messagingSenderId: "",
  appId: "",
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
