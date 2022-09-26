import type { DocumentReference } from "firebase/firestore";
import type { set } from "$lib/data/db"
import type { Writable } from "svelte/store";

export type setStore = Writable<{ doc: DocumentReference | null, set: set, isEditing: boolean }>;