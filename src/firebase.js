import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDlYnmMZZNpH8NYK_ayLvqUqZhSLcnKkKw",
    authDomain: "eduhub-ap-35b5e.firebaseapp.com",
    projectId: "eduhub-ap-35b5e",
    storageBucket: "eduhub-ap-35b5e.appspot.com",
    messagingSenderId: "800476615886",
    appId: "1:800476615886:web:6a33f2904aed22b8d92c9f"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);
export const storage = getStorage(app);