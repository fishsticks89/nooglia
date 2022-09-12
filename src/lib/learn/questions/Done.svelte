<script lang="ts">
	import { flyin } from '$lib/transitions/flyin';


	// your script goes here
</script>

<div
	in:flyin={{ isin: true, additionalTransforms: "transform: translate(-50%, -50%);"}}
	out:flyin={{ isin: false, additionalTransforms: "transform: translate(-50%, -50%);"}}
	class="qholder"
>
<div class="center">
    🎉Done🎉
</div>
</div>

<style>
	.center {
		text-align: center;
		color: white;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-size: 6vw;
		margin: 0px;
        width: 100vw;
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
