<script lang="ts">
	import { fade } from 'svelte/transition';
	import { quadOut } from 'svelte/easing';
	import { spring, tweened } from 'svelte/motion';

	export let show: boolean = false;
	export let close: () => void;

	const shlapfunc = (t: number, spring: number) => {
		const teased = quadOut(t);
		return `
                    position: fixed;
                    width: 80vw;
                    max-width: 40rem;
                    height: fit-content;
                    max-height: 25rem;
                    left: 50%;
                    top: calc(${spring * 50}% - ${(1 - spring) * 13}rem);
                    transform: translate(-50%, -50%) scale(${teased * 50 + 50}%) scaleY(${
			teased * 40 + 60
		}%);
                `;
	};

	const springer = spring(0, {
		stiffness: 0.025,
		damping: 0.17,
		precision: 0.0005
	});
	const linear = tweened(0, {
		duration: 550
	});
	$: {
		[springer, linear].forEach((e) => {
			e.set(+show);
		});
	}
</script>

{#if show}
	<div
		class="main"
		transition:fade={{ duration: 200 }}
		on:click={() => {
			close();
		}}
	/>
	<div class="modal" out:fade={{ duration: 100 }} style={shlapfunc($linear, $springer)}>
		<slot />
	</div>
{/if}

<style>
	.modal {
		background-color: var(--emp);
		border: 0px solid transparent;
		border-radius: var(--round);
		z-index: 2;
		height: fit-content;
	}
	.main {
		width: 100vw;
		height: 100vh;
		position: fixed;
		top: 0px;
		left: 0px;
		background-color: rgba(0, 0, 0, 0.6);
		z-index: 1;
	}
</style>
