<script lang="ts">
	import { fade } from 'svelte/transition';
	import SideBut from '$lib/ui/SideButton.svelte';
	import { onDestroy } from 'svelte';
	import { quadIn, quadOut } from 'svelte/easing';

	export let answer: (correct: boolean) => void;
	export let currentquestion: { q: string; a: string };

	let direction: null | boolean = null; // null if no arrow yet
	let answered = false;
	function onanswer() {
		if (!answered) {
			answered = true;
			setTimeout(() => {
				answer(true);
			}, 500);
		}
	}

	const slideit = (dir: boolean = true) => {
		direction = dir;
		onanswer();
	};
	const listener = (event: KeyboardEvent) => {
		if (event.key === 'ArrowLeft') {
			direction = false;
			onanswer();
		} else if (event.key === 'ArrowRight') {
			direction = true;
			onanswer();
		}
	};
	document.addEventListener('keydown', listener);
	onDestroy(() => {
		document.removeEventListener('keydown', listener);
	});

	function flip(node: any, { duration, rev = false }: { duration: number; rev: boolean }) {
		return {
			duration,
			css: (t: number) => {
				const asdf = (quadOut(t) + t) / 2;
				const eased = rev ? asdf : 1 - asdf;
				const rotation = (1 - t) * 20;
				if (direction != null) return '';
				return `
                opacity: ${t * 100}%;
                transform: translateY(${
									(rev ? 1 - eased : -eased) * 200
								}px) perspective(1000px) rotateX(${rev ? '' : '-'}${rotation}deg);
                `;
			}
		};
	}
	let learnwidth = 0;
	function slide(
		node: any,
		{ duration, direction = false }: { duration: number; direction: boolean }
	) {
		return {
			duration,
			css: (t: number) => {
				const eased = direction ? quadIn(1 - t) : -quadIn(1 - t);
				if (!answered) return '';
				return `
                    outine: 8px solid;
                    outline-color: rgba(0, 255, 0, ${Math.abs(eased) * 255});
                    left: calc(calc(50% + ${eased * 50}vw) + ${direction ? '' : '-'}${
					(Math.abs(eased) * learnwidth) / 2
				}px);
                `;
			}
		};
	}
</script>

{#if !answered}
	<!-- used for translate out -->
	<div
		bind:clientWidth={learnwidth}
		out:slide={{ duration: 400, direction: direction ? direction : false }}
		class="mover"
	>
		<p transition:fade={{ duration: 200 }} class="remem">remember:</p>
		<div
			in:flip={{ rev: true, duration: 200 }}
			out:flip={{ rev: false, duration: 200 }}
			class="fholder"
		>
			<SideBut on:click={() => slideit(true)}
				><span class="material-icons-round">arrow_forward</span>
			</SideBut>
			<p class="txt top">
				{currentquestion.q}
			</p>
			<p class="txt bottom">
				{currentquestion.a}
			</p>
		</div>
	</div>
{/if}

<style>
	.remem {
		position: absolute;
		top: -3rem;
		left: 0%;

		color: white;
		z-index: 1;
	}
	.txt {
		text-align: left;
		color: white;
		position: absolute;

		transform: translateX(-50%);
		width: 80%;
		height: calc(50% - 15%);

		font-size: 2rem;
		margin: 0px;
	}
	.top {
		top: 10%;
		left: 50%;

		border-bottom: 1px solid var(--light);
	}
	.bottom {
		top: 60%;
		left: 50%;
	}
	.fholder {
		position: absolute;
		height: calc(100% - calc(2 * 1rem));
		width: calc(100% - calc(2 * 1rem));

		padding: 1rem;

		border: 0px;
		border-color: transparent;
		background-color: var(--emp);
		border-radius: var(--round);

		display: flex;
		flex-direction: column;
		justify-content: flex-end;
	}
	.mover {
		position: absolute;
		top: 2rem;
		left: 50%;
		transform: translateX(-50%);

		padding: 0px;
		height: calc(100% - 2rem);
		width: 100%;

		border: 0px;
		border-color: transparent;
		background-color: transparent;
		border-radius: var(--round);
	}
</style>
