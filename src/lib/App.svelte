<script lang="ts">
	import Feedback from './feedback/Feedback.svelte';
	import type { setStore } from '$lib/data/setStore';
	import AuthManager from './auth/AuthManager.svelte';
	import Create from './createset/Create.svelte';
	import Nav from './nav/Nav.svelte';
	import { browser } from '$app/environment';

	export let store: setStore;
</script>

<div style="overflow-y: hidden; height: fit-content; min-height: 100vh;">
	{#if browser}
			<Create state={store} />
	{/if}

	<Nav>
		<AuthManager state={store} />
	</Nav>

	<Feedback />
</div>

<style>
	div {
		overflow-y: hidden;
		overflow-x: hidden;
		width: 100vw;
		padding: 0px;
		padding-block: 2rem;
		padding-bottom: 4rem;
		margin: 0px;
		justify-content: start;
	}
</style>
