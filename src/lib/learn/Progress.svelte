<script lang="ts">
	import { squish } from '$lib/transitions/squish';
	export let amount: number;
	import { spring } from 'svelte/motion';
	const amountspring = spring(0, {
		stiffness: 0.1,
		damping: 1
	});
    $: amountspring.set(amount * 100)
</script>

<div id="progress" style:width={$amountspring + '%'} out:squish={{isin: false, initialheight: "3px"}} />

<style>
	#progress {
		position: absolute;
		top: -13px;
		left: 0px;
		width: 100%;
		height: 3px;
		background-color: white;
	}
</style>
