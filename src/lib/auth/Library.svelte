<script lang="ts">
	import CSRprovider from './../util/CSRprovider.svelte';
	import { createSet } from '$lib/createset/createSet';
	import { flyin } from '$lib/transitions/flyin';
	import { sets } from '$lib/firebase';
	import {
	DocumentSnapshot,
		getDocs,
		query,
		QueryDocumentSnapshot,
		where,
		type DocumentData
	} from 'firebase/firestore';
	import { get } from 'svelte/store';
	import { authState } from './authState';
	import { fade } from 'svelte/transition';

	let docs: QueryDocumentSnapshot<DocumentData>[] = [];

	const getStringArr = (doc: DocumentSnapshot<DocumentData>, property: string) => {
		return doc.get(property) as string[];
	};

	getDocs(query(sets, where('user', '==', get(authState)?.uid), where('contents', '!=', ''))).then(
		(e) => {
			docs = e.docs;
		}
	);
	let href: string;
</script>

<CSRprovider link={href} />

<div class="holder" id="create">
	<button
		on:click={() => {
			const uid = $authState?.uid;
			if (uid) {
				createSet(uid, (url) => {
					href = url;
				});
			}
		}}
		class="open"
		in:fade={{ duration: 300 }}
		out:fade={{ duration: 100 }}>New Set</button
	>
	{#each docs as doc}
		{#if getStringArr(doc, 'contents').join('').split(/[ \n]/).join('') != ''}
			<a
				in:flyin={{ isin: true, additionalTransforms: '' }}
				out:flyin={{ isin: false, additionalTransforms: '' }}
				class="setholder"
				href={'/set/' + doc.id}
			>
				<p style:margin-top="0px">{doc.get('name') != '' ? doc.get('name') : 'Untitled'}</p>
				<button class="open">Open</button>
			</a>
		{/if}
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
		text-decoration: none;
		margin: 0px;
		margin-block: 1rem;
		padding: 10%;
		width: 80%;

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
