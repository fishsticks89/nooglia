<script lang="ts">
	import { browser } from '$app/environment';
	import type { setStore } from '$lib/data/setStore';

	import { get } from 'svelte/store';

	export let state: setStore;
	let txf: string;
	txf = get(state).set.name;
	state.subscribe((e) => {
		txf = e.set.name;
	});
	function oninput(_: any) {
		state.update((e) => {
			e.set.name = txf ? txf : '';
			return e;
		});
	}
	$: oninput(txf);
</script>

<input bind:value={txf} type="text" placeholder={browser ? 'Name Your Set' : ''} />

<style>
	input::placeholder {
		font-family: 'Gilroy', sans-serif;
		color: var(--light);
		opacity: 100%;
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
		padding-bottom: 5px;

		font-size: calc(4vw + 1rem);
		font-family: 'Gilroy', sans-serif;
	}
	input:focus-visible {
		outline: none;
		border-bottom: 4px solid var(--comp);
	}
</style>
