import type { Readable, Subscriber } from "svelte/motion";

export function changeNotifier<T>(initial: T): [Readable<T>, (newVal: T, notify: boolean) => void] {
    let subscribers:Subscriber<T>[]= [];
    let value = initial;
    function set(newValue: T, notify: boolean) {
        value = newValue;
        if (notify) subscribers.forEach((s) => s(value));
    }
    function subscribe(run: Subscriber<T>): () => void {
        subscribers.push(run);
        run(value);
        return () => {
            subscribers = subscribers.filter((s) => s !== run);
        };
    }
    return [{ subscribe }, set];
}