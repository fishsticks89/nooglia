<script lang="ts">
	import { fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
</script>

<button
	on:click><slot>Button</slot></button
>

<style>
	button {
		border: 0px;

		position: absolute;
		top: 1rem;
		right: 1rem;

		border-radius: 100vmax;
		background-color: rgba(255, 255, 255, 0.2);
		backdrop-filter: saturate(100%);
		margin: 0px;
		padding: 1rem;
		width: fit-content;
		height: fit-content;
		z-index: 2;

		display: flex;
		justify-content: center;
		align-items: center;
	}
	button:focus-visible {
		outline: 0px;
	}
</style>
