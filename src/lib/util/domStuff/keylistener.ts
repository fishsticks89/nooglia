import { onDestroy } from "svelte";

export function listenKeys(fn: (this: Document, ev: KeyboardEvent) => any) {
    document.addEventListener("keydown", fn);
    onDestroy(() => {
        document.removeEventListener("keydown", fn)
    })
}