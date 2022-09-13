<script lang="ts">
	import { items } from '$lib/createset/splitters';
	import { browser } from '$app/environment';
	import type { setStore } from '$lib/data/setStore';
	export let state: setStore;

	let select: HTMLElement;
	let main: HTMLElement;
	if (browser) {
		setTimeout(() => {
			select.addEventListener('change', (f) => {
				state.update((state) => {
					state.set.mode = (select as any).value;
					return state;
				});
			});
		});
		state.subscribe((ns) =>
			setTimeout(() => {
				[...(select ? select : main ? main : document).getElementsByTagName('option')]
					.filter((e) => {
						return e.getAttribute('value') === ns.set.mode;
					})
					.forEach((e) => (e.selected = true));
			})
		);
	}

	function swap() {
		state.update((e) => {
			e.set.contents = e.set.contents
				.split('\n')
				.map((f) => {
					return f
						.split(items.filter((g) => g.label === e.set.mode)[0].value)
						.reverse()
						.join(items.filter((g) => g.label === e.set.mode)[0].char);
				})
				.join('\n');
			return e;
		});
	}
</script>

<div bind:this={main} class="spt">
	<div class="splitmain">
		Split terms by:
		{#if !browser}
			<!-- placeholder with correct spacing -->
			<div id="split" class="split">
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
			</div>
		{:else}
			<select bind:this={select} name="split" id="split">
				{#each items as item}
					<option value={item.label}>{item.label}</option>
				{/each}
			</select>
		{/if}
	</div>
	<button class="swap" on:click={swap}>
		<span class="material-icons-round">swap_horiz</span>
	</button>
</div>

<style>
	.swap {
		display: flex;
		align-items: center;
		align-content: center;
		background-color: var(--emp);
		border: 0px;
		border-radius: var(--round);
	}
	.spt {
		font-family: 'Montserrat', sans-serif;
		color: white;

		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		margin: 0px;
	}
	#split {
		height: fit-content;
		width: fit-content;

		font-family: 'Montserrat', sans-serif;
		color: white;

		cursor: pointer;
		appearance: none;

		background-color: var(--emp);
		border-radius: var(--round);
		padding: 0.5rem;
		padding-left: 0.8rem;
		padding-right: 0.8rem;

		margin-inline: 0.5rem;

		font-weight: bold;
		letter-spacing: 0.3px;
		font-size: large;

		border: 0px;
	}
	#split:focus-visible {
		outline: 0px;
		border: 0px;
	}
	.splitmain {
		margin: 0px;
		display: flex;
		flex-direction: row;
		align-items: center;
		width: fit-content;
	}
</style>
