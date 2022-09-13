import type { User } from "firebase/auth";
import { type DocumentReference, setDoc, doc, getDoc, DocumentSnapshot, type DocumentData } from "firebase/firestore"
import { get } from "svelte/store";
import { authState } from "$lib/auth/authState";
import { users, sets } from "$lib/firebase"

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
    contents: string;
    mode: string;
}
export const newset = (): set => { return { user: "", name: "", contents: "", mode: "Comma" } };
export function setEquals(object0: set, object1: set): boolean {
    return object0.mode === object1.mode && object0.contents === object1.contents && object0.name === object1.name;
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
export const createCloudSet = async (user: User, name: string, contents: string, mode: string) => {
    const nsetdoc = doc(sets);
    await setDoc(nsetdoc, { user: user.uid, name, contents, mode})
    return nsetdoc;
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