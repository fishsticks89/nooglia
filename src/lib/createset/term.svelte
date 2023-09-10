<script lang="ts">
	import Runner from './../util/Runner.svelte';
	import type { Writable } from 'svelte/store';
	import type { term } from '$lib/data/db';

	export let isEditing: boolean;
	export let terms: Writable<term[]>;
	export let selected: boolean | null;
	export let onUpdate = (tms: term[]) => {};
	export let setSelected = (side: boolean) => {};
	export let onPress = (ev: KeyboardEvent) => {};

	export let term: term;

	function init(text: HTMLTextAreaElement) {
		function resize() {
			text.style.height = 'auto';
			text.style.height = text.scrollHeight + 1 + 'px';
		}
		/* 0-timeout to get the already changed text */
		function delayedResize() {
			window.setTimeout(resize, 0);
		}
		text.addEventListener('change', resize);
		text.addEventListener('cut', delayedResize);
		text.addEventListener('paste', delayedResize);
		text.addEventListener('drop', delayedResize);
		text.addEventListener('keydown', delayedResize);
		text.addEventListener('keydown', onPress);
		window.addEventListener('resize', delayedResize);

		function removeNewLines() {
			text.value = text.value.split('\n').join('');
		}

		text.addEventListener('change', removeNewLines);
		text.addEventListener('keydown', (e) => {
			if (e.key == 'Enter') e.preventDefault();
		});

		resize();
	}

	let tx1: HTMLTextAreaElement;
	let tx2: HTMLTextAreaElement;

	$: setTimeout(() => {
		if (selected !== null && tx1 && tx2) {
			(selected ? tx1 : tx2).focus({ preventScroll: true });
		}
	});
	$: long = term.q.length > 20 || term.a.length > 20;
</script>

{#if isEditing}
	<textarea
		on:change={() => {
			onUpdate($terms);
		}}
		rows="1"
		bind:this={tx1}
		bind:value={term.q}
		class="term"
		placeholder="term"
		data-hj-allow
	/>
	<div class="vr" />
	<textarea
		on:change={() => {
			onUpdate($terms);
		}}
		rows="1"
		bind:this={tx2}
		bind:value={term.a}
		class="term"
		placeholder="definition"
		data-hj-allow
	/>
	<Runner
		enter={() => {
			init(tx1);
			init(tx2);

			setTimeout(() => {
				[tx1, tx2].forEach((e, i) => {
					e.addEventListener('focus', () => {
						setSelected(i == 0);
					});
				});
			});
		}}
	/>
	<button
		class="delete"
		on:click={() => {
			terms.update((tms) => {
				return tms.filter((e) => e !== term);
			});
			onUpdate($terms);
		}}
	>
		<span class="material-icons-round">delete</span>
	</button>
{:else}
	<p class="term">{term.q}</p>
	<div class="vr" />
	<p class="term">{term.a}</p>
{/if}

<style>
	textarea {
		background: transparent;
		border: 0px solid transparent;
		padding: 0px;
		border-radius: 0px;
		resize: none;

		height: 1em;

		border-bottom: 2px solid var(--glasser);
	}
	textarea::placeholder {
		color: rgba(255, 255, 255, 0.2);
	}
	textarea:focus {
		margin-bottom: calc(1rem - 1.5px);
		border-bottom: 3px solid var(--light);
	}
	textarea:focus-visible {
		outline: none;
	}
	.term {
		width: 30%;
		margin: 1rem;
		word-wrap: break-word;
	}
	.vr {
		height: 1.5rem;
		width: 1.5px;
		background-color: var(--background);
		margin-inline: 0.4rem;
	}
	.delete {
		position: absolute;
		right: 0.5rem;
		top: 50%;
		transform: translateY(-50%);

		display: flex;
		align-items: center;
		justify-content: center;
		height: 2.5rem;
		width: 2.5rem;

		color: var(--lighter);
		background-color: var(--glasser);

		border: 0px solid transparent;
		border-radius: var(--round);
	}
</style>
