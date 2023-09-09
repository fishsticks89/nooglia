<script lang="ts">
</script>

<div id="nav">
	<a href="/" class="title" on:click={(e) => {
		e.preventDefault();
		window.location.replace("/")
	}}>nooglia</a>
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

		font-family: 'Montserrat', sans-serif;

		cursor: pointer;

		color: white;
		text-decoration: none;
	}
	#nav {
		filter: drop-shadow(0px -1.2rem 0px var(--background));

		margin: 0px;
		padding-inline: 0.7rem;
		height: 3.3rem;
		width: calc(70vw - 1.4rem + 8vh);

		position: fixed;
		top: 0.8rem;
		left: 50vw;
		transform: translateX(-50%);

		box-shadow: 0px 0px 0.5px 1px var(--background);

		border: none;
		background-color: var(--emp);
		border-radius: var(--round);
		display: flex;

		align-items: center;
		justify-content: center;
		align-content: center;
		justify-content: space-between;
	}
</style>
