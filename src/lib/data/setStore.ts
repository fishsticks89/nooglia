import type { DocumentReference } from "firebase/firestore";
import type { set } from "$lib/data/db"
import { get, type Writable } from "svelte/store";

export const toSetStore = (store: setStoreOrNull) => {
    if (get(store) != null)
    return store as setStore
    throw "store is NULLL LMAO"
}

export type setStore = Writable<{ doc: DocumentReference, set: set, isEditing: boolean, isEditable: boolean }>;
export type setStoreOrNull = Writable<{ doc: DocumentReference, set: set, isEditing: boolean, isEditable: boolean } | null>;