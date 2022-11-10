<script context="module">
	export async function load() {
		return {
			status: 302,
			redirect: '/'
		};
	}
</script>

<script lang="ts">
	import { browser, dev } from '$app/environment';
	import type { term } from '$lib/data/db';
	import Importterms from './../../lib/createset/importterms.svelte';
	let addTerms: (terms: term[]) => {};

	if (!dev && browser) {
		window.location.replace('/');
	}
</script>

{#if browser}
	<Importterms importpop={true} {addTerms} />
{/if}

<style>
</style>
