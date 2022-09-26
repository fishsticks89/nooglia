<script lang="ts">
	import { spring } from 'svelte/motion';

	export let selected = false;
	export let text = '';

	let spr = spring(selected ? 1 : 0, {
		stiffness: 0.12,
		damping: 0.25,
        precision: 0.05
	});

    let spr2 = spring(selected ? 1 : 0, {
		stiffness: 0.35,
		damping: 1,
        precision: 0.05
	});

    $: spr.set(selected ? 1 : 0)
    $: spr2.set(selected ? 1 : 0)
</script>

<div class="holder">
	<div
		class="selector"
        style:outline-offset={$spr * 4 - 2 + "px"}
		on:click
	>
    <div
    style={`
    background-color: var(--accent);
    width: ${$spr2 * 100}%;
    height: ${$spr2 * 100}%;
    border-radius: inherit;
    `}
    />
</div>
	<slot><p>{text}</p></slot>
</div>

<style>
	.selector {
		width: 1rem;
		height: 1rem;

		margin: 0.7rem;

		outline: 2px solid var(--accent);
		outline-offset: 2px;
		border-radius: var(--round);

        background-color: transparent;

        display: flex;
        justify-content: center;
        align-items: center;
	}
	.holder {
		margin-left: 1rem;
		width: fit-content;
		height: 3rem;
		background-color: transparent;

		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
</style>
