<script context="module">
	export const prerender = true;
	import { inject } from '@vercel/analytics';

	// Make sure to call this only once in your app
	inject();
</script>

<script lang="ts">
</script>

<slot />

<style>
</style>
