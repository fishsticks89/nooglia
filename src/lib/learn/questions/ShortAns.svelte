<script lang="ts">
	import { fade } from 'svelte/transition';
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
			inputText.toLowerCase().split(/ +/).join('') ==
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
		input.focus({ preventScroll: true });
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
	style={!answered
		? `transform: translateX(-${
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
		)}px 0px var(--comp);
    `
		: ''}
	class="qholder"
>
	<div
		style={`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    background-color: #00e326;
    opacity: ${$correctTweened * 100};
    `}
	/>
	<h1 class="term">
		{currentquestion.q}
	</h1>
	{#if firstcorrect == false && !answered}
		<div class="enter" transition:fade={{ duration: 200 }}>Enter: "{currentquestion.a}" or <strong class="skp" on:click={() => answer(false)}>skip</strong></div>
	{/if}
	<input
		style:border-color={!answered ? '' : 'transparent'}
		type="text"
		bind:this={input}
		bind:value={inputText}
	/>
	<!-- firstcorrect can be null to "=== false" -->
	{#if firstcorrect === false && !answered}
		<button
			class="ov"
			transition:fade={{ duration: 200 }}
			on:click={() => {
				firstcorrect = true;
				if (!answered) {
					answered = true;
					onCorrect();
					setTimeout(() => answer(firstcorrect ? true : false), 300);
				}
			}}>Override: I was correct</button
		>
	{:else if !answered}
		<button
			class="ov"
			transition:fade={{ duration: 200 }}
			on:click={() => {
				onanswer();
			}}>I don't know</button
		>
	{/if}
</div>

<style>
	.skp {
		color: white;
		cursor: pointer;
	}
	.enter {
		color: var(--complight);

		position: absolute;
		bottom: calc(10% + 4rem);
		left: 2rem;
		width: calc(100% - 4rem);
		margin: 0px;
	}
	.ov {
		font-family: 'GilroyBold', sans-serif;
		color: var(--light);

		background-color: transparent;
		border-radius: var(--round);
		border: 0px solid transparent;

		position: absolute;
		right: 1.5rem;
		top: 1.5rem;
		padding: 0.8rem;
		padding-inline: 1.2rem;
	}
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

		position: absolute;
		top: 0%;
		left: 50%;
		transform: translateX(-50%);

		padding: 1rem;
		width: calc(100% - calc(2 * 1rem));
		height: calc(100% - calc(2 * 1rem));

		background-color: var(--emp);
		border-color: transparent;
		border-radius: var(--round);

		display: flex;
		flex-direction: column;
		justify-content: flex-end;
	}
</style>
