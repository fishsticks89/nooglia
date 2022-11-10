<script lang="ts">
	import CSRprovider from '$lib/util/CSRprovider.svelte';
	import { flyin } from '$lib/transitions/flyin';
	import { authState, expectingSignIn } from '$lib/auth/authState';
	import { GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';
	import { auth, sets } from '$lib/firebase';
	import { browser } from '$app/environment';
	import {
		DocumentSnapshot,
		getDocs,
		query,
		QueryDocumentSnapshot,
		where,
		type DocumentData
	} from 'firebase/firestore';
	import { get } from 'svelte/store';
	import { fade } from 'svelte/transition';
	import Nav from '$lib/nav/Nav.svelte';
	import AuthManager from '$lib/auth/AuthManager.svelte';
	import Runner from '$lib/util/Runner.svelte';
	import { createSet } from '$lib/createset/createSet';

	let docs: QueryDocumentSnapshot<DocumentData>[] = [];

	const getStringArr = (doc: DocumentSnapshot<DocumentData>, property: string) => {
		return doc.get(property) as string[];
	};

	authState.subscribe((e) => console.log(e));

	let href: null | string = null;
	let width = 0;
</script>

<CSRprovider link={href} />

{#if $authState === null && !expectingSignIn && !auth.currentUser && browser}
	<h2>
		<p class="punchline">Flashcards, Quizzes</p>
		<p class="punchline1">
			and more <img src="./icons/rocket.png" alt="rocket" style:height={50 + 'px'} />
		</p>
		<button
			class="startbutt"
			on:click={() => {
				signInWithRedirect(auth, new GoogleAuthProvider());
			}}>Start Studying</button
		>
	</h2>
{/if}

<svelte:window bind:innerWidth={width} />

{#if $authState != null}
	<Runner
		enter={() => {
			getDocs(
				query(sets, where('user', '==', get(authState)?.uid), where('contents', '!=', ''))
			).then((e) => {
				if (e.docs.length === 0) {
					const uid = $authState?.uid;
					if (uid)
						createSet(uid, (setref) => {
							href = setref;
						});
				}
				docs = e.docs;
			});
		}}
	/>
	<div class="holder" id="create">
		<button
			on:click={() => {
				const uid = $authState?.uid;
				if (uid)
					createSet(uid, (setref) => {
						href = setref;
					});
			}}
			class="newset"
			in:fade={{ duration: 300 }}>New Set</button
		>
		{#each docs as doc}
			{#if getStringArr(doc, 'contents').join('').split(/[ \n]/).join('') != ''}
				<a
					in:flyin={{ isin: true, additionalTransforms: '' }}
					class="setholder"
					data-sveltekit:prefetch
					on:focus
					href={'/set/' + doc.id}
				>
					<p style:margin-top="0px">{doc.get('name') != '' ? doc.get('name') : 'Untitled'}</p>
					<button class="open">Open</button>
				</a>
			{/if}
		{/each}
	</div>
{/if}

<Nav>
	{#if $authState != null || width > 500}
		<AuthManager />
	{/if}
</Nav>

<style>
	.newset {
		margin-block: 1rem;
		padding: 0.7rem;
		padding-inline: 1.2rem;
		background-color: var(--glass);

		border: 0px solid transparent;
		border-radius: var(--round);

		font-family: 'GilroyBold', sans-serif;
	}
	.open {
		display: inline;
		position: absolute;
		right: 0.4rem;
		padding: 0.7rem;
		padding-inline: 1.2rem;
		top: 50%;
		translate: 0px -50%;
		background-color: var(--glass);

		border: 0px solid transparent;
		border-radius: var(--round);

		font-family: 'GilroyBold', sans-serif;
	}
	.setholder {
		position: relative;
		text-align: left;
		display: block;
		width: calc(100% - 1.4rem);
		padding: 0.7rem;
		margin-bottom: 1rem;

		color: white;
		text-decoration: none;

		border-radius: var(--round);
		background-color: var(--emp);
	}
	.holder {
		width: calc(70vw + 8vh);
		max-width: 50rem;
		height: fit-content;
		margin: 0px;
		margin-left: 50vw;
		transform: translateX(-50%);
		padding-top: 4rem;

		overflow: visible;
	}
	h2 {
		position: fixed;
		font-family: 'GilroyBold', sans-serif;
		font-size: calc(4vw + 2rem);
		top: 50vh;
		left: calc(17vw - 1rem);
		padding: 0px;
		transform: translateY(-50%);
		width: 70vw;
		max-width: calc(70vw + 8vh);
		text-align: left;
		margin: 0px;
	}
	.punchline {
		margin: 0rem;
	}
	.punchline1 {
		margin: 0rem;
	}
	.startbutt {
		background-color: var(--accent);
		border-radius: var(--round);
		border: 0px;
		color: white;
		margin: 0px;
		padding: calc(0.6rem + 0.6vw);
		padding-inline: calc(1.4rem + 1.4vw);

		font-size: calc(0.7rem + 0.5vw);
		font-weight: 500;
		font-family: 'GilroyBold', sans-serif;
		/* font-weight: bold; */
		/* letter-spacing: 0.2vw; */
		text-decoration: none;
	}
</style>
