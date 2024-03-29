import { get, writable } from "svelte/store";
import { subscribeIgnoreFirst } from "$lib/util/subscription/subscribeIgnoreFirst";
import { browser } from "$app/environment";
import { store } from "$lib/util/subscription/store";
import { onDestroy } from "svelte";

export const darkmode = writable(false);

const [darkModeDisabled, setDarkModeDisabled] = store(false);

export function markDisableDarkMode() {
    if (get(darkModeDisabled)) return;
    setDarkModeDisabled(true);
    onDestroy(() => {
        setDarkModeDisabled(false);
    });
}

export {
    darkModeDisabled,
}

if (browser) {
    if (localStorage.getItem("darkmode") != null) {
        if (localStorage.getItem("darkmode") == "true") {
            darkmode.set(true);
        } else {
            darkmode.set(false);
        }
    } else {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        localStorage.setItem("darkmode", prefersDark.toString());
        darkmode.set(prefersDark);
    }

    setTimeout(() => {
        subscribeIgnoreFirst(darkmode, (value) => {
            localStorage.setItem("darkmode", value.toString());
        });
    });
}