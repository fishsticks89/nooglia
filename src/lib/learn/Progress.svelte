<script lang="ts">
	export let amount: number;
	import { spring } from 'svelte/motion';
	const amountspring = spring(0, {
		stiffness: 0.1,
		damping: 1
	});
    $: amountspring.set(amount * 100)
</script>

<div id="progress" style:width={$amountspring + 'vw'} />

<style>
	#progress {
		position: fixed;
		top: 0px;
		left: 0px;
		width: 100vw;
		height: 3px;
		background-color: white;
	}
</style>
