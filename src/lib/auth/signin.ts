import { getAuth, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { app } from "$lib/firebase";

export function signin() {
    const provider = new GoogleAuthProvider();

    const auth = getAuth(app);
    
    signInWithRedirect(auth, provider);
}