<script lang="ts">
	import Runner from './../../util/Runner.svelte';
	import { fade } from 'svelte/transition';
	import { flyin } from '$lib/transitions/flyin';
	import { onDestroy } from 'svelte';
	import elastic from '$lib/transitions/easing/elastic';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { arrayUnion, collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
	import { hash } from '$lib/util/operations/hashString';
	import { db } from '$lib/firebase';
	import { resizeinit } from '$lib/util/domStuff/textareastuff';
	export let answer: (correct: boolean) => void;
	export let fixContainerHeight = () => {};
	let answerLog = (correct: boolean) => {
		if (!correct && inputText != '') recordAttempt(false, false);
		answer(correct);
	};
	export let currentquestion: { q: string; a: string };
	export let wentOut = () => {};

	let answerText = '';
	async function recordAttempt(gotcorrect: boolean, override: boolean) {
		const question = currentquestion.q;
		const gdoc = await getDoc(doc(collection(db, 'questionAttempts'), hash(question).toString()));
		const answerObj = {
			autoMarkedCorrect: gotcorrect,
			userOverride: override,
			guess: answerText
		};
		if (gdoc.exists()) {
			updateDoc(gdoc.ref, {
				answers: arrayUnion(answerObj)
			});
		} else {
			setDoc(gdoc.ref, {
				question,
				answers: [answerObj]
			});
		}
	}

	let input: HTMLTextAreaElement;
	setTimeout(() => {
		resizeinit(input, () => (correct ? () => {} : fixContainerHeight)());
	});
	let inputText = '';
	let firstcorrect: null | boolean = null;
	let answered = false;
	let correct = false;
	function onanswer() {
		answerText = inputText;
		const iscorrect =
			inputText.toLowerCase().trim().split('\n').join('') ==
			currentquestion.a.toLowerCase().trim().split('\n').join('');
		if (firstcorrect === null) {
			firstcorrect = iscorrect;
		}
		if (iscorrect) {
			if (!answered) {
				answered = true;
				correct = true;
				onCorrect();
				setTimeout(() => answerLog(firstcorrect as boolean), 300);
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

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	style:z-index={20}
	in:flyin={{ isin: true, additionalTransforms: '' }}
	out:fade={{ duration: 200 }}
	on:click={() => {
		input.focus();
	}}
	on:outroend={() => {
		wentOut();
		console.log('shit went doiwn');
	}}
	data-hj-allow
	style={correct
		? `transform: translateX(-${
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
		: null}
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
		<Runner
			enter={() => {
				fixContainerHeight();
			}}
		/>
		<div class="enter" transition:fade={{ duration: 200 }}>
			Enter: "{currentquestion.a}" or
			<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
			<strong class="skp" on:click={() => answerLog(false)}>skip</strong>
		</div>
	{/if}
	<div class="consumer" style:flex-grow={1} />
	<textarea
		rows="1"
		style:border-color={!answered ? '' : 'transparent'}
		bind:this={input}
		bind:value={inputText}
		data-hj-allow
	/>
	<!-- firstcorrect can be null to "=== false" -->
	{#if firstcorrect === false && !answered}
		<button
			class="ov blinkin"
			transition:fade={{ duration: 200 }}
			on:click={() => {
				firstcorrect = true;
				if (!answered) {
					answered = true;
					onCorrect();
					recordAttempt(false, true);
					setTimeout(() => answerLog(firstcorrect ? true : false), 300);
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
	@keyframes spinin {
		0% {
			color: var(--light);
		}
		50% {
			color: var(--accent);
		}
		74% {
			color: var(--comp);
		}
		100% {
			color: var(--light);
		}
	}
	.blinkin {
		animation-name: spinin;
		animation-duration: 0.4s;
		animation-iteration-count: 3;
		animation-timing-function: ease-in-out;
	}
	.skp {
		color: white;
		cursor: pointer;
	}
	.enter {
		color: var(--complight);

		position: relative;
		left: 2rem;
		width: calc(100% - 4rem);
		margin: 0px;
	}
	.ov {
		font-family: "PoppinsSemi", sans-serif;
		font-weight: normal;
		color: var(--lighter);

		background-color: transparent;
		border-radius: var(--round);
		border: 0px solid transparent;

		position: absolute;
		right: 1.5rem;
		top: 1rem;
		padding: 0.8rem;
		padding-inline: 1.2rem;
	}
	textarea {
		cursor: pointer;
		z-index: 2000;
		border-radius: 0px;
		border-top: 0px;
		border-left: 0px;
		border-right: 0px;
		border-bottom: 2px solid white;
		border-color: white;
		background-color: transparent;

		padding-bottom: 5px;

		margin: 0px;
		margin-bottom: 2rem;
		margin-left: 2rem;
		width: calc(100% - 4rem);
		font-size: medium;
		font-family: 'Montserrat';
	}
	textarea:focus-visible {
		outline: none;
		border-bottom: 4px solid var(--lighter);
	}

	textarea {
		background: transparent;
		border: 0px solid transparent;
		padding: 0px;
		border-radius: 0px;
		resize: none;

		height: 1em;

		border-bottom: 2px solid rgba(255, 255, 255, 0.2);
	}
	textarea::placeholder {
		color: rgba(255, 255, 255, 0.2);
	}
	textarea:focus-visible {
		outline: none;
	}
	.term {
		vertical-align: top;
		font-size: large;
		margin: 2rem;
		margin-top: 2rem;
		max-width: calc(100% - 4rem);
		word-wrap: break-word;

		font-family: "PoppinsSemi", sans-serif;
		font-weight: normal;
	}
	.qholder {
		display: flex;
		flex-direction: column;

		overflow: hidden;

		padding: 0rem;
		width: 100%;
		height: fit-content;
		min-height: 50vh;
		min-height: 50dvh;

		background-color: var(--emp);
		border-color: transparent;
		border-radius: var(--round);

		display: flex;
		flex-direction: column;
		justify-content: flex-end;
	}
</style>
