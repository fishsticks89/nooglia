<script lang="ts">
	import Runner from "$lib/util/Runner.svelte";
	import Flashcard from "./questions/Flashcard.svelte";
	import MultiChoice from "./questions/MultiChoice.svelte";
	import ShortAns from "./questions/ShortAns.svelte";
	import type { mode } from "$lib/learn/questiontype";
	import Progress from "./Progress.svelte";
	import Done from "./questions/Done.svelte";
	import { squish } from "$lib/transitions/squish";
	import showSettings from "$lib/learn/settings/showSettings";
	import { onDestroy } from "svelte";
	import type { term } from "$lib/core/doc";
	export let progress: number;
	export let done: boolean;
	export let restart: () => void;
	// exposed to questions
	export let onanswer: (correct: boolean) => void;
	export let questions: term[];
	export let registerSetQuestion: (
		fun: (qa: { q: string; a: string }, newmode: mode) => void
	) => void;
	registerSetQuestion((qa, newmode) => {
		currentquestion = { ...qa, id: Math.random().toString() };
		mode = newmode;
		fixContainerHeight();
	});
	const answer = (correct: boolean) => {
		mode = null;
		currentquestion = null;
		setTimeout(() => onanswer(correct));
	};
	let currentquestion: term | null = null;
	// awaits parent interaction (setquestion)
	let mode: mode | null = null;
	let container: HTMLElement;
	function fixContainerHeight() {
		if (container == null) return;
		const prevHeight = container.style.height;
		container.style.height = "fit-content";
		setTimeout(() => {
			const newHeight = container.clientHeight + "px";
			container.style.height = prevHeight;
			setTimeout(() => {
				container.style.height = newHeight;
			});
		});
	}
	const resizer = () => {
		setTimeout(() => {
			setTimeout(() => {
				fixContainerHeight();
			});
		});
	};
	window.addEventListener("resize", resizer);
	onDestroy(() => window.removeEventListener("resize", resizer));
</script>

<div
	class="container"
	out:squish={{ isin: false, initialheight: "70vh" }}
	bind:this={container}
>
	{#if !done}
		<Progress amount={progress} />
		{#if currentquestion != null && mode != null}
			{#if mode === "flashcard"}
				<Flashcard {answer} {currentquestion} />
			{:else if mode === "multiple choice"}
				<MultiChoice {answer} {questions} {currentquestion} />
			{:else if mode === "short answer"}
				<ShortAns {answer} {currentquestion} {fixContainerHeight} />
			{:else}
				error
			{/if}
		{/if}
		<Runner
			enter={() => {
				setTimeout(() => fixContainerHeight());
			}}
		/>
	{:else}
		<Done {restart} />
		<Runner
			enter={() => {
				setTimeout(() => fixContainerHeight());
			}}
		/>
	{/if}
	<button
		class="restart"
		on:click={restart}
		out:squish={{ initialheight: "2rem" }}
		><span
			class="material-icons-round"
			style:transform={"scaleX(-1) translateY(5%)"}
			style:font-size={"1.2rem"}>refresh</span
		>restart</button
	>
	<button
		class="restart"
		style:right={"0px"}
		on:click={() => {
			$showSettings = true;
		}}
		out:squish={{ initialheight: "2rem" }}
		><span
			class="material-icons-round"
			style:transform={"scaleX(-1) translateY(5%)"}
			style:font-size={"1.2rem"}>settings</span
		>settings</button
	>
</div>

<style>
	.material-icons-round {
		margin-right: 0.25rem;
	}
	.restart {
		position: absolute;
		bottom: -2.5rem;
		width: calc(50% - 0.5rem);
		height: 2rem;

		color: var(--light);
		background-color: var(--emp);
		font-family: "PoppinsSemi", sans-serif;

		border: 0px solid transparent;
		border-radius: 100vmax;

		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
	.container {
		/* left: 50%;
		transform: translateX(-50%);
		width: 70vw;
		max-width: 55rem; */
		width: 100%;

		height: fit-content;
		transition-property: height;
		transition-duration: 0.2s;
		transition-timing-function: ease-out;

		margin-top: 2rem;
		margin-bottom: 3rem;

		overflow: visible;

		position: relative;
	}
</style>
