import { authState } from "$lib/auth/authState";
import { setsCollection } from "$lib/firebase";
import { changeNotifier } from "$lib/util/subscription/changeNotifier";
import { nullableStoreToPromise } from "$lib/util/subscription/nullableStoreToPromise";
import { preventReturn } from "$lib/util/subscription/preventReturn";
import { promise } from "$lib/util/subscription/promise";
import { store } from "$lib/util/subscription/store";
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

export interface term { readonly q: string, readonly a: string, readonly id: string }
export type termMaybeWithEmbed = term & { readonly embed?: number[] };
export type termWithEmbed = term & { readonly embed: number[] };

export interface docState {
    readonly name: string,
    readonly terms: term[],
    readonly id: string,
    readonly uid: string,
}

export interface docUpdater {
    readonly set: (newVal: Partial<docState>, notify?: boolean) => void,
}

export type docSub = Readable<docState> & docUpdater;

function encodeTerm(term: term): string {
    const newLines = new RegExp(/\n+/, "g");
    let maxNewLines = 0;
    [...term.a.matchAll(newLines), ...term.q.matchAll(newLines)].forEach((e) => {
        if (e[0].length > maxNewLines) maxNewLines = e[0].length;
    }
    );
    const t = term.q + "\n".repeat(maxNewLines + 1) + term.a + "\n" + term.id;
    return t;
}

function decodeTerm(term: string): term | null {

    const hasID = term.split("\n").length > 2 && !Number.isNaN(term.split("\n").at(-1));
    const id = hasID ? term.split("\n").at(-1)! : Math.random().toString();
    if (hasID) term = term.slice(0, term.lastIndexOf("\n"));
    
    const newLines = new RegExp(/\n+/, "g");
    const split = term.match(newLines);
    if (!split) return null;

    const longest = split.reduce((a, b) => a.length > b.length ? a : b);
    const q = term.slice(0, term.indexOf(longest));
    const a = term.slice(term.indexOf(longest) + longest.length);

    return { q, a, id };
}

export async function docState(id: string): Promise<docSub> {
    const ref = doc(setsCollection, id);

    let [docSub, setDoc] = changeNotifier<docState | null>(null);

    const [register, isOurs] = preventReturn<docDoc>((ours, newVal) => ours.name === newVal.name && ours.contents === newVal.contents);

    const toDocPartial = (state: Partial<docState>): Partial<docDoc> => {
        let obj: any = {};
        if (state.name) obj.name = state.name;
        if (state.terms) obj.contents = state.terms.map(encodeTerm);
        if (state.uid) obj.user = state.uid;
        return obj;
    }

    const toDoc = (state: docState): docDoc => ({
        name: state.name,
        contents: state.terms.map(encodeTerm),
        user: state.uid,
    });

    const updateSet = async (newVal: Partial<docState>, oldVal: docState, notify: boolean) => {
        if (!notify) // prevent the return of the packet if we dont want a notification
            register({
                ...toDoc(oldVal),
                ...toDocPartial(newVal),
            });
        await updateDoc(ref, toDocPartial(newVal));
    };

    onSnapshot(ref, (doc) => {
        if (doc.exists()) {
            const data = doc.data() as docDoc;

            const state: docState = {
                name: data.name,
                terms: data.contents.map((e) => {
                    return decodeTerm(e);
                }).filter((e): e is term => e !== null),
                id: ref.id,
                uid: data.user,
            };
            setDoc(state, !isOurs(data));
        } else {
            setDoc(null, true);
        }
    });
    return {
        ...await nullableStoreToPromise(docSub, true),
        async set(newVal: Partial<docState>, notify = true) {
            const oldVal = get(docSub)!;
            await updateSet(newVal, oldVal, notify);
        }
    };
}