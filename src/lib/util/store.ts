import { get, readable, type StartStopNotifier } from "svelte/store";

export function store<T>(startVal: T) {
    let set: (value: T) => void;
    const st = readable(startVal, s => {
        set = s;
    });
    get(st);
    return [st, set!] as const;
}