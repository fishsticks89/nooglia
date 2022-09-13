<script lang="ts">
	import Library from './Library.svelte';
	import AuthButton from './AuthButton.svelte';
	import { authState } from '$lib/auth/authState';
	import { auth } from '$lib/firebase';
	import { cubicIn, cubicInOut, cubicOut } from 'svelte/easing';
	import type { setStore } from '$lib/data/setStore';

	export let state: setStore;

	let popped = false;

	$: isUser = $authState;

	const onclick = () => {
		if (isUser) popped = !popped;
		else popped = false;
	};
	let pos = (x: number, y: number) => {
		// number is out of 1
		return `
        position: fixed;
        bottom: ${1 - x + y * 5}rem;
        left: ${1 - x}rem;
        width: calc(${8.5 * (1 - x)}rem + ${100 * x}vw);
        height: calc(${3 * (1 - x)}rem + ${100 * x}vh);
        border-radius: ${x > 0.99 ? '0px' : 'var(--round)'};
        backdrop-filter: brightness(${100 + 30 * x}%);
        `;
	};
	function enlarge(node: any, { duration, rev = false }: { duration: number; rev: boolean }) {
		return {
			duration,
			css: (t: number) => {
				const eased = rev ? cubicOut(t) : cubicIn(t);

				return pos(eased, 0);
			}
		};
	}
	function heighten(node: any, { duration, rev }: { duration: number; rev: boolean }) {
		return {
			duration,
			css: (t: number) => {
				const eased = rev ? cubicOut(t) : cubicIn(t);

				return pos(0, eased);
			}
		};
	}
	function rotate(node: any, { duration, rev }: { duration: number; rev: boolean }) {
		return {
			duration,
			css: (t: number) => {
				const eased = rev ? cubicOut(t) : cubicIn(t);

				return `
                    opacity: ${cubicIn(eased) * 100}%;
                    transform: translatex(-50%) rotate(${(1 - eased) * 120}deg);
                `;
			}
		};
	}
</script>

{#if popped && $authState}
	<button
		class="signout"
		style={pos(0, 1) + ' z-index: 2'}
		on:click={() => {
			auth.signOut();
		}}
		transition:heighten={{ duration: 300, rev: popped }}
		><div class="x" transition:rotate={{ duration: 300, rev: popped }}>✖</div>
		Signout</button
	>
	<div
		class="bkg"
		style={pos(1, 0)}
		in:enlarge={{ duration: 350, rev: true }}
		out:enlarge={{ duration: 350, rev: false }}
	>
		<Library
			{state}
			close={() => {
				popped = false;
			}}
		/>
	</div>
{/if}
<AuthButton
	text={popped ? 'Back' : 'Library'}
	posStyle={pos(0, 0) + 'z-index: 2;'}
	oncl={onclick}
/>

<style>
	.x {
		width: 50px;
		left: 50px;
		bottom: 80px;
		position: absolute;
		margin: 0px;
		font-weight: lighter;
		font-size: 40px;
		transform: translateX(-50%);
		left: 50%;
	}
	.signout {
		font-size: 16px;
		background-color: transparent;
		border: none;
		font-family: 'Montserrat', sans-serif;
		font-weight: bold;
	}
	.bkg {
		background-color: var(--accent);
		margin: 0px;
		padding: 0px;
		z-index: 1;
		overflow: hidden;
	}
</style>
