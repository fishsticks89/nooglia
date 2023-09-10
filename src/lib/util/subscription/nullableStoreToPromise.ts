import type { Readable } from "svelte/motion";
import { subscribeIgnoreFirst } from "./subscribeIgnoreFirst";

export function nullableStoreToPromise<T>(store: Readable<T | null>, rejectOnNull = false): Promise<Readable<T>> {
    let lastVal: T | null = null;
    return new Promise((resolve, reject) => {
        const unsubscribe = store.subscribe((val) => {
            if (val === null) {
                if (lastVal != null) {
                    unsubscribe();
                    throw new Error("Store is null after being non-null");
                }
            }
            if (lastVal === null && val !== null)
                resolve(store as Readable<T>);
            lastVal = val;
        });

        // reject on null
        if (rejectOnNull) {
            const stop = subscribeIgnoreFirst(store, (val) => {
                if (val === null) reject("Store is null");
                else stop();
            });
        }
    });
}