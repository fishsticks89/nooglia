<script lang="ts">
	import Runner from '$lib/util/Runner.svelte';
	import shuffle from '$lib/util/shuffle';
	import { flyin } from '$lib/transitions/flyin';
	import { spring, type Spring } from 'svelte/motion';
	import { listenKeys } from '$lib/util/keylistener';

	export let answer: (correct: boolean) => void;
	export let currentquestion: { q: string; a: string };
	export let questions: { q: string; a: string }[];
	$: options = shuffle([
		currentquestion.a,
		...shuffle(questions)
			.filter((e) => e.a != currentquestion.a)
			.map((e) => e.a)
			.slice(0, 3)
	]).map((e, i) => {
		const option: {
			a: string;
			index: number;
			color: -1 | 0 | 1;
		} = {
			a: e,
			index: i,
			color: 0
		};
		return option;
	});

	let answered = false;
	const springit = spring(0, {
		stiffness: 0.02,
		damping: 0.25
	});
	function answerWithTerm(term: { a: string; index: number; color: 0 | 1 | -1 }) {
		if (!answered) {
			answered = true;
			term.color = -1;
			options.filter((e) => e.a === currentquestion.a).forEach((e) => (e.color = 1));
			setTimeout(
				() => answer(term.a === currentquestion.a),
				term.a === currentquestion.a ? 700 : 1200
			);
			springit.set(90);
		}
	}

	const ansStyle = (i: number) => `
        font-family: 'Montserrat', sans-serif;
        max-width: 200px;
        max-height: 70px;
        width: 80%;
        height: 70%;
        font-size: 100%;
        grid-column: ${(i % 2) + 1};
        grid-row: ${i < 2 ? 1 : 2};
        `;
</script>

<div
	in:flyin={{ isin: true, additionalTransforms: 'translateX(-50%)' }}
	out:flyin={{ isin: false, additionalTransforms: 'translateX(-50%)' }}
	class="qholder"
>
	<p class="term">{currentquestion.q}</p>

	<div class="grid">
		{#each options as term}
			<button
				style={ansStyle(term.index) +
					`filter: hue-rotate(${term.color > 0 ? '-' : ''}${Math.abs(term.color * $springit)}deg);`}
				on:click={() => {
					answerWithTerm(term);
				}}
			>
				<Runner
					enter={() => {
						return listenKeys((ev) => {
							if (Number(ev.key) == term.index + 1) answerWithTerm(term);
						});
					}}
					leave={(unsu) => {
						unsu();
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
		background-color: var(--accent);
		border-radius: var(--round);
		color: white;
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
		height: 50%;
		margin-block: 1rem;

		align-items: center;
		align-content: center;
		justify-content: center;
		justify-items: center;
	}
	.term {
		color: white;
		font-size: large;
		margin: 2rem;
		max-width: calc(100% - 4rem);
		position: absolute;
		top: 0rem;
		left: 0rem;
		font-family: 'Montserrat', sans-serif;
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
		font-family: 'GilroyBold';
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
