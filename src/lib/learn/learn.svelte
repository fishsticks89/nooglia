<script lang="ts">
	import { max } from '$lib/util/minmax';

	import shuffle from '$lib/util/shuffle';
	import Questionier from './Questionier.svelte';
	import type { mode } from './questiontype';
	import type { setStore } from '$lib/data/setStore';
	import { get } from 'svelte/store';
	import settingsState from './settings/settingsState';

	let done = false;

	export let state: setStore;

	interface phase {
		mode: 'write' | 'multichoice' | 'flashcard';
		blitzing: boolean; // whether the user has never gotten it incorrect
		correctTimes: number;
	}

	export let terms: { q: string; a: string }[] = [];
	let shuffledTerms = shuffle(terms);
	let stack: {
		q: string;
		a: string;
		phase: number;
		nextInteractionStep: number | null;
		lastLongTermRetrieval: number | null;
	}[] = [];

	let questionier: any;
	let onAnswer = (correct: boolean) => {};
	let setQuestion: (qa: { q: string; a: string }, newmode: mode) => void;
	const registerSetQuestion: (
		fun: (qa: { q: string; a: string }, newmode: mode) => void
	) => void = (sq) => {
		setQuestion = sq;
	};
	let restart: () => void = () => {};

	let doc = get(state).doc?.id;
	state.subscribe((s) => {
		if (!(s.doc?.id === doc)) {
			doc = s.doc?.id;
			setTimeout(() => {
				restart();
			});
		}
	});

	setTimeout(() => {
		let questionIndex = 0;
		let termsinarow = 0;
		function nextQuestion() {
			questionIndex++;
			let newterm: {
				q: string;
				a: string;
				phase: number;
				nextInteractionStep: number | null;
				lastLongTermRetrieval: number | null;
			} | null = null;
			// decides next step
			{
				function pushStack() {
					const poppedterm = shuffledTerms.pop();
					const tempterm = {
						...poppedterm,
						phase: 1 + +!$settingsState.showFlashcards,
						nextInteractionStep: 0,
						lastLongTermRetrieval: null
					};
					stack.push(tempterm as any);
					newterm = tempterm as any;
				}
				// TODO: no more than three newterms in a row
				if (
					shuffledTerms.length > 0 &&
					stack.filter((e) => e.phase < 5).length < 9 &&
					stack.filter((e) => e.phase <= 3).length < 4 &&
					termsinarow < 3
				) {
					// if the stack is not full, enlarge it
					pushStack();
					termsinarow++;
				} else {
					termsinarow = 0;
					if (
						// if the stack has items with a past interactionstep, do them
						stack.filter((e) => e.nextInteractionStep && e.nextInteractionStep <= questionIndex)
							.length > 0
					) {
						newterm = stack
							.filter((e) => e.nextInteractionStep && e.nextInteractionStep <= questionIndex)
							.reduce((p, c) => {
								return p.nextInteractionStep &&
									c.nextInteractionStep &&
									p.nextInteractionStep < c.nextInteractionStep
									? p
									: c;
							});
					} else if (stack.filter((e) => e.nextInteractionStep != null).length > 0) {
						newterm = stack
							.filter((e) => e.lastLongTermRetrieval)
							.reduce((p, c) => {
								return p.lastLongTermRetrieval &&
									c.lastLongTermRetrieval &&
									p.lastLongTermRetrieval < c.lastLongTermRetrieval
									? p
									: c;
							});
					} else {
						done = true;
					}
				}
			}
			// sets the correct & incorrect callback
			onAnswer = (correct: boolean) => {
				if (newterm) {
					// determines phase
					{
						if (correct) {
							newterm.phase = max(newterm.phase + 1, 5);
						} else {
							if (newterm.phase <= 1) {
								// you can't get a flashcard wrong so imma just leave this here for god to observe
							} else if (newterm.phase <= 2) {
								newterm.phase = 2; // leave the multichoice be
							} else if (newterm.phase <= 5) {
								newterm.phase = 3;
							}
						}
					}
					// calculates next interaction
					{
						if (newterm.phase === 1) {
							newterm.nextInteractionStep = questionIndex + 3;
							newterm.lastLongTermRetrieval = null;
						} else if (newterm.phase === 2) {
							newterm.nextInteractionStep = questionIndex + 3;
							newterm.lastLongTermRetrieval = null;
						} else if (newterm.phase === 3) {
							newterm.nextInteractionStep = questionIndex + 3;
							newterm.lastLongTermRetrieval = null;
						} else if (newterm.phase === 4) {
							newterm.nextInteractionStep = questionIndex + 4;
							newterm.lastLongTermRetrieval = null;
						} else if (newterm.phase <= 5) {
							newterm.nextInteractionStep = null;
							newterm.lastLongTermRetrieval = questionIndex;
						}
					}
				}
				nextQuestion();
			};
			// sets the question
			if (newterm) {
				if (newterm.phase <= 1) {
					setQuestion(newterm, 'flashcard');
				} else if (newterm.phase <= 2) {
					setQuestion(newterm, 'multiple choice');
				} else if (newterm.phase <= 5) {
					setQuestion(newterm, 'short answer');
				}
			}
			// calculates progress
			{
				let total = 0;
				stack.forEach((e) => {
					total += e.phase - (2 - +$settingsState.showFlashcards);
				});
				const possible =
					(stack.length + shuffledTerms.length) * (5 - (2 - +$settingsState.showFlashcards));
				progress = total / possible;
			}
		}
		nextQuestion();
		restart = () => {
			shuffledTerms = shuffle(terms);
			stack = [];
			questionIndex = 0;
			termsinarow = 0;
			done = false;
			nextQuestion();
		};
	});
	let progress = 0;
	settingsState.subscribe((x) => {
		if (!x.showFlashcards) {
			stack = stack.map((e) => {
				if (e.phase === 0) e.phase++;
				return e;
			});
		}
	});
</script>

<Questionier
	bind:this={questionier}
	questions={terms}
	onanswer={onAnswer}
	{progress}
	{registerSetQuestion}
	{done}
	{restart}
/>

<style>
</style>
