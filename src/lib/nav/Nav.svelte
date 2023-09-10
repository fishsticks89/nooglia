<script lang="ts">
	import { scrollBarWidth } from '$lib/util/scrollbarwidth';
</script>

<div id="nav" style:width="calc(100% - 1.5rem - {$scrollBarWidth}px)" style:padding={"0.75rem"}>
	<a
		href="/"
		class="title"
		on:click={(e) => {
			e.preventDefault();
			window.location.replace("/");
		}}>nooglia</a
	>
	<slot />
</div>

<style>
	.title {
		margin: 0px;
		padding: 0rem;
		display: flex;
		flex-direction: column;
		font-weight: unset;
		font-size: 20px;
		transform: translateY(-3%);

		font-family: "Montserrat", sans-serif;

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
