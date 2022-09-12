<script lang="ts">
    import elastic from "$lib/transitions/easing/elastic"
	import { bounceIn, bounceInOut, cubicOut, elasticIn, elasticOut } from 'svelte/easing';

	type postype = 'top' | 'left' | 'right' | 'bottom';
	export let pos: postype;
	let style = '';
	$: switch (pos) {
		case 'top':
			style = 'position: fixed; top: 1.5rem; left: 50vw; transform: translateX(-50%);';
			break;
		case 'bottom':
			style = 'position: fixed; bottom: 1.5rem; left: 50vw; transform: translateX(-50%);';
			break;
		case 'left':
			style = 'position: fixed; left: 1.5rem; top: 50vh; transform: translateY(-50%);';
			break;
		case 'right':
			style = 'position: fixed; right: 1.5rem; top: 50vh; transform: translateY(-50%);';
			break;
	}

	function bounce(
		node: HTMLElement,
		{ pos, isin, style }: { pos: postype; isin: boolean; style: string }
	) {
		const biggerdim = (pos === "left" || pos === "right") ? node.clientWidth : node.clientHeight;
		return {
			duration: isin ? 800 : 200,
			css: (t: number) => {
				const eased = isin ? elastic(t, (cubicOut(t) + t) / 2) : cubicOut(t);
				return `
                ${style}
                ${pos}: calc(${eased * 1.5}rem - ${biggerdim * (1 - eased)}px);
                `;
			}
		};
	}
</script>

<button
	{style}
	in:bounce={{ pos, isin: true, style }}
	out:bounce={{ pos, isin: false, style }}
	on:click><slot>Button</slot></button
>

<style>
	button {
		border: 0px;

		border-radius: 100vmax;
		background-color: rgba(255, 255, 255, 0.2);
		backdrop-filter: saturate(100%);
		margin: 0px;
		padding: 0.5rem;
        padding-inline: 0.8rem;
		min-width: 5rem;
		width: fit-content;
		height: fit-content;
		z-index: 2;

        display: flex;
        justify-content: center;
        align-items: center;
	}
	button:focus-visible {
		outline: 0px;
	}
</style>
