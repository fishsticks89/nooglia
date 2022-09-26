import { type DocumentReference, setDoc, doc, getDoc, DocumentSnapshot, type DocumentData, updateDoc } from "firebase/firestore"
import { get } from "svelte/store";
import { authState } from "$lib/auth/authState";
import { users, sets } from "$lib/firebase"
import { dev } from "$app/environment";
import type { setStore } from "./setStore";

export type user = {
    email: string;
    lastEdited: DocumentReference | null;
}
const newuser = () => {
    return { email: get(authState)?.email, lastedited: null }
}

export type set = {
    user: string;
    name: string;
    contents: string[];
    mode: string;
}
export const newset = (user: string = ''): set => { return { user, name: "", contents: ["\n"], mode: "Comma" } };
export function setEquals(object0: set, object1: set): boolean {
    return object0.mode === object1.mode && object0.contents.filter((e, i) => { e !== object1.contents[i] }).length === 0 && object0.name === object1.name;
}

export interface term {
    q: string,
    a: string
}

export const toTerm = (text: string): term => {
    const split = text.indexOf("\n");
    return { q: text.substring(0, split), a: text.substring(split + 1) }
}

export const termToString = (term: term) => {
    return term.q.split("\n").join("") + "\n" + term.a.split("\n").join("");
}

export const getUserDoc = async (): Promise<DocumentSnapshot> => {
    const userDoc = await getDoc(doc(users, get(authState)?.uid));
    if (userDoc.exists()) {
        return userDoc
    }
    else
        setDoc(doc(users, get(authState)?.uid), newuser());
    return getUserDoc();
}
export const createCloudSet = async (set: set) => {
    const nsetdoc = doc(sets);
    await setDoc(nsetdoc, set)
    return nsetdoc;
}
export const setCurrentSet = (doc: DocumentReference<DocumentData>, state: setStore) => {
    getCloudSet(doc).then((set) => {
        state.update(() => {
            getUserDoc().then((udoc) => {
                updateDoc(udoc.ref, { lastedited: doc });
            });
            return {
                set,
                doc,
                isEditing: false
            };
        });
    });
}
export const getCloudSet = async (ref: DocumentReference<DocumentData>): Promise<set> => {
    const doc = await getDoc(ref);
    return {
        name: doc.get("name"),
        mode: doc.get("mode"),
        contents: doc.get("contents"),
        user: doc.get("user"),
    }
}