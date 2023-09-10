<script lang="ts">
	import DarkButton from "./../dark/DarkButton.svelte";
	import AuthManager from "$lib/auth/AuthManager.svelte";
	import { scrollBarWidth } from "$lib/util/domStuff/scrollbarwidth";
</script>

<div
	id="nav"
	style:width="calc(100% - 1.5rem - {$scrollBarWidth}px)"
	style:padding={"0.75rem"}
>
	<a
		href="/"
		class="title">nooglia</a
	>
	<div class="btns">
		<DarkButton />
		<AuthManager />
	</div>
</div>

<style>
	.btns {
		display: flex;
		align-items: center;
		justify-content: center;
		align-content: center;
		gap: 0.5rem;

		height: 100%;
	}
	.title {
		margin: 0px;
		padding: 0rem;
		display: flex;
		flex-direction: column;
		font-weight: unset;
		font-size: 20px;
		transform: translateY(-3%);

		font-family: "Montserrat", sans-serif;
		font-weight: bold;

		cursor: pointer;

		color: var(--light);
		text-decoration: none;
	}
	#nav {
		margin: 0px;
		height: 3.4rem;

		position: fixed;
		top: 0rem;
		right: 50%;
		transform: translateX(50%);

		display: flex;
		align-items: center;
		justify-content: center;
		align-content: center;
		justify-content: space-between;

		background-color: var(--background);
	}
</style>
