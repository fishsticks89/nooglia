<script lang="ts">
	import Settings from './learn/settings/Settings.svelte';
	import showSettings from '$lib/learn/settings/showSettings';
	import Printer from './util/print/Printer.svelte';
	import Feedback from '$lib/feedback/feedback.svelte';
	import type { setStore } from '$lib/data/setStore';
	import AuthManager from './auth/AuthManager.svelte';
	import Create from './createset/Create.svelte';
	import Nav from './nav/Nav.svelte';
	import { browser } from '$app/environment';
	import printStore from './util/print/printStore';
	import shuffle from './util/shuffle';
	import Modal from './ui/Modal.svelte';

	export let store: setStore;
	let main: HTMLElement;
	printStore.subscribe((e) => {
		if (e) {
			if (main) main.remove();
		}
	});
</script>

<Printer>
	<Settings/>
	<div style="overflow-y: hidden; height: fit-content; min-height: 100vh;" bind:this={main}>
		{#if browser}
			<Create state={store} />
		{/if}

		<Nav>
			<AuthManager state={store} />
		</Nav>

		<Feedback />
	</div>
	<div class="printmain" slot="print" style:overflow-y={'visible'}>
		<p class="title">nooglia</p>
		<p class="foldhere">fold here |</p>
		{#each shuffle($store.set.contents)
			.map((e) => {
				const qa = e.split('\n');
				return { q: qa[0], a: qa[1] };
			})
			.filter((e) => e.q != '' || e.a != '') as term}
			<div class="outer">
				<p class="inner">{term.a}</p>
				<p class="inner right">{term.q}</p>
				<div class="underline" />
			</div>
		{/each}
	</div>
</Printer>

<style>
	.printmain {
		width: 100%
	}
	.title {
		padding: 0rem;
		font-size: 30px;
		font-family: 'Montserrat', sans-serif;
		text-align: right;
		width: calc(100%);
		color: var(--background);
	}
	.foldhere {
		margin: 0px;
		margin-left: calc(30vw - 5.2rem);
	}
	.outer {
		width: 100%;
		height: fit-content;
		display: grid;
		grid-template-columns: 30vw 30vw 1fr;

		margin: 0px;
		margin-top: 2rem;
		padding: 0px;

		align-items: flex-end;
		justify-items: left;
		break-before: auto;
		flex-basis: auto;

		color: black;
	}
	.inner {
		width: 30vw;
		max-width: 30vw;
		padding-inline: 1rem;
		flex-grow: 0;
		margin: 0px;

		color: black;
	}
	.right {
		border-left: 1px solid black;
		width: fit-content;
	}
	.underline {
		flex-grow: 1;
		border-bottom: 1px solid black;

		margin: 0px;
		padding: 0px;
	}
	div {
		overflow-y: hidden;
		overflow-x: hidden;
		width: 100vw;
		padding: 0px;
		padding-block: 2rem;
		padding-bottom: 4rem;
		margin: 0px;
		justify-content: start;
	}
</style>
