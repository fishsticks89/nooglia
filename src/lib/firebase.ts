
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { collection, connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectAuthEmulator, getAuth, GoogleAuthProvider } from "firebase/auth";
import { browser, dev } from "$app/env";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBjpIbTxAx-Ej_BPyYIqavigR6Nt4x-mT0",
  authDomain: "openlearn-cc171.firebaseapp.com",
  projectId: "openlearn-cc171",
  storageBucket: "openlearn-cc171.appspot.com",
  messagingSenderId: "436049346888",
  appId: "1:436049346888:web:e53d352cf7c2d63024737d",
  measurementId: "G-VZ6XVDWXGP"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = (browser && !dev) ? getAnalytics(app) : null;
export const db = getFirestore(app);
if (dev) connectFirestoreEmulator(db, 'localhost', 6060);
export const users = collection(db, "users")
export const sets = collection(db, "sets")

export const provider = new GoogleAuthProvider();
export const auth = getAuth(app);
if (dev) connectAuthEmulator(auth, "http://localhost:9099");