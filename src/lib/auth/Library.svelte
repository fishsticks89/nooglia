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
	import { getCloudSet } from '$lib/data/db';

	export let state: setStore;
	export let close: () => void;

	let docs: QueryDocumentSnapshot<DocumentData>[] = [];
	getDocs(query(sets, where('user', '==', get(authState)?.uid))).then((e) => {
		docs = e.docs;
	});
</script>

{#each docs as doc}
	<div in:flyin={{ isin: true, additionalTransforms: 'translateX(-50%)' }} class="setholder">
		{doc.get('name')}
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

<style>
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
	.setholder {
		color: white;
		z-index: 8;
		font-family: 'Montserrat', sans-serif;
		margin: 1rem;
		margin-left: 50vw;
		transform: translateX(-50%);
		width: 80vw;
		max-width: 30rem;
		padding: 2rem;

		border: 1px solid white;
		border-width: 1px;
		border-color: white;

		background-color: var(--accent);
		border-radius: var(--round);

		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
</style>
