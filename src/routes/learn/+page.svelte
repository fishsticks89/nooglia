<script context="module">
</script>

<script lang="ts">
    import AuthButton from "$lib/AuthButton.svelte";
    import LearnPage from "$lib/LearnPage.svelte";
    import { auth, sets, users } from "$lib/firebase";
    import {
        GoogleAuthProvider,
        getRedirectResult,
        onAuthStateChanged,
    } from "firebase/auth";
    import { authState } from "$lib/state";
    import AuthManager from "$lib/AuthManager.svelte";
    import { get, writable, type Writable } from "svelte/store";
    import {
        createCloudSet,
        getUserDoc,
        setEquals,
        newset,
        type set,
    } from "$lib/db";
    import { getLocalSet, storeLocalSet } from "$lib/storeset";
    import {
        doc,
        DocumentSnapshot,
        getDoc,
        onSnapshot,
        setDoc,
        updateDoc,
        type DocumentData,
        type DocumentReference,
    } from "firebase/firestore";
    import { browser } from "$app/env";
    import type { setStore } from "$lib/setStore";
    import { createDebounce } from "$lib/debounce";

    onAuthStateChanged(auth, (newuser) => {
        authState.set(newuser);
    });

    getRedirectResult(auth)
        .then((result) => {
            // The signed-in user info.
            if (result != null) authState.set(result.user);
        })
        .catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });

    let currentset: setStore = writable({ doc: null, set: getLocalSet() });
    authState.subscribe((user) => {
        if (user) {
            if (!setEquals(getLocalSet(), newset())) {
                console.log(getLocalSet());
                const storedSet = getLocalSet();
                createCloudSet(
                    user,
                    storedSet.name,
                    storedSet.contents,
                    storedSet.mode
                ).then((e) => {
                    currentset.set({
                        doc: e,
                        set: {
                            user: user.uid,
                            name: storedSet.name,
                            contents: storedSet.contents,
                            mode: storedSet.mode,
                        },
                    });
                    storeLocalSet(newset());
                });
            } else {
                getUserDoc().then(async (e) => {
                    let lastediteddoc: null | DocumentSnapshot<DocumentData> =
                        null;
                    if (
                        e.get("lastedited") &&
                        (await (async function checkLastedited() {
                            lastediteddoc = await getDoc(e.get("lastedited"));
                            return lastediteddoc.exists();
                        })())
                    ) {
                        console.log("asdf");
                        currentset.set({
                            doc: e.get("lastedited"),
                            set: {
                                user: user.uid,
                                name: (
                                    lastediteddoc as any as DocumentSnapshot<DocumentData>
                                ).get("name"),
                                contents: (
                                    lastediteddoc as any as DocumentSnapshot<DocumentData>
                                ).get("contents"),
                                mode: (
                                    lastediteddoc as any as DocumentSnapshot<DocumentData>
                                ).get("mode"),
                            },
                        });
                    } else {
                        createCloudSet(user, "", "", "Comma").then((e) => {
                            currentset.set({
                                doc: e,
                                set: {
                                    user: user.uid,
                                    name: "",
                                    contents: "",
                                    mode: "Comma",
                                },
                            });
                        });
                    }
                });
            }
        } else {
            currentset.set({doc: null, set: getLocalSet()})
        }
    });
    let unsubscribe: (() => void) | null = null;
    const debo = createDebounce(2000);
    currentset.subscribe((unset) => {
        if (unsubscribe) unsubscribe();
        unsubscribe == null;
        if (!unset.doc) {
            if (browser) storeLocalSet(unset.set);
        } else {
            debo(() => {
                setDoc(unset.doc as DocumentReference<DocumentData>, unset.set);
                getUserDoc().then((e) => {
                    updateDoc(e.ref, { lastedited: unset.doc });
                });
                console.log(unset.set);
            });
        }
    });
</script>

<AuthManager />
<LearnPage store={currentset} />
