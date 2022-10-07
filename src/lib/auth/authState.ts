import { browser } from '$app/environment';
import { writable, type Writable } from 'svelte/store';
import type { User } from "firebase/auth";
import mixpanel from 'mixpanel-browser';

const initalstate = (browser) ? localStorage.getItem("state") : null

export const authState: Writable<User | null> = writable(null);

authState.subscribe(e => {
    if (e !== null)
			mixpanel.track("Signin")
})