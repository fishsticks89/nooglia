<script lang="ts">
	import Runner from './../../lib/util/Runner.svelte';
	import { flyin } from '$lib/transitions/flyin';
	import AuthManager from './../../lib/auth/AuthManager.svelte';
	import Nav from '$lib/nav/Nav.svelte';
	import { authState, expectingSignIn } from '$lib/auth/authState';
	import { GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';
	import { auth, sets } from '$lib/firebase';
	import { browser } from '$app/environment';
	import {
		getDocs,
		query,
		QueryDocumentSnapshot,
		where,
		type DocumentData
	} from 'firebase/firestore';
	import { get } from 'svelte/store';
	import { createCloudSet, newset } from '$lib/data/db';
	import { fade } from 'svelte/transition';
	import { prefetch } from '$app/navigation';

	let docs: QueryDocumentSnapshot<DocumentData>[] = [];
</script>

<Nav>
	<AuthManager />
</Nav>

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

{#if $authState != null}
	<Runner
		enter={() => {
			getDocs(
				query(sets, where('user', '==', get(authState)?.uid), where('contents', '!=', ''))
			).then((e) => {
				docs = e.docs;
			});
		}}
	/>
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
			class="newset"
			in:fade={{ duration: 300 }}
			out:fade={{ duration: 100 }}>New Set</button
		>
		{#each docs as doc}
			<div
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
			</div>
		{/each}
	</div>
{/if}

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
		font-size: calc(3vw + 2.5rem);
		top: 50vh;
		left: 15vw;
		padding: 0px;
		transform: translateY(-50%);
		width: fit-content;
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
