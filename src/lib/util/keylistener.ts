export function listenKeys (fn: (this: Document, ev: KeyboardEvent) => any) {
    document.addEventListener("keydown", fn);
    return () => {
        document.removeEventListener(fn)
    }
}