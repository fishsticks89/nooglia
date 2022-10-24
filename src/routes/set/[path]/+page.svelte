<script lang="ts">
	export let data: any;
	import { writable } from 'svelte/store';
	import { GoogleAuthProvider, getRedirectResult, onAuthStateChanged } from 'firebase/auth';
	import { doc, setDoc, type DocumentData, type DocumentReference } from 'firebase/firestore';
	import App from '$lib/App.svelte';
	import { authState } from '$lib/auth/authState';
	import { getCloudSet, getUserDoc } from '$lib/data/db';
	import { auth, sets } from '$lib/firebase';
	import { toSetStore, type setStoreOrNull } from '$lib/data/setStore';
	import { createDebounce } from '$lib/util/debounce';
	import { browser } from '$app/environment';

	let currentset: setStoreOrNull = writable(null);

	if (browser) {
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

		authState.subscribe(async (user) => {
			console.log(data);
			let doci = await getCloudSet(doc(sets, data.id));
			console.log(data.id, doci);
			if (doci)
				currentset.set({
					doc: doc(sets, data.id),
					set: {
						user: doci.user,
						name: doci.name,
						contents: doci.contents
					},
					isEditing: false,
					isEditable: user !== null && user.uid === doci.user
				});
			else window.location.replace('/404');
			console.log($currentset);
		});
		const debo = createDebounce(500);
		currentset.subscribe((unset) => {
			if (unset) {
				if (
					$authState !== null &&
					unset.set.user === $authState?.uid &&
					!unset.isEditing &&
					(unset.set.name.split(/[\t \n]+/).join('') === '' ||
						unset.set.contents.length < 4 ||
						unset.set.contents
							.join('')
							.split(/[\n ]+/)
							.join('').length <= 1)
				) {
					currentset.update((e) => {
						if (e) e.isEditing = true;
						return e;
					});
				}
				if (unset.set && unset.isEditable) {
					debo(() => {
						setDoc(unset.doc as DocumentReference<DocumentData>, unset.set);
					});
				}
			}
		});
	}
</script>

{#if $currentset != null}
	<App store={toSetStore(currentset)} />
{/if}

<style>
</style>
