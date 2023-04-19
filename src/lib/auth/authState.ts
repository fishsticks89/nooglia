import { browser } from '$app/environment';
import { writable, type Writable } from 'svelte/store';
import { getRedirectResult, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, type User } from "firebase/auth";
import { auth } from '$lib/firebase';
import { event, mix } from '$lib/mixyp';

export const authState: Writable<User | null> = writable(null);

export let expectingSignIn = !browser || !!localStorage.getItem('expectSignIn');
setTimeout(() => {
    expectingSignIn = false;
}, 0)

authState.subscribe(e => {
    if (e !== null) {
        event("Signin")
        mix((mixpanel) => {
            mixpanel.identify(e.uid);
            mixpanel.people.set("name", e.displayName)
            mixpanel.people.set("email", e.email)
        })
    }
    if (browser)
        if (e) {
            // User just signed in, we should not display dialog next time because of firebase auto-login
            localStorage.setItem('expectSignIn', '1')
        } else {
            // User just signed-out or auto-login failed, we will show sign-in form immediately the next time he loads the page
            localStorage.removeItem('expectSignIn')

            // Here implement logic to trigger the login dialog or redirect to sign-in page, if necessary. Don't redirect if dialog is already visible.
            // e.g. showDialog()
        }
})

if (browser) {
    onAuthStateChanged(auth, (newuser) => {
        authState.set(newuser);
    });

    getRedirectResult(auth)
        .then((result) => {
            // The signed-in user info.
            if (result != null) authState.set(result.user);
        })
        .catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });
}

export function signin() {
    const provider = new GoogleAuthProvider();
    
    signInWithPopup(auth, provider).then((result) => {
        // The signed-in user info.
        if (result != null) authState.set(result.user);
    })
}