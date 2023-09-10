<script lang="ts">
	import Library from "./Library.svelte";
	import AuthButton from "./AuthButton.svelte";
	import { authState, expectingSignIn } from "$lib/auth/authState";
	import { auth } from "$lib/firebase";
	import { cubicIn, cubicOut } from "svelte/easing";
	import { browser } from "$app/environment";

	let popped = false;

	$: isUser = $authState;

	const onclick = () => {
		if (isUser) popped = !popped;
		else popped = false;
	};
	let pos = (x: number, width: number, isin: boolean = true) => {
		const isSmall = width > 600;
		// number is out of 1
		return `
		position: ${isSmall ? "absolute" : "fixed"};
		top: 4rem;
		right: ${isSmall ? "0%" : "50%"};
		opacity: ${100 * (isin ? cubicOut(x) : cubicIn(x))}%;
		transform: ${isSmall ? "" : "translateX(50%)"} perspective(600px) translateZ(-${
			(1 - x) * 80
		}px) rotateX(-${(1 - x) * 20}deg);
        width: ${isSmall ? "15rem" : "80vw"};
        height: ${isSmall ? "20rem" : "80vh"};
        border-radius: var(--round);
		z-index: 5;
        `;
	};
	function enlarge(
		node: any,
		{ duration, rev = false }: { duration: number; rev: boolean }
	) {
		return {
			duration,
			css: (t: number) => {
				const eased = rev ? cubicOut(t) : cubicIn(t);

				return pos(eased, width, rev);
			},
		};
	}
	let width = 0;
</script>

<svelte:window bind:innerWidth={width} />

{#if !(!$authState && expectingSignIn) && browser}
	<AuthButton
		text={popped ? "Back" : "Library"}
		posStyle={"z-index: 2;"}
		oncl={onclick}
	>
		{#if popped && $authState}
			<div
				class="bkg"
				style={pos(1, width)}
				in:enlarge={{ duration: 350, rev: true }}
				out:enlarge={{ duration: 350, rev: false }}
			>
				<Library />
				<button
					class="signout"
					style={""}
					on:click={() => {
						auth.signOut();
						while (document.body.lastChild) {
							document.body.lastChild.remove();
						}
						window.location.reload();
					}}
				>
					Sign out
				</button>
			</div>
		{/if}
	</AuthButton>
{/if}

<style>
	.signout {
		font-size: 16px;
		background-color: transparent;
		border: none;
		font-family: 'PoppinsSemi', sans-serif;

		background-color: var(--lighter);
		color: var(--background);
		border: 0px solid transparent;
		border-radius: var(--round);

		position: absolute;
		width: calc(100% - 3rem);
		height: 3rem;
		margin: 1.5rem;
		bottom: 0rem;
		left: 0rem;

		box-shadow: -3rem 3rem 0px 3rem var(--emp);
	}
	.bkg {
		background-color: var(--emp);
		margin: 0px;
		padding: 0px;
		z-index: 1;
		overflow: hidden;
		cursor: default;

		box-shadow: 0px 0px 0.5px 1px var(--background);
	}
</style>
