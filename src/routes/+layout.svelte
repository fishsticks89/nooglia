<script context="module">
	export const prerender = true;
</script>

<script lang="ts">
	import { browser, dev } from '$app/environment';
	import { analytics } from '$lib/firebase';
	let falser = false;
	if (browser) {
		if (!dev) analytics;
		falser = true;
	}
</script>

{#if falser || !browser}
	<slot />
{/if}

<style>
</style>
