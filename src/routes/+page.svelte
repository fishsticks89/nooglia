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
	import { onDestroy } from 'svelte';

	let docs: QueryDocumentSnapshot<DocumentData>[] = [];

	const getStringArr = (doc: DocumentSnapshot<DocumentData>, property: string) => {
		return doc.get(property) as string[];
	};

	authState.subscribe((e) => console.log(e));

	let href: null | string = null;

	if (browser) {
		setTimeout(() => {
			document.body.style.backgroundImage = "url(\"/bkg.svg\")"
			document.body.style.backgroundSize = "auto 180vh";
			document.body.style.backgroundPosition = "center"
		})
		onDestroy(() => {
			document.body.style.backgroundImage = ""
			document.body.style.backgroundSize = ""
			document.body.style.backgroundPosition = ""
		})
	}
</script>

<CSRprovider link={href} />

{#if $authState === null && !expectingSignIn && !auth.currentUser && browser}
	<h2>
		<p class="punchline">Make Study Guides Faster.</p>
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
			class="newset">New Set</button
		>
		{#each docs as doc}
			{#if getStringArr(doc, 'contents').join('').split(/[ \n]/).join('') != ''}
				<a class="setholder" data-sveltekit:prefetch href={'/set/' + doc.id}>
					<p style:margin-top="0px">{doc.get('name') != '' ? doc.get('name') : 'Untitled'}</p>
					<button class="open">Open</button>
				</a>
			{/if}
		{/each}
	</div>
{/if}

<Nav>
	<!-- <AuthManager /> -->
</Nav>

<style>
	.newset {
		margin-block: 1rem;
		padding: 0.7rem;
		padding-inline: 1.2rem;
		color: white;
		background: linear-gradient(to bottom right, #4d88ff, #6196ff);
		filter: drop-shadow(0.1rem 0.1rem 0.3rem #6699ff);

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
		top: 0.4rem;
		color: gray;
		background-color: white;

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
		height: 11rem;
		margin-bottom: -6rem;

		transform: translateY(-5%) perspective(900px) rotateX(-30deg);

		color: grey;
		text-decoration: none;

		border: 2px solid rgba(255, 255, 255, 0.641);
		border-radius: var(--round);
		background: linear-gradient(rgba(249, 249, 249, 0.375), rgba(255, 255, 255, 0.375));
		backdrop-filter: blur(5px) saturate(170%);

		transition-property: transform, margin-bottom;
		transition-timing-function: cubic-bezier();
		transition-duration: 0.3s;

		font-family: "GilroyBold";
	}
	.setholder:hover {
		margin-bottom: -4rem;

		transform: translateY(-20%) perspective(900px) scale(105%) rotateX(-10deg);
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
	.startbutt {
		border-radius: var(--round);
		border: 0px;
		color: white;
		background: linear-gradient(to bottom right, #4d88ff, #6196ff);
		filter: drop-shadow(0.1rem 0.1rem 0.3rem #6699ff);
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
	.bkg {
		position: fixed;
		left: 45vw;
		top: 50vh;
		transform: translate(-50%, -50%);
		height: 180vh;
	}
</style>
