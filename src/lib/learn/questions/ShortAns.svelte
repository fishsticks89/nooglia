<script lang="ts">
	import { flyin } from '$lib/transitions/flyin';
	import { onDestroy } from 'svelte';
	import elastic from '$lib/transitions/easing/elastic';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	export let answer: (correct: boolean) => void;
	export let currentquestion: { q: string; a: string };

	let input: HTMLElement;
	let inputText = '';
	let firstcorrect: null | boolean = null;
	let answered = false;
	function onanswer() {
		const correct =
			inputText.toLowerCase().split(/ +/).join('') ===
			currentquestion.a.toLowerCase().split(/ +/).join('');
		if (firstcorrect === null) {
			firstcorrect = correct;
		}
		if (correct) {
			if (!answered) {
				answered = true;
				onCorrect();
				setTimeout(() => answer(firstcorrect as boolean), 300);
			}
		} else incorrect();
	}
	const listener = (kke: KeyboardEvent) => {
		if (kke.key == 'Enter') {
			kke.preventDefault();
			onanswer();
		}
	};
	setTimeout(() => {
		input.focus();
		input.addEventListener('keyup', listener);
		inputText = '';
	});
	onDestroy(() => {
		input.removeEventListener('keyup', listener);
	});
	const incorrectTweened = tweened(0, {
		duration: 1000
	});
	function incorrect() {
		incorrectTweened.update((e) => {
			if (e < 0.5) {
				e = 1;
			} else {
				e = 0;
			}
			return e;
		});
	}
	const correctTweened = tweened(0, {
		duration: 600,
		easing: cubicOut
	});
	function onCorrect() {
		correctTweened.set(1);
	}
</script>

<div
	in:flyin={{ isin: true, additionalTransforms: 'translateX(-50%)' }}
	out:flyin={{ isin: false, additionalTransforms: 'translateX(-50%)' }}
	style={(!answered) ? `transform: translateX(-${
		50 -
		5 *
			(1 -
				elastic(
					$incorrectTweened,
					($incorrectTweened < 0.5 ? 1 - $incorrectTweened : $incorrectTweened) - 0.5
				))
	}%);
    box-shadow: 0px 0px ${Math.abs(
			($incorrectTweened > 0.5 ? 1 - $incorrectTweened : $incorrectTweened) * 16
		)}px 0px #e300bd;
    ` : ""}
	class="qholder"
>
    <div style={`
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0px;
    left: 0px;
    background-color: #00e326;
    opacity: ${$correctTweened * 100};
    `}/>
	<h1 class="term">
		{currentquestion.q}
    {#if (firstcorrect != null)}
     - {currentquestion.a}
    {/if}
	</h1>
	<input type="text" bind:this={input} bind:value={inputText} />
</div>

<style>
	input {
		border-radius: 0px;
		border-top: 0px;
		border-left: 0px;
		border-right: 0px;
		border-bottom: 2px solid white;
		border-color: white;
		background-color: transparent;

		padding-bottom: 5px;

		position: absolute;
		bottom: calc(10% + 2rem);
		left: 2rem;
		width: calc(100% - 4rem);
		margin: 0px;

		font-size: medium;
		font-family: 'Montserrat';
	}
	input:focus-visible {
		outline: none;
		border-bottom: 4px solid var(--comp);
		margin-bottom: -2px;
	}
	.term {
		font-size: large;
		margin: 2rem;
		position: absolute;
		top: 0rem;
		left: 0rem;
		font-family: 'Montserrat', sans-serif;
	}
	.qholder {
        overflow: hidden;
		width: 80vw;
		max-width: 100vh;
		position: fixed;
		top: 15vh;
		left: 50vw;
		transform: translateX(-50%);
		height: 70vh;

		padding: 1rem;
		width: calc(80vw - calc(2 * 1rem));

		background-color: var(--emp);
		border-color: transparent;
		border-radius: var(--round);

		display: flex;
		flex-direction: column;
		justify-content: flex-end;
	}
</style>
