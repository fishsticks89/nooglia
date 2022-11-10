<script lang="ts">
	import { browser } from '$app/environment';
	import { onDestroy } from 'svelte';
	const listener = () => {
		blur = document.body.scrollTop > 10;
	};
	if (browser) {
		setTimeout(() => document.body.addEventListener('scroll', listener));
		onDestroy(() => document.removeEventListener('scroll', listener));
	}
	let blur: boolean = false;
	$: console.log(blur);
</script>

<div class={blur ? 'nav bkg' : 'nav'}>
	<img src="/favicon.svg" alt="" />
	<div class="vert" />
	<p class="title">guides</p>
	<!-- <div class="bottom" /> -->
	<slot />
</div>

<style>
	img {
		width: 1.2rem;
		filter: brightness(0%);
		margin-left: 1.5rem;
	}
	.vert {
		height: 40%;
		width: 0.7px;
		background-color: black;
		margin-inline: 1.7rem;
	}
	.title {
		margin: 0px;
		padding: 0rem;
		display: flex;
		flex-direction: column;
		font-weight: unset;
		font-size: 27px;
		transform: translateY(-3%);
		color: black;

		font-family: 'Eina', sans-serif;
		margin-left: -5px;
	}
	.bottom {
		position: absolute;
		bottom: 0px;
		left: 1rem;

		width: calc(100vw - 2rem);
		height: 1px;
		background-color: black;
	}
	.nav {
		margin: 0px;
		padding-inline: 0.7rem;
		height: 4rem;
		width: 100vw;

		position: fixed;
		top: 0rem;
		left: 0rem;

		border: none;
		background-color: transparent;
		border-radius: 0px;
		display: flex;
		backdrop-filter: blur(0px) saturate(0%);

		align-items: center;
		justify-content: center;
		align-content: center;
		justify-content: left;

		transition-property: background-color, filter;
		transition-timing-function: ease-in-out;
		transition-duration: 0.2s;
	}
	.nav:is(.bkg) {
		backdrop-filter: blur(50px) saturate(230%);
		background-color: rgba(255, 255, 255, 0.6);
	}
</style>
