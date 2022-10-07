<script context="module">
	export const prerender = true;
</script>

<script lang="ts">
	import { browser, dev } from '$app/environment';
	import { analytics } from '$lib/firebase';
	import mixpanel from 'mixpanel-browser';
	let falser = false;
	if (browser) {
		mixpanel.init('7309a913f64760d4b084f0a0922b3d75', { debug: !browser });
		if (!dev) analytics;
		falser = true;
	}
</script>

{#if falser || !browser}
	<slot />
{/if}

<style>
</style>
