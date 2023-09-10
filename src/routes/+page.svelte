<script lang="ts">
	import { scrollBarWidth } from "$lib/util/domStuff/scrollbarwidth";
	import { authState, expectingSignIn, signin } from "$lib/auth/authState";
	import { auth } from "$lib/firebase";
	import { browser } from "$app/environment";
	import Nav from "$lib/nav/Nav.svelte";
	import DocsList from "$lib/ui/DocsList.svelte";
    import DisableDarkMode from "$lib/dark/DisableDarkMode.svelte";
</script>

<div class="width" style:width={`calc(100vw - ${$scrollBarWidth}px`}>
	{#if $authState != null}
		<DocsList />
	{/if}

	{#if $authState === null && !expectingSignIn && !auth.currentUser && browser}
		<DisableDarkMode />

		<div class="top-section">
			<img class="bg-logo" src="/icons/bg-logo.svg" alt="" />
			<h2>The Best Quizlet Alternative</h2>
			<h3>Completely Free</h3>
		</div>
		<div class="multichoice-section">
			<img
				class="multichoice-img"
				src="/elem/multichoice.png"
				alt=""
				srcset=""
			/>
			<h4 class="learn">
				Learn efficiently with multiple choice and write questions
			</h4>
		</div>
		<div class="write-section">
			<img class="write-img" src="/elem/test.png" alt="" srcset="" />
			<h4 class="test">
				Print foldable tests with answers and a random order
			</h4>
		</div>
		<div class="sign-up-bottom">
			<button on:click={signin} class="sign-up-button">
				<img
					class="sign-up-button-img"
					src="/icons/sign-up-light.svg"
					alt=""
					srcset=""
				/>
			</button>
		</div>
	{/if}
</div>

<Nav />

<style>
	h4 {
		font-family: "Montserrat", sans-serif;
	}
	.sign-up-button-img {
		width: 100%;
	}
	.sign-up-button {
		width: calc(8vw + 120px);
		background-color: transparent;

		border: none;
		outline: none;
	}
	.sign-up-bottom {
		margin-top: 20vmin;
		padding-bottom: 20vmin;

		width: 100%;

		display: flex;
		justify-content: center;
		align-items: center;
	}
	.test {
		position: absolute;
		bottom: 20%;
		left: 3%;
		width: 40%;

		font-size: 3.4vw;

		color: var(--lighter);
	}
	.write-img {
		width: 50%;
	}
	.write-section {
		position: relative;
		margin-top: -13vw;
		width: 100%;

		display: flex;
		justify-content: right;
		align-items: center;
	}
	.learn {
		position: absolute;
		bottom: 20%;
		right: 3%;
		width: 40%;

		font-size: 3.4vw;

		color: var(--lighter);
	}
	.multichoice-img {
		width: 60%;
	}
	.multichoice-section {
		position: relative;
		margin-top: -20vw;
		width: 100%;
	}
	h2,
	h3 {
		font-family: "PoppinsSemi", sans-serif;
	}
	h2 {
		position: absolute;
		right: 7vw;
		top: 20vw;
		font-size: 6.25vw;
		color: var(--light);
	}
	h3 {
		position: absolute;
		right: 7vw;
		top: 25vw;
		font-size: 7.25vw;
		color: linear-gradient(90deg, var(--incorrect) 0%, var(--yellow) 100%);
		background: -webkit-linear-gradient(
			45deg,
			var(--incorrect) 0%,
			var(--yellow) 100%
		);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}
	.bg-logo {
		width: 70vw;
		position: relative;
		left: 5vw;
	}
	.top-section {
		margin-top: 3.4rem;
		width: 100%;

		background-color: var(--background);

		display: flex;
		justify-content: right;
		align-items: center;
	}
	.width {
		overflow-x: hidden;
	}
</style>
