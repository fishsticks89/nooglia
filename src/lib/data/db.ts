import { type DocumentReference, setDoc, doc, getDoc, DocumentSnapshot, type DocumentData, updateDoc } from "firebase/firestore"
import { get } from "svelte/store";
import { authState } from "$lib/auth/authState";
import { usersCollection, setsCollection } from "$lib/firebase";

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
}
export const newset = (user: string = ''): set => { return { user, name: "", contents: ["\n"] } };
export function setEquals(object0: set, object1: set): boolean {
    return object0.contents.filter((e, i) => { e !== object1.contents[i] }).length === 0 && object0.name === object1.name;
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

export const getUserDoc = async (useruid: string): Promise<DocumentSnapshot> => {
    const userDoc = await getDoc(doc(usersCollection, useruid));
    if (userDoc.exists()) {
        return userDoc
    }
    else {
        setDoc(doc(usersCollection, get(authState)?.uid), newuser());
        const userDoc = await getDoc(doc(usersCollection, useruid));
        if (userDoc.exists()) {
            return userDoc
        } else {
            throw "userdoc not created"
        }
    }
}
export const createCloudSet = async (set: set) => {
    const nsetdoc = doc(setsCollection);
    await setDoc(nsetdoc, set)
    return nsetdoc;
}

export const getCloudSet = async (ref: DocumentReference<DocumentData>): Promise<set | null> => {
    const doc = await getDoc(ref);
    return (doc.exists()) ? {
        name: doc.get("name"),
        contents: doc.get("contents"),
        user: doc.get("user"),
    } : null
}