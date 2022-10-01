<script lang="ts">
	import { fade } from 'svelte/transition';
	import { backOut, cubicIn, cubicInOut, cubicOut, quadInOut, quadOut } from 'svelte/easing';

	export let show = true;

	const shlapfunc = (t: number) => {
		const eased = backOut(t);
		const teased = 1;
		return `
                    position: fixed;
                    width: 80vw;
                    max-width: 40rem;
                    height: 80vw;
                    max-height: 25rem;
                    left: 50%;
                    top: calc(${eased * 50}% - ${(1 - eased) * 13}rem);
                    transform: translate(-50%, -50%) scale(${teased * 30 + 70}%) scaleY(${
			teased * 70 + 30
		}%);
                `;
	};
	function shlapin(node: any, {}) {
		return {
			duration: 500,
			css: shlapfunc
		};
	}
</script>

{#if show}
	<div
		class="main"
		transition:fade={{ duration: 200 }}
		on:click={() => {
			show = false;
			setTimeout(() => {
				show = true;
			}, 900);
		}}
	>
		<div class="modal" in:shlapin={{}} out:fade={{ duration: 50 }} style={shlapfunc(1)} />
	</div>
{/if}

<style>
	.modal {
		background-color: var(--emp);
		border: 0px solid transparent;
		border-radius: var(--round);
	}
	.main {
		width: 100vw;
		height: 100vh;
		position: fixed;
		top: 0px;
		left: 0px;
		background-color: var(--background);
		z-index: 1;
	}
</style>
