<script lang="ts">
	import { signInWithPopup } from "firebase/auth";
	import CSRprovider from "$lib/util/CSRprovider.svelte";
	import { authState, expectingSignIn } from "$lib/auth/authState";
	import { GoogleAuthProvider } from "firebase/auth";
	import { auth } from "$lib/firebase";
	import { browser } from "$app/environment";
	import type { DocumentSnapshot, DocumentData } from "firebase/firestore";
	import Nav from "$lib/nav/Nav.svelte";
	import AuthManager from "$lib/auth/AuthManager.svelte";
    import DocsList from "$lib/ui/DocsList.svelte";


	authState.subscribe((e) => console.log(e));

	let href: null | string = null;
	let width = 0;
</script>

{#if $authState === null && !expectingSignIn && !auth.currentUser && browser}
	<h2>
		<p class="punchline">Flashcards, Quizzes</p>
		<p class="punchline1">
			and more <img
				src="./icons/rocket.png"
				alt="rocket"
				style:height={50 + "px"}
			/>
		</p>
		<button
			class="startbutt"
			on:click={() => {
				signInWithPopup(auth, new GoogleAuthProvider());
			}}>Start Studying</button
		>
	</h2>
{/if}

<svelte:window bind:innerWidth={width} />

{#if $authState != null}
	<DocsList />
{/if}

<Nav>
	{#if $authState != null}
		<AuthManager />
	{/if}
</Nav>

<style>
	h2 {
		position: fixed;
		font-family: "GilroyBold", sans-serif;
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
		font-family: "GilroyBold", sans-serif;
		/* font-weight: bold; */
		/* letter-spacing: 0.2vw; */
		text-decoration: none;
	}
</style>
