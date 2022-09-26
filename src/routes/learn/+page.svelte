<script context="module">
</script>

<script lang="ts">
	import { browser } from '$app/environment';
	import { writable } from 'svelte/store';
	import { GoogleAuthProvider, getRedirectResult, onAuthStateChanged } from 'firebase/auth';
	import {
		DocumentSnapshot,
		getDoc,
		setDoc,
		updateDoc,
		type DocumentData,
		type DocumentReference
	} from 'firebase/firestore';
	import App from '$lib/App.svelte';
	import { authState } from '$lib/auth/authState';
	import {
		createCloudSet,
		getUserDoc,
		setEquals,
		newset,
		getCloudSet,
		setCurrentSet
	} from '$lib/data/db';
	import { auth } from '$lib/firebase';
	import { getLocalSet, storeLocalSet } from '$lib/data/storeset';
	import type { setStore } from '$lib/data/setStore';
	import { createDebounce } from '$lib/util/debounce';

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

	const ls = getLocalSet();
	let currentset: setStore = writable({ doc: null, set: ls.set, isEditing: ls.isNew });
	authState.subscribe((user) => {
		if (user) {
			if (!setEquals(getLocalSet().set, newset())) {
				const storedSet = getLocalSet().set;
				createCloudSet({
					user: user.uid,
					name: storedSet.name,
					contents: storedSet.contents,
					mode: storedSet.mode
				}).then((e) => {
					setCurrentSet(e, currentset);
					storeLocalSet(newset());
				});
			} else {
				getUserDoc().then(async (e) => {
					let lastediteddoc: null | DocumentSnapshot<DocumentData> = null;
					if (
						e.get('lastedited') &&
						(await (async function checkLastedited() {
							lastediteddoc = await getDoc(e.get('lastedited'));
							return lastediteddoc.exists();
						})())
					) {
						currentset.set({
							doc: e.get('lastedited'),
							set: {
								user: user.uid,
								name: (lastediteddoc as any as DocumentSnapshot<DocumentData>).get('name'),
								contents: (lastediteddoc as any as DocumentSnapshot<DocumentData>).get('contents'),
								mode: (lastediteddoc as any as DocumentSnapshot<DocumentData>).get('mode')
							},
							isEditing: false
						});
					} else {
						const set = newset(user.uid);
						createCloudSet(set).then((e) => {
							setCurrentSet(e, currentset);
						});
					}
				});
			}
		} else {
			const ls = getLocalSet();
			currentset.set({ doc: null, set: ls.set, isEditing: ls.isNew });
		}
	});
	const debo = createDebounce(900);
	currentset.subscribe((unset) => {
		if (
			!unset.isEditing &&
			(unset.set.name === '' ||
				unset.set.contents.length < 4 ||
				unset.set.contents
					.join('')
					.split(/[\n ]+/)
					.join('').length <= 1)
		) {
			currentset.update((e) => {
				e.isEditing = true;
				return e;
			});
		}
		if (!unset.doc) {
			if (browser) storeLocalSet(unset.set);
		} else {
			if (unset.set) {
				debo(() => {
					setDoc(unset.doc as DocumentReference<DocumentData>, unset.set);
				});
			} else {
			}
		}
	});
</script>

<App store={currentset} />
