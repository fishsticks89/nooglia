<script lang="ts">
	import Runner from "$lib/util/Runner.svelte";
	import shuffle from "$lib/util/operations/shuffle";
	import { flyin2 } from "$lib/transitions/flyin";
	import { spring } from "svelte/motion";
	import { listenKeys } from "$lib/util/domStuff/keylistener";
	import { checkOverflow } from "$lib/util/domStuff/checkoverflow";
	import { onDestroy } from "svelte";
	import { writable } from "svelte/store";
	import { createDebounce } from "$lib/util/time/debounce";
	import { similarity } from "$lib/ai/dot";
	import type { termMaybeWithEmbed } from "$lib/core/doc";

	export let answer: (correct: boolean) => void;
	export let currentquestion: termMaybeWithEmbed;
	export let questions: termMaybeWithEmbed[];

	$: console.log("hasEmbed: " + currentquestion.embed);

	$: options = shuffle([
		currentquestion.a,
		...shuffle(questions)
			.filter((e) => e.a != currentquestion.a)
			.sort((a, b) => {
				if (!currentquestion.embed) return 0;
				// prioritise answers with embed
				if (a.embed && !b.embed) return -1;
				if (!a.embed && b.embed) return 1;
				if (!a.embed || !b.embed) return 0;
				// prioritise answers with higher similarity
				const a1 = similarity(a.embed, currentquestion.embed);
				const b1 = similarity(b.embed, currentquestion.embed);
				if (!a1 || !b1) return 0;

				return b1 - a1;
			})
			.map((e) => e.a)
			.slice(0, 3),
	]).map((e, i) => {
		const option: {
			a: string;
			index: number;
			color: -1 | 0 | 1;
		} = {
			a: e,
			index: i,
			color: 0,
		};
		return option;
	});

	let answered = false;
	const springit = spring(0, {
		stiffness: 0.02,
		damping: 0.25,
	});
	function answerWithTerm(term: {
		a: string;
		index: number;
		color: 0 | 1 | -1;
	}) {
		if (!answered) {
			answered = true;
			term.color = -1;
			options
				.filter((e) => e.a === currentquestion.a)
				.forEach((e) => (e.color = 1));
			setTimeout(
				() => {
					answer(term.a === currentquestion.a);
					console.log("answering");
				},
				term.a === currentquestion.a ? 700 : 1200
			);
			springit.set(90);
		}
	}
	let overflow = writable(false);
	let locked = false;
	const debo = createDebounce(100, 900);
	const calcOV = () => {
		if (!locked) {
			locked = true;
			overflow.set(false);
			setTimeout(() => {
				let ov = false;
				Array(options.length + 1)
					.map((_, i) => i)
					.forEach((e) => {
						console.log(e);
						if (
							checkOverflow(
								document.getElementById(
									"term-" + e
								) as HTMLElement
							)
						)
							ov = true;
					});
				overflow.set(ov);
				locked = false;
			}, 0);
		}
	};
	setTimeout(calcOV);
	const resize = () => debo(calcOV);
	window.addEventListener("resize", resize);
	onDestroy(() => window.removeEventListener("resize", resize));

	listenKeys((e) => {
		const key = [1, 2, 3, 4].map((e) => e.toString()).indexOf(e.key);
		if (key != -1) {
			selected = key;
			console.log(options, key, options[key]);
			answerWithTerm(options[key]);
		}
	});

	let selected: number | null = null;
</script>

<div
	in:flyin2={{ isin: true, additionalTransforms: "", duration: 200 }}
	out:flyin2={{ isin: false, additionalTransforms: "", duration: 200 }}
	class="qholder"
>
	<p class="term">{currentquestion.q}</p>

	<div class="answers">
		{#each options as term, index}
			<button
				style={`filter: saturate(${
					currentquestion.a == term.a || selected == index
						? Math.abs($springit)
						: "0"
				}%) hue-rotate(${term.color > 0 ? "-" : ""}${Math.abs(
					term.color * $springit
				)}deg);`}
				class="answer"
				on:click={() => {
					console.log("onclickity");
					selected = selected ?? index;
					answerWithTerm(term);
				}}
				id={"term-" + term.index}
			>
				<div class="number">
					<p>
						{term.index + 1}
					</p>
				</div>
				{term.a}
			</button>
		{/each}
	</div>
</div>

<style>
	button {
		position: relative;
		background-color: var(--comp);
		border-radius: var(--round);
		color: white; /* Todo: temporary */
		border: none;

		width: calc(90% - 0.5rem);
		padding: 0.5rem;
		margin-bottom: 1rem;

		padding-block: 1rem;
	}
	button:focus-visible {
		outline: none;
	}
	.term {
		color: var(--light);
		font-size: large;
		margin: 1rem;
		margin-top: 2rem;
		max-width: calc(100% - 2rem);
		font-family: "Montserrat", sans-serif;
		word-wrap: break-word;
	}
	.number > p {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);

		margin: 0px;
		padding: 0px;

		text-align: center;
		font-family: "PoppinsSemi";
		font-size: 0.8rem;

		width: fit-content;
		height: fit-content;
	}
	.answers {
		flex-direction: column;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
	}
	.number {
		top: 0px;
		left: 0px;
		transform: translate(-50%, -50%);
		position: absolute;
		background-color: var(--background);
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 100vmax;
		border: solid var(--emp) 1px;
		color: var(--light);
	}
	.qholder {
		padding-inline: 1rem;
		width: calc(100% - calc(2 * 1rem));
		height: fit-content;

		background-color: var(--emp);
		border-color: transparent;
		border-radius: var(--round);

		display: flex;
		flex-direction: column;
		justify-content: flex-end;
	}
</style>
