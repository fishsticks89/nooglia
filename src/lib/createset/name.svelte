<script lang="ts">
	import { browser } from '$app/environment';
    import type { docSub } from '$lib/core/doc';

	import { get } from 'svelte/store';

	export let state: docSub;
	let txf: string;
	txf = get(state).name;
	state.subscribe((e) => {
		txf = e.name;
	});
	function oninput(_: any) {
		state.set({ name: txf }, false);
	}
	$: oninput(txf);
</script>

<input bind:value={txf} type="text" data-hj-allow placeholder={browser ? 'Name Your Set' : ''} />

<style>
	input::placeholder {
		font-family: 'PoppinsSemi', sans-serif;
		color: var(--light);
		opacity: 100%;
	}
	@media only screen and (max-width: 600px) {
	input::placeholder {
		font-family: 'PoppinsSemi', sans-serif;
	}
}
	input {
		width: 100%;
		margin: 0px;
		margin-bottom: 1rem;
		border-radius: 0px;
		border-top: 0px;
		border-left: 0px;
		border-right: 0px;
		border-bottom: 2px solid var(--emp);
		border-color: var(--emp);
		background-color: transparent;

		padding: 0px;
		padding-bottom: 0.2vw;

		font-size: calc(4vw + 1rem);
		font-family: 'PoppinsSemi', sans-serif;
	}
	input:focus-visible {
		outline: none;
		border-bottom: 3px solid var(--light);
	}
</style>
