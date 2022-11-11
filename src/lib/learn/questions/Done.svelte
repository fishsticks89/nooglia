<script lang="ts">
	import { flyin } from '$lib/transitions/flyin';
	export let restart: () => void;

	// your script goes here
</script>

<div
	in:flyin={{ isin: true, additionalTransforms: 'transform: translate(-50%, -50%);' }}
	class="qholder"
>
	<div class="center">
		🎉Done🎉
	</div>
	<button on:click={() => {restart()}} class="restart">
		<span class="material-icons-round" style:transform={'scaleX(-1)'} style:font-size={'1.2rem'}
			>refresh</span
		>
		<p class="restxt">restart</p>
	</button>
</div>

<style>
	p {
		margin: 0px;
	}
	.restxt {
		margin: 0px;
		transform: translateY(-7%);
		margin-left: 0.3vw;
	}
	.restart {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;

		font-size: 1rem;

		border-radius: 100vmax;

		background-color: var(--background);
		border: 1px solid var(--accent);

		height: fit-content;
		width: fit-content;

		padding: 2.5rem;
		padding-block: 1.2rem;

		position: absolute;
		top: 75%;
		left: 50%;
		transform: translateX(-50%);

	}
	.center {
		text-align: center;
		color: white;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-size: 6vw;
		margin: 0px;
		width: 100%;
	}
	.qholder {
		position: relative;
		top: 0%;
		left: 50%;
		transform: translateX(-50%);

		padding: 1rem;
		width: calc(100% - calc(2 * 1rem));
		height: 50vh;

		background-color: var(--emp);
		border-color: transparent;
		border-radius: var(--round);

		display: flex;
		flex-direction: column;
		justify-content: flex-end;
	}
</style>
