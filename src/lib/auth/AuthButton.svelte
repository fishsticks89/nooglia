<script lang="ts">
	import { fly } from 'svelte/transition';
	import { authState } from '$lib/auth/authState';
	import { signin } from '$lib/auth/signin';

	export let oncl: () => void;
	export let posStyle: string = '';
	export let text = 'Library';
	$: pfp = $authState ? $authState?.photoURL : null;
	let showpfp = true;
</script>

<div
	class="pos"
	style={posStyle}
	on:click={$authState
		? oncl
		: () => {
				signin();
		  }}
>
	<div class="clipper">
		{#if $authState}
			{#key text}
				<p in:fly={{ duration: 600, y: 200 }}>{text}</p>
			{/key}
			{#if showpfp && pfp}
				<div in:fly={{ duration: 600, y: 200 }} class="vr" />
				<img
					on:error={(e) => {
						e.preventDefault();
						showpfp = false;
					}}
					in:fly={{ duration: 600, y: 200 }}
					src={pfp}
					alt=""
				/>
			{/if}
		{:else}
			Sign In
		{/if}
	</div>

	<slot />
</div>

<style>
    p {
        width: 55px;
        margin: 0px;
        text-align: center;
    }
	img {
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 50%;
		border: 0px;
		outline: 0px;
	}
	.clipper {
        display: flex;
        flex-direction: row;
        align-items: center;

        height: 100%;
		overflow: hidden;
	}
	.vr {
		height: 40%;
		width: 1.5px;
		background-color: rgba(255, 255, 255, 0.427);
        margin-inline: 0.4rem;
	}
	.pos {
		cursor: pointer;
		width: 115px;
		height: 37px;
		padding: 0.6rem;
		padding-inline: 1.4rem;
		padding: 0px;
		background-color: var(--accent);
		border-radius: var(--round);

		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-evenly;

		position: relative;

		font-family: 'PoppinsSemi', sans-serif;
        font-size: 15px;
	}
</style>
