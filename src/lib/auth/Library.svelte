<script lang="ts">
	import { flyin } from '$lib/transitions/flyin';
	import { sets } from '$lib/firebase';
	import {
		getDocs,
		query,
		QueryDocumentSnapshot,
		where,
		type DocumentData
	} from 'firebase/firestore';
	import { get } from 'svelte/store';
	import { authState } from './authState';
	import type { setStore } from '$lib/data/setStore';
	import { createCloudSet, getCloudSet, newset } from '$lib/data/db';
	import {fade} from "svelte/transition"

	export let state: setStore;
	export let close: () => void;

	let docs: QueryDocumentSnapshot<DocumentData>[] = [];
	getDocs(query(sets, where('user', '==', get(authState)?.uid), where('contents', '!=', ''))).then(
		(e) => {
			docs = e.docs;
		}
	);
</script>

<div class="holder" id="create">
	<button
		on:click={() => {
			const uid = $authState?.uid;
			if (uid) {
				const set = {
					user: uid,
					name: '',
					contents: '',
					mode: newset().mode
				};
				createCloudSet(set).then((setref) => {
					state.update(() => {
						return {
							set,
							doc: setref
						};
					});
					close();
				});
			}
		}}
		class="open" in:fade={{duration: 300}} out:fade={{duration: 100}} >New Set</button
	>
	{#each docs as doc}
		<div in:flyin={{ isin: true, additionalTransforms: '' }} out:flyin={{ isin: false, additionalTransforms: '' }} class="setholder">
			{doc.get('name') != '' ? doc.get('name') : 'Untitled'}
			<button
				on:click={() => {
					getCloudSet(doc.ref).then((set) => {
						state.update(() => {
							return {
								set,
								doc: doc.ref
							};
						});
						close();
					});
				}}
				class="open">Open</button
			>
		</div>
	{/each}
</div>

<style>
	#create {
		margin-block: 1rem;
	}
	.open {
		width: fit-content;
		height: fit-content;
		padding: 1rem;
		padding-inline: 1.5rem;

		color: var(--accent);
		font-weight: bold;
		border-width: 0px;
		border-radius: var(--round);

		background-color: var(--light);
	}
	.holder {
		margin: 0px;
		margin-left: 50vw;
		width: 80vw;
		max-width: 30rem;
		transform: translateX(-50%);
	}
	.setholder {
		color: white;
		z-index: 8;
		font-family: 'Montserrat', sans-serif;
		margin: 0px;
		margin-block: 1rem;
		padding: 2rem;
		width: 100%;

		border: 1px solid white;
		border-width: 1px;
		border-color: white;

		background-color: var(--accent);
		border-radius: var(--round);

		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-content: flex-end;
	}
</style>
