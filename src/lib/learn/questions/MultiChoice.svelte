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
	
	export let answer: (correct: boolean) => void;
	export let currentquestion: { q: string; a: string };
	export let questions: { q: string; a: string }[];

	$: options = shuffle([
		currentquestion.a,
		...shuffle(questions)
			.filter((e) => e.a != currentquestion.a)
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

	const ansStyle = (i: number) => {
		const same = `
        font-family: 'Montserrat', sans-serif;
        font-size: 100%;
		`;
		return {
			grid:
				same +
				`
					width: 80%;
					height: 70%;
					grid-column: ${(i % 2) + 1};
					grid-row: ${i < 2 ? 1 : 2};
        `,
			overflow:
				same +
				`
					word-break: break-word;
					width: calc(100% - 3rem);
					padding-inline: 0.5rem;
					padding-block: 1rem;
					margin-block: 0.5rem;
					height: fit-content;
		`,
		};
	};

	let selected: number | null = null;
	$: correct = options.reduce(
		(acc, cur, i) => (cur.color === -1 ? i : acc),
		0
	);
</script>

<div
	in:flyin2={{ isin: true, additionalTransforms: "", duration: 200 }}
	out:flyin2={{ isin: false, additionalTransforms: "", duration: 200 }}
	class="qholder"
>
	<p class="term">{currentquestion.q}</p>

	<div class={$overflow ? "block" : "grid"}>
		{#each options as term, index}
			<button
				style={($overflow
					? ansStyle(term.index).overflow
					: ansStyle(term.index).grid) +
					`filter: saturate(${currentquestion.a == term.a || selected == index ? Math.abs($springit) : "0"}%) hue-rotate(${term.color > 0 ? "-" : ""}${Math.abs(
						term.color * $springit
					)}deg);`}
				on:click={() => {
					console.log("onclickity");
					selected = selected ?? index;
					answerWithTerm(term);
				}}
				id={"term-" + term.index}
			>
				<Runner
					enter={() => {
						const unsub = listenKeys((ev) => {
							if (Number(ev.key) == term.index + 1)
								answerWithTerm(term);
						});
						unsub();
					}}
				/>
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
		color: var(--light);
		border: none;
	}
	button:focus-visible {
		outline: none;
	}
	.grid {
		display: grid;
		grid-template-columns: 50% 50%;
		grid-template-rows: 50% 50%;

		width: 100%;
		height: 50vh;
		margin-block: 1rem;

		align-items: center;
		align-content: center;
		justify-content: center;
		justify-items: center;
	}
	.block {
		display: flex;
		flex-direction: column;

		width: 100%;
		height: fit-content;
		margin-block: 1rem;

		align-items: center;
		align-content: center;
		justify-content: center;
		justify-items: center;
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
		font-family: 'PoppinsSemi';
		font-size: 0.8rem;

		width: fit-content;
		height: fit-content;
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
