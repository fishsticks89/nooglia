<script lang="ts">
	import { browser } from '$app/environment';
	import { prefetch } from '$app/navigation';
	import { getRedirectResult, onAuthStateChanged } from 'firebase/auth';
	import { auth } from '$lib/firebase';
	import Nav from '$lib/nav/Nav.svelte';

	if (browser) prefetch('./learn');

	onAuthStateChanged(auth, (newuser) => {
		if (newuser) window.location.replace('./learn');
	});

	getRedirectResult(auth)
		.then((result) => {
			if (result) window.location.replace('./learn');
		})
		.catch((error) => {
			// ...
		});
</script>

<Nav>
	<button
		class="topbutton"
		on:click={() => {
			window.location.replace('./learn');
		}}><p class="gs">Get Started</p></button
	></Nav
>
<h2>
	<p class="punchline">study effectively</p>
	<p class="punchline1">in minutes <img src="./icons/rocket.png" alt="rocket" style:height={50 + 'px'} /></p>
	<button
		on:click={() => {
			window.location.replace('./learn');
		}}>Start Studying</button
	>
</h2>

<!-- <img
    on:click={() => {
        window.location.replace("https://github.com/fishsticks89/openlearn");
    }}
    style={"cursor: pointer;border-radius: 50%;filter: invert();position: fixed;right: 1rem;top: 1rem;width: 2rem;height: 2rem;"}
    src="./ghlogo.png"
    alt=""
    srcset=""
/> -->
<style>
	h2 {
		position: fixed;
		font-family: 'GilroyBold', sans-serif;
		font-size: calc(3vw + 2.5rem);
		top: 50vh;
		transform: translateY(-50%);
		left: 15vw;
		padding: 0px;
		width: 70vw;
		text-align: left;
		margin: 0px;
	}
	.punchline {
		margin: 0rem;
	}
	.punchline1 {
		margin: 0rem;
	}
	.gs {
		margin: 0px;
	}
	.topbutton {
		background-color: var(--emp);
		padding: 0.6rem;
		padding-inline: 1.4rem;
		background-color: var(--light);
		color: var(--emp);
		font-size: 0.9rem;
	}
	button {
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
	}
</style>
