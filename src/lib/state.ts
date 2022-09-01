import { browser } from '$app/env';
import { writable, type Writable } from 'svelte/store';
import type { User } from "firebase/auth";

const initalstate = (browser) ? localStorage.getItem("state") : null

export const authState: Writable<User | null> = writable(null);