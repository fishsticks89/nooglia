<script context="module">
	export async function load() {
		return {
			status: 302,
			redirect: '/'
		};
	}
</script>

<script lang="ts">
	import { browser } from '$app/environment';

	if (browser) window.location.replace('/');
</script>

<div />

<style>
</style>
