<script context="module">
	export const prerender = true;
</script>

<script lang="ts">
	import { browser, dev } from '$app/environment';
	import { analytics } from '$lib/firebase';
	import mixpanel from 'mixpanel-browser';
	if (browser && !dev) {
		mixpanel.init('7309a913f64760d4b084f0a0922b3d75', { debug: !browser });
		analytics;
	}
</script>

<slot />

<style>
</style>
