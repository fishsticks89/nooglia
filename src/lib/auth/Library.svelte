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
	import { createCloudSet, newset } from '$lib/data/db';
	import { fade } from 'svelte/transition';
	import { prefetch } from '$app/navigation';

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
					contents: newset().contents
				};
				createCloudSet(set).then((setref) => {
					window.location.replace('/set/' + setref.id);
				});
			}
		}}
		class="open"
		in:fade={{ duration: 300 }}
		out:fade={{ duration: 100 }}>New Set</button
	>
	{#each docs as doc}
		<button
			in:flyin={{ isin: true, additionalTransforms: '' }}
			out:flyin={{ isin: false, additionalTransforms: '' }}
			class="setholder"
			on:mouseover={() => {
				prefetch('/set/' + doc.id);
			}}
			on:focus
			on:click={() => {
				window.location.replace('/set/' + doc.id);
			}}
		>
			<p style:margin-top="0px">{doc.get('name') != '' ? doc.get('name') : 'Untitled'}</p>
			<button class="open">Open</button>
		</button>
	{/each}
</div>

<style>
	.open {
		width: fit-content;
		height: fit-content;
		padding: 1rem;
		padding-inline: 1.5rem;

		color: var(--light);
		font-weight: bold;
		border-width: 0px;
		border-radius: var(--round);

		background-color: var(--glass);
	}
	.holder {
		margin: 0px;
		margin-block: 0px;
		padding-inline: 10%;
		padding-top: 1rem;
		padding-bottom: 5rem;
		width: 80%;
		height: calc(100% - 5rem);

		overflow-x: hidden;
		overflow-y: auto;
		position: fixed;
		top: 0rem;
		left: 0rem;

		display: flex;
		align-items: center;
		flex-direction: column;
	}
	.setholder {
		color: white;
		z-index: 8;
		font-family: 'Montserrat', sans-serif;
		margin: 0px;
		margin-block: 1rem;
		padding: 10%;
		width: 100%;

		border: 1px solid white;
		border-width: 1px;
		border-color: var(--background);

		background-color: var(--emp);
		border-radius: var(--round);

		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-content: flex-end;

		text-align: left;
	}
</style>
