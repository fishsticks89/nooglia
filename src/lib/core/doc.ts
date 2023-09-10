import { authState } from "$lib/auth/authState";
import { setsCollection } from "$lib/firebase";
import { promise } from "$lib/util/promise";
import { store } from "$lib/util/store";
import { addDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { get, type Readable } from "svelte/store";

interface docDoc {
    user: string,
    name: string,
    contents: string[],
}

export async function createSet() {
    const uid = get(authState)?.uid;
    if (!uid) throw new Error("No user when creating set");
    const doc: docDoc = {
        user: uid,
        name: "",
        contents: [],
    };
    const ref = await addDoc(setsCollection, doc);
    return ref.id;
}

export interface term { readonly q: string, readonly a: string }

export interface docState {
    readonly name: string,
    readonly terms: term[],
    readonly id: string,
    readonly setTerm: (index: number, newItem: { q?: string, a?: string } | null) => Promise<void>,
    readonly setName: (newName: string) => Promise<void>,
}

function encodeTerm(term: term): string {
    const newLines = new RegExp(/\n+/, "g");
    let maxNewLines = 0;
    [...term.a.matchAll(newLines), ...term.q.matchAll(newLines)].forEach((e) => {
        if (e[0].length > maxNewLines) maxNewLines = e[0].length;
    }
    );
    return term.q + "\n".repeat(maxNewLines + 1) + term.a;
}

function decodeTerm(term: string): term {
    const newLines = new RegExp(/\n+/, "g");
    const split = term.match(newLines);
    if (!split) throw new Error("No newlines in term");
    const longest = split.reduce((a, b) => a.length > b.length ? a : b);
    const q = term.substring(0, term.indexOf(longest));
    const a = term.substring(term.indexOf(longest) + longest.length);
    return { q, a };
}

export function docState(id: string): Promise<Readable<docState>> {
    const ref = doc(setsCollection, id);
    let [docSubProm, resDocSub, reject] = promise<Readable<docState>>();
    let setDocState: null | ((e: docState) => void) = null;
    onSnapshot(ref, (doc) => {
        if (doc.exists()) {
            const data = doc.data() as docDoc;
            const state: docState = {
                name: data.name,
                terms: data.contents.map((e) => {
                    const split = e.indexOf("\n");
                    return { q: e.substring(0, split), a: e.substring(split + 1) };
                }),
                id,
                setTerm: async (index, newItem) => {
                    let newContents = [...data.contents];
                    if (!newItem) {
                        newContents = newContents.filter((e, i) => i !== index);

                    } else {
                        newContents[index] = encodeTerm({
                            ...decodeTerm(newContents[index]),
                            ...newItem
                        });
                    }
                    await updateDoc(ref, { contents: newContents });
                },
                setName: async (newName) => {
                    await updateDoc(ref, { name: newName });
                },
            };
            if (setDocState) {
                setDocState(state);
            } else {
                const [docStateSub, newSetDocState] = store(state);
                resDocSub(docStateSub);
                setDocState = newSetDocState;
            }
        } else {
            reject("No such document");
        }
    });
    return docSubProm;
}