<script lang="ts">
	import shuffle from '$lib/util/operations/shuffle';
	import Questionier from './Questionier.svelte';
	import type { mode } from './questiontype';
	import settingsState from './settings/settingsState';
	import { event } from '$lib/mixyp';
    import { embed } from '$lib/ai/encode';
    import type { term, termWithEmbed } from '$lib/core/doc';

	let done = false;
	$: {
		if (terms.length > 10 && done) event('Done');
	}

	interface phase {
		mode: 'write' | 'multichoice' | 'flashcard' | 'done';
		blitzing: boolean; // whether the user has never gotten it incorrect
		correctTimes: number;
	}

	export let terms: (term | termWithEmbed)[] = [];
	let shuffledTerms = shuffle(terms);
	let stack: {
		q: string;
		a: string;
		phase: phase;
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

	var setQuestionToNewterm = () => {};

	setTimeout(() => {
		let questionIndex = 0;
		let termsinarow = 0;
		function nextQuestion() {
			questionIndex++;
			let newterm: {
				q: string;
				a: string;
				phase: phase;
				nextInteractionStep: number | null;
				lastLongTermRetrieval: number | null;
			} | null = null;
			// decides next step
			{
				function pushStack() {
					if (!(shuffledTerms.length > 0)) throw 'nope';
					const poppedterm = shuffledTerms.pop();
					const tempterm = {
						...poppedterm,
						phase: {
							mode: $settingsState.showFlashcards
								? 'flashcard'
								: $settingsState.showMultiChoice
								? 'multichoice'
								: $settingsState.showWrite
								? 'write'
								: 'done',
							blitzing: true,
							correctTimes: 0
						},
						nextInteractionStep: 0,
						lastLongTermRetrieval: null
					};
					console.log(tempterm);
					stack.push(tempterm as any);
					newterm = tempterm as any;
				}
				if (shuffledTerms.length === 0 && stack.filter((e) => e.phase.mode !== 'done').length === 0)
					done = true;
				else if (
					(() => {
						const stackEmpty =
							stack.filter((e) => e.nextInteractionStep && e.nextInteractionStep <= questionIndex)
								.length === 0;
						// no more than three newterms in a row
						const areMoreTerms = shuffledTerms.length > 0;
						const enoughMultiChoice = !(
							stack.filter((e) => e.phase.mode === 'multichoice').length <
							2 + 3 * +!$settingsState.showWrite
						);
						const enoughQuestions = !(stack.filter((e) => e.phase.mode !== 'done').length < 6);
						const trow =
							$settingsState.showMultiChoice || $settingsState.showWrite ? termsinarow === 3 : true;

						console.log(
							stackEmpty,
							'or',
							areMoreTerms,
							'and',
							!enoughMultiChoice,
							'and',
							!enoughQuestions,
							'and',
							trow
						);
						return (
							(stackEmpty && areMoreTerms) ||
							(areMoreTerms && !enoughMultiChoice && !enoughQuestions && trow)
						);
					})()
				) {
					console.log('introducing');
					// optionally retrieve older terms
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
						console.log('enforcing', newterm);
					} else if (stack.filter((e) => e.phase.mode === 'done').length > 0) {
						newterm = stack
							.filter((e) => e.lastLongTermRetrieval)
							.reduce((p, c) => {
								if (p === null) return p;
								else if (c === null) return c;
								return p.lastLongTermRetrieval &&
									c.lastLongTermRetrieval &&
									p.lastLongTermRetrieval < c.lastLongTermRetrieval
									? p
									: c;
							});
						console.log('retrieving', newterm);
					} else {
						if (shuffledTerms.length > 0 && termsinarow >= 3) {
							pushStack();
							termsinarow++;
						}
						console.error('DONE?');
						done = true;
					}
				}
			}
			setQuestionToNewterm = () => {
				// sets the question
				if (newterm) {
					if (newterm.phase.mode === 'flashcard') {
						setQuestion(newterm, 'flashcard');
					} else if (newterm.phase.mode == 'multichoice') {
						setQuestion(newterm, 'multiple choice');
					} else if (newterm.phase.mode == 'write') {
						setQuestion(newterm, 'short answer');
					} else if (newterm.phase.mode === 'done') {
						if ($settingsState.showWrite) {
							setQuestion(newterm, 'short answer');
						} else if ($settingsState.showMultiChoice) {
							setQuestion(newterm, 'multiple choice');
						} else {
							console.error(
								'WHAT IS GOING ON WHY IS THERE A NEED FOR A LONG TERM RETRIEVAL FLASHCARD'
							);
							done = true;
						}
					}
				}
			};
			setQuestionToNewterm();
			// sets the correct & incorrect callback
			onAnswer = (correct: boolean) => {
				if (newterm) {
					// determines phase
					{
						if (correct) {
							if (newterm.phase.mode === 'flashcard') {
								if ($settingsState.showMultiChoice) {
									newterm.phase.mode = 'multichoice';
									newterm.phase.correctTimes = 0;
								} else if ($settingsState.showWrite) {
									newterm.phase.mode = 'write';
									newterm.phase.correctTimes = 0;
								} else {
									newterm.phase.mode = 'done';
									newterm.phase.correctTimes = 0;
								}
							} else if (newterm.phase.mode === 'multichoice') {
								if (
									$settingsState.showMultiChoice &&
									!$settingsState.showWrite &&
									(!newterm.phase.blitzing || $settingsState.grindset) &&
									newterm.phase.correctTimes == 0
								) {
									newterm.phase.correctTimes = 1;
								} else if ($settingsState.showWrite) {
									newterm.phase.mode = 'write';
									newterm.phase.correctTimes = 0;
								} else {
									newterm.phase.mode = 'done';
									newterm.phase.correctTimes = 0;
								}
							} else if (newterm.phase.mode === 'write') {
								if ($settingsState.showWrite) {
									if (!$settingsState.grindset) {
										if (newterm.phase.blitzing) {
											newterm.phase.mode = 'done';
										} else {
											newterm.phase.correctTimes++;
											if (newterm.phase.correctTimes >= 2) {
												newterm.phase.mode = 'done';
												newterm.phase.correctTimes = 0;
											}
										}
									} else {
										newterm.phase.correctTimes++;
										if (newterm.phase.correctTimes >= 3) {
											newterm.phase.mode = 'done';
											newterm.phase.correctTimes = 0;
										}
									}
								} else if ($settingsState.showMultiChoice) {
									newterm.phase.mode = 'multichoice';
									newterm.phase.correctTimes = 0;
								} else if ($settingsState.showFlashcards) {
									newterm.phase.mode = 'done';
									newterm.phase.correctTimes = 0;
								} else {
									newterm.phase.mode = 'done';
									newterm.phase.correctTimes = 0;
								}
							} else if (newterm.phase.mode === 'done') {
								newterm.phase.correctTimes++;
							}
						} else {
							console.log("WRONG")
							newterm.phase.blitzing = false;
							newterm.lastLongTermRetrieval = null;
							if (newterm.phase.mode === 'flashcard') {
								// you can't get a flashcard wrong so imma just leave this here for god to observe
							} else if (newterm.phase.mode === 'multichoice') {
								if ($settingsState.showMultiChoice) {
									newterm.phase.correctTimes = 0;
								} else if ($settingsState.showWrite) {
									newterm.phase.mode = 'write';
									newterm.phase.correctTimes = 0;
								} else if ($settingsState.showFlashcards) {
									newterm.phase.mode = 'flashcard';
									newterm.phase.correctTimes = 0;
								} else {
									newterm.phase.mode = 'done';
									newterm.phase.correctTimes = 0;
								}
							} else if (newterm.phase.mode === 'write') {
								if ($settingsState.showWrite) {
									newterm.phase.correctTimes = 0;
								} else if ($settingsState.showMultiChoice) {
									newterm.phase.mode = 'multichoice';
									newterm.phase.correctTimes = 0;
								} else if ($settingsState.showFlashcards) {
									newterm.phase.mode = 'flashcard';
									newterm.phase.correctTimes = 0;
								} else {
									newterm.phase.mode = 'done';
									newterm.phase.correctTimes = 0;
								}
							}
						}
					}
					// calculates next interaction
					{
						if (newterm.phase.mode === 'flashcard') {
							newterm.nextInteractionStep = questionIndex + 3;
							newterm.lastLongTermRetrieval = null;
						} else if (newterm.phase.mode === 'multichoice') {
							newterm.nextInteractionStep = questionIndex + 3;
							newterm.lastLongTermRetrieval = null;
						} else if (newterm.phase.mode === 'write') {
							newterm.nextInteractionStep =
								questionIndex + (newterm.phase.correctTimes >= 2 ? 5 : 3);
							newterm.lastLongTermRetrieval = null;
						} else if (newterm.phase.mode == 'done') {
							newterm.lastLongTermRetrieval = questionIndex;
							newterm.nextInteractionStep = null;
						}
					}
				} else {
					console.error('whyistherenonewtermwhyisyourcodeshit');
				}
				nextQuestion();
			};
			// calculates progress
			{
				let total = 0;
				stack.forEach((e) => {
					switch (e.phase.mode) {
						case 'flashcard':
							total += 0;
							break;
						case 'multichoice':
							total += +$settingsState.showFlashcards;
							break;
						case 'write':
							total += +$settingsState.showFlashcards + +$settingsState.showMultiChoice;
							break;
						case 'done':
							total +=
								+$settingsState.showFlashcards +
								+$settingsState.showMultiChoice +
								($settingsState.grindset ? 3 : 2) * +$settingsState.showWrite;
							break;
					}
				});
				const possible =
					(shuffledTerms.length + stack.length) *
					(+$settingsState.showFlashcards +
						+$settingsState.showMultiChoice +
						($settingsState.grindset ? 3 : 2) * +$settingsState.showWrite);
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
	settingsState.subscribe((set) => {
		if (!set.showFlashcards) {
			stack = stack.map((e) => {
				if (e.phase.mode == 'flashcard') {
					if (set.showMultiChoice) {
						e.phase.mode = 'multichoice';
						e.phase.correctTimes = 0;
					} else if (set.showWrite) {
						e.phase.mode = 'write';
						e.phase.correctTimes = 0;
					} else {
						console.error('what.');
						e.phase.mode = 'done';
						e.phase.correctTimes = 0;
					}
				}
				return e;
			});
		}
		if (!set.showMultiChoice) {
			stack = stack.map((e) => {
				if (e.phase.mode == 'multichoice') {
					if (set.showWrite) {
						e.phase.mode = 'write';
						e.phase.correctTimes = 0;
					} else if (set.showFlashcards) {
						e.phase.mode = 'flashcard';
						e.phase.correctTimes = 0;
					} else {
						console.error('what.');
						e.phase.mode = 'done';
						e.phase.correctTimes = 0;
					}
				}
				return e;
			});
		}
		if (!set.showWrite) {
			stack = stack.map((e) => {
				if (e.phase.mode == 'write') {
					if (set.showMultiChoice) {
						e.phase.mode = 'multichoice';
						e.phase.correctTimes = 0;
					} else if (set.showFlashcards) {
						e.phase.mode = 'flashcard';
						e.phase.correctTimes = 0;
					} else {
						console.error('what.');
						e.phase.mode = 'done';
						e.phase.correctTimes = 0;
					}
				}
				return e;
			});
		}
		if (set.grindset) {
			stack = stack.map((e) => {
				if (e.phase.correctTimes >= 2 && e.phase.blitzing && !(e.phase.mode === 'done')) {
					e.phase.mode = 'done';
					e.phase.correctTimes = 0;
				}
				return e;
			});
		}
		setQuestionToNewterm();
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
