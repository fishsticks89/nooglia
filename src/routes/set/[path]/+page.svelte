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
</script>

{#if $currentset != null}
	<App store={toSetStore(currentset)} />
{/if}

<style>
</style>
