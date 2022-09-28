<script lang="ts">
	import Flashcard from './questions/Flashcard.svelte';
	import MultiChoice from './questions/MultiChoice.svelte';
	import ShortAns from './questions/ShortAns.svelte';
	import type { mode } from '$lib/learn/questiontype';
	import Progress from './Progress.svelte';
	import Done from './questions/Done.svelte';
	import { squish } from '$lib/transitions/squish';
	export let progress: number;
	export let done: boolean;
	export let restart: () => void;
	// exposed to questions
	export let onanswer: (correct: boolean) => void;
	export let questions: { q: string; a: string }[];
	export let registerSetQuestion: (
		fun: (qa: { q: string; a: string }, newmode: mode) => void
	) => void;
	registerSetQuestion((qa, newmode) => {
		currentquestion = qa;
		mode = newmode;
	});
	const answer = (correct: boolean) => {
		mode = null;
		currentquestion = null;
		setTimeout(() => onanswer(correct), 220);
	};
	let currentquestion: { q: string; a: string } | null = null;
	// awaits parent interaction (setquestion)
	let mode: mode | null = null;
</script>

<div class="container" out:squish={{isin: false, initialheight: '70vh'}}>
	{#if !done}
		<Progress amount={progress} />
		{#if currentquestion != null && mode != null}
			{#if mode === 'flashcard'}
				<Flashcard {answer} {currentquestion} />
			{:else if mode === 'multiple choice'}
				<MultiChoice {answer} {questions} {currentquestion} />
			{:else if mode === 'short answer'}
				<ShortAns {answer} {currentquestion} />
			{:else}
				error
			{/if}
		{/if}
	{:else}
		<Done {restart} />
	{/if}
</div>

<style>
	.container {
		/* left: 50%;
		transform: translateX(-50%);
		width: 70vw;
		max-width: 55rem; */
		width: 100%;

		height: 70dvh;
		height: 70vh;

		margin-block: 2rem;

		overflow: visible;

		position: relative;
	}
</style>
