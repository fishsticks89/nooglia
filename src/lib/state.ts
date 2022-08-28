import { browser } from '$app/env';
import { writable, type Writable } from 'svelte/store';

const initalstate = (browser) ? localStorage.getItem("state") : null

export const state: Writable<{ text: string, concat: number }> = writable((initalstate != undefined && initalstate != null) ? JSON.parse(initalstate) : { text: "", concat: 0 });

if (browser)
    state.subscribe((state) => {
        localStorage.setItem("state", JSON.stringify(state))
    })