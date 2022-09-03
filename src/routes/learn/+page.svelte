<script context="module">
</script>

<script lang="ts">
    import { browser } from "$app/env";
    import { writable } from "svelte/store";
    import {
        GoogleAuthProvider,
        getRedirectResult,
        onAuthStateChanged,
    } from "firebase/auth";
    import {
        DocumentSnapshot,
        getDoc,
        setDoc,
        updateDoc,
        type DocumentData,
        type DocumentReference,
    } from "firebase/firestore";
    import App from "$lib/App.svelte";
    import { authState } from "$lib/auth/authState";
    import AuthManager from "$lib/auth/AuthManager.svelte";
    import {
        createCloudSet,
        getUserDoc,
        setEquals,
        newset,
    } from "$lib/data/db";
    import { auth } from "$lib/firebase";
    import { getLocalSet, storeLocalSet } from "$lib/data/storeset";
    import type { setStore } from "$lib/data/setStore";
    import { createDebounce } from "$lib/util/debounce";

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
<App store={currentset} />