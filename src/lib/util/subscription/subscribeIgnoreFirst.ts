import type { Readable, Subscriber } from "svelte/motion";
import type { Stores } from "svelte/store";

export function subscribeIgnoreFirst<T>(store: Readable<T>, fn: Subscriber<T>) {
    let firedFirst = false;
    return store.subscribe(state => {
        if (!firedFirst) {
            firedFirst = true;
        } else {
            fn(state);
        }
    })
}