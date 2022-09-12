<script lang="ts">
	import shuffle from '$lib/util/shuffle';
	import { flyin } from '$lib/transitions/flyin';
	import { spring, type Spring } from 'svelte/motion';

	export let answer: (correct: boolean) => void;
	export let currentquestion: { q: string; a: string };
	export let questions: { q: string; a: string }[];
	const options = shuffle([
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
	console.log(questions);

	let answered = false;
	const springit = spring(
		0,
		{
			stiffness: 0.02,
			damping: 0.25
		}
	);
	function answerWithTerm(term: { a: string; index: number; color: 0 | 1 | -1 }) {
		if (!answered) {
			term.color = -1;
			options.filter((e) => e.a === currentquestion.a).forEach((e) => (e.color = 1));
			setTimeout(() => answer(term.a === currentquestion.a), 1500);
            springit.set(90);
		}
	}

	const ansStyle = (i: number) => `
        font-family: 'Montserrat', sans-serif;
        max-width: 200px;
        max-height: 70px;
        width: 80%;
        height: 16vh;
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
				style={ansStyle(term.index) + `filter: hue-rotate(${((term.color > 0) ? "-" : "")}${Math.abs(term.color * $springit)}deg);`}
				on:click={() => {
					answerWithTerm(term);
				}}
			>
				{term.a}
			</button>
		{/each}
	</div>
</div>

<style>
	button {
		background-color: var(--accent);
		border-radius: var(--round);

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
		font-size: large;
		margin: 2rem;
		position: absolute;
		top: 0rem;
		left: 0rem;
		font-family: 'Montserrat', sans-serif;
	}
	.qholder {
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
