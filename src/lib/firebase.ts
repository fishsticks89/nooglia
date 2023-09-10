
import { initializeApp } from "firebase/app";
import { collection, connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectAuthEmulator, getAuth, GoogleAuthProvider } from "firebase/auth";
import { browser, dev } from "$app/environment";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBpGPOCBY5ArJYF3X6zxm9F9BAspS4_qXI",
  authDomain: "nooglia-2383a.firebaseapp.com",
  projectId: "nooglia-2383a",
  storageBucket: "nooglia-2383a.appspot.com",
  messagingSenderId: "448020777089",
  appId: "1:448020777089:web:208bb363cd58124d43e580"
};

const connectToEmulators = dev && false;

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
if (connectToEmulators) connectFirestoreEmulator(db, 'localhost', 4040);
export const usersCollection = collection(db, "users")
export const setsCollection = collection(db, "sets")

export const provider = new GoogleAuthProvider();
export const auth = getAuth(app);
if (connectToEmulators) connectAuthEmulator(auth, "http://localhost:9099");