<script lang="ts">
	import { browser } from '$app/environment';
	import type { term } from '$lib/data/db';
	import Importterms from './../../lib/createset/importterms.svelte';
	let addTerms: (terms: term[]) => {};
</script>

{#if browser}
	<Importterms importpop={true} {addTerms} />
{/if}

<style>
</style>
