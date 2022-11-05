<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	export let enter: () => any = () => {};
	export let leave: (state: any) => void = () => {};
	let state: any;
	onMount(() => {
		state = enter();
	});
	onDestroy(() => {
		leave(state);
	});
</script>
