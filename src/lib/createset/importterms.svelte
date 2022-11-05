<script lang="ts">
	import Term from './term.svelte';
	import { event } from '$lib/mixpanel';
	import Selector from '$lib/createset/Selector.svelte';
	import type { term } from '$lib/data/db';
	import splitters from './splitters';
	import Textarea from './textarea.svelte';
	import { collection, doc, setDoc } from 'firebase/firestore';
	import { hash } from '$lib/util/hashString';
	import { db } from '$lib/firebase';
	import { writable, type Writable } from 'svelte/store';
	import { createDebounce } from '$lib/util/debounce';
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
		setEntriesSplitter: (index: number) => void;
	} = {} as any;

	const reset = () => {
		selector.reset();
		textarea.reset();
	};
	let terms: Writable<term[]> = writable([]);
	const parse = (contents: string) => {
		if (contents != null)
			terms.set(
				contents
					.split(selector.getSplitters().entries)
					.map((e) => {
						const termDefSplitter = selector.getSplitters().termdef;
						if (!e.match(termDefSplitter)) {
							return {
								q: e,
								a: ''
							};
						} else if (termDefSplitter.constructor === RegExp) {
							const regex = new RegExp(termDefSplitter, 'g');
							regex.test(e);
							return {
								q: e.split(termDefSplitter)[0],
								a: e.substring(regex.lastIndex)
							};
						} else if (typeof e === 'string') {
							let q = '';
							let a = '';
							e.split(termDefSplitter).forEach((item, index) => {
								if (index === 0) q = item;
								else if (a == '') a = item;
								else a += termDefSplitter + item;
							});
							return { q, a };
						} else {
							throw 'wtf';
						}
					})
					.filter((e) => e.q != '' || e.a != '')
			);
	};
	let selectorChanged = false;
	const debo = createDebounce(20, 40);
	let textareacontents = '';
</script>

{#if importpop}
	<div id="bkg">
		<div class="importer">
			<button
				class="cancel"
				on:click={() => {
					importpop = !importpop;
				}}>CANCEL IMPORT</button
			>
			<Selector
				{selector}
				onChange={() => {
					selectorChanged = true;
					debo(() => {
						parse(textarea.get());
					});
				}}
			/>
			<p class="dialogue">
				<strong class="bold">Import your data.</strong> Copy and Paste your data here (from Word, Excel,
				Google Docs, etc.)
			</p>
			<Textarea
				defaultText={'Word 1	Definition 1\nWord 2	Definition 2\nWord 3	Definition 3'}
				funcs={textarea}
				onChange={(contents) => {
					textareacontents = 'contents';
					if (contents === '') selectorChanged = false;
					debo(() => {
						parse(contents);
					});
				}}
				onPaste={(s) => {
					console.log(s.split(splitters.newline).length, selectorChanged);
					if (s.split(splitters.newline).length >= 2 && !selectorChanged) {
						const concats = [splitters.comma, splitters.tab];
						let mode = null;
						concats.forEach((split, i) => {
							let lines = s.split(splitters.newline).length;
							s.split(splitters.newline).forEach((f) => {
								if ((f.match(split) || []).length == 1) lines--;
							});
							if (lines <= 1) mode = i == 0;
						});
						if (mode != null) {
							selector.setTermDefSplitter(mode ? 0 : 1);
						}
					}
					if (false) {
						// idk what goes here but it said: check for newline
					} else if (
						!selectorChanged &&
						textarea.get().split(splitters.doublenewline).length >= 4
					) {
						let twoentries = 0;
						textarea
							.get()
							.split(splitters.doublenewline)
							.forEach((e) => {
								twoentries += +(e.split(splitters.newline).length >= 2);
							});
						if (twoentries >= textarea.get().split(splitters.doublenewline).length * 0.9 - 1) {
							selector.setTermDefSplitter(2);
							selector.setEntriesSplitter(2);
						}
					}
				}}
			/>
			<button
				style:background-color={'var(--accent)'}
				class="cancel importbutton"
				on:click={() => {
					if (textarea.get() && textarea.get().length != 0) {
						// anal - itics
						setDoc(
							doc(collection(db, 'importAttempts'), Math.abs(hash(textarea.get())).toString()),
							{
								contents: textarea.get(),
								entriesSplitters: selector.getSplitters().entries.toString(),
								termDefSplitter: selector.getSplitters().termdef.toString()
							}
						);

						parse(textarea.get());
						addTerms($terms);
					}
					reset();
					importpop = !importpop;
					event('Import');
				}}>IMPORT</button
			>
		</div>
		<div class="termsholder">
			{#if $terms.length > 0}
				{#each $terms as term}
					<div class="termholder">
						<Term isEditing={false} {terms} selected={null} {term} />
					</div>
				{/each}
			{:else if textareacontents !== ''}
				<p>Paste in your terms/definitions and your cards will appear here!</p>
			{:else}
				<p>
					Select what character splits up your term/definitions and your cards will appear here!
				</p>
			{/if}
		</div>
	</div>
{/if}

<style>
	.importer {
		width: 70vw;
		height: fit-content;
	}
	.termsholder {
		width: 30vw;
		position: fixed;
		right: 0.5rem;
		top: 0rem;
		height: fit-content;
		overflow-y: auto;
		z-index: 5;

		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}
	.termsholder::-webkit-scrollbar {
		display: none;
	}
	.termholder {
		position: relative;

		height: fit-content;
		width: 100%;
		margin-block: 0.5rem;
		background-color: var(--emp);
		border-radius: var(--round);

		display: flex;
		flex-direction: row;
		align-items: center;
		align-content: center;
		justify-content: left;
	}
	.cancel {
		font-family: 'GilroyBold', sans-serif;
		margin: 1rem;
		padding: 1rem;
		background-color: var(--emp);
		border: 0px solid transparent;
		border-radius: var(--round);
	}
	.importbutton {
		vertical-align: bottom;
		position: sticky;
		bottom: 0.5rem;
		margin-block: 0px;
		margin-top: 0px;
		margin-bottom: 1rem;
	}
	@media screen and (max-width: 59rem) {
		.importer {
			width: 100vw;
		}
		.termsholder {
			position: relative;
			right: 0rem;
			top: 0rem;

			width: calc(100% - 2rem);
			margin-bottom: 1rem;
			margin-left: 1rem;
		}
		.termholder {
			position: relative;
		}
		.cancel {
			position: relative;
		}
		.importbutton {
			display: block;
			position: sticky;
			bottom: initial;
			top: 0.5rem;

			width: calc(100% - 3rem);
			margin-bottom: 1rem;
			margin-left: 1rem;
		}
	}
	.bold {
		font-family: 'MontserratBold', sans-serif;
	}
	.dialogue {
		font-family: 'Montserrat', sans-serif;
		margin: 1rem;
	}
	#bkg {
		position: fixed;
		top: 0rem;
		left: 50%;
		width: 100vw;
		height: 100vh;
		height: 100dvh;

		background-color: var(--background);

		z-index: 5;

		transform: translateX(-50%);

		border: 0px solid transparent;
		border-radius: var(--round);

		overflow-y: auto;
		overflow-x: hidden;
	}
</style>
