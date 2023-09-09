<script lang="ts">
	import { onDestroy, onMount } from "svelte";

	export let enter: () => (() => void) | void = () => {
		return () => {};
	};
	let state: (() => void) | null = null;
	onMount(() => {
		let s = enter();
		if (s) state = s;
	});
	onDestroy(() => {
		if (state) state();
	});
</script>
