<script lang="ts">
	import Selector from '$lib/createset/Selector.svelte';
	import type { term } from '$lib/data/db';
	import splitters from './splitters';
	import Textarea from './textarea.svelte';
	export let addTerms: (terms: term[]) => void;

	export let importpop = false;
	let textarea = {
		get: () => 'bob',
		reset: () => {}
	};

	let selector: {
		reset: () => void;
		getSplitters: () => { termdef: RegExp | string; entries: RegExp | string };
		setTermDefSplitter: (index: number) => void;
	} = {} as any;

	const reset = () => {
		let splitters = [true, false, false];
		selector.reset();
		textarea.reset();
	};
</script>

{#if importpop}
	<div class="bkg">
		<button
			class="cancel"
			on:click={() => {
				importpop = !importpop;
			}}>CANCEL IMPORT</button
		>
		<Selector {selector} />
		<p class="dialogue">
			<strong class="bold">Import your data.</strong> Copy and Paste your data here (from Word, Excel,
			Google Docs, etc.)
		</p>
		<Textarea
			defaultText={'Word 1	Definition 1\nWord 2	Definition 2\nWord 3	Definition 3'}
			funcs={textarea}
			onPaste={(s) => {
				if (s.split('\n').length >= 4 && selector.getSplitters().entries === '\n') {
					const concats = [splitters.comma, splitters.tab];
					let mode = null;
					concats.forEach((split, i) => {
						let lines = s.split('\n').length;
						s.split('\n').forEach((f) => {
							if ((f.match(split) || []).length == 1) lines--;
						});
						if (lines <= 1) mode = i == 0;
					});
					if (mode != null) {
						selector.setTermDefSplitter(mode ? 0 : 1);
					}
				}
			}}
		/>
		<button
			style:background-color={'var(--accent)'}
			class="cancel"
			on:click={() => {
				addTerms(
					textarea
						.get()
						.split(selector.getSplitters().entries)
						.map((e) => {
							return {
								q: e.split(selector.getSplitters().termdef)[0],
								a: e.split(selector.getSplitters().termdef)[1]
							};
						})
				);
				reset();
				importpop = !importpop;
			}}>IMPORT</button
		>
	</div>
{/if}

<style>
	.cancel {
		font-family: 'GilroyBold', sans-serif;
		margin: 1rem;
		padding: 1rem;
		background-color: var(--emp);
		border: 0px solid transparent;
		border-radius: var(--round);
	}
	.bold {
		font-family: 'MontserratBold', sans-serif;
	}
	.dialogue {
		font-family: 'Montserrat', sans-serif;
		margin: 1rem;
	}
	.bkg {
		position: fixed;
		top: 0rem;
		left: 50%;
		width: 100vw;
		height: 100vh;

		background-color: var(--background);

		z-index: 5;

		transform: translateX(-50%);

		border: 0px solid transparent;
		border-radius: var(--round);

		min-height: fit-content;
		overflow-y: auto;
	}
</style>
