<script lang="ts">
	import { analytics } from '$lib/firebase';
	import { event } from '$lib/mixpanel';
	import { logEvent } from 'firebase/analytics';
	import printStore from './printStore';

	let printContents: HTMLElement;
	let appendeded = false;
	printStore.subscribe((e) => {
		if (e) {
			setTimeout(() => {
				if (!appendeded && (window as any).chrome) {
					const style = document.createElement('style');
					style.appendChild(
						document.createTextNode(`
					/* Chrome 29+ */
					@media print {
						@page {
							margin: 2rem 0rem;
						}
						div {
							top: 0;
						}
					}`)
					);
					document.body.appendChild(style);
					setTimeout(() => {
						style.remove();
					}, 2);
				}
				appendeded = true;
				document.body.style.overflowY = 'visible';
				// document.body.style.backgroundColor = 'white';
				(document.getElementById('printarea') as HTMLElement).innerHTML = printContents.innerHTML;
				setTimeout(() => {
					window.print();
					printStore.set(false);
					document.body.style.overflowY = 'scroll';
					(document.getElementById('printarea') as HTMLElement).innerHTML = '';
				}, 2);
				if (analytics) logEvent(analytics, 'printStudy');
				event('Print Studied');
			});
		}
	});
</script>

{#if !$printStore}
	<slot />
{:else}
	<div bind:this={printContents}>
		<slot name="print"><!-- optional fallback --></slot>
	</div>
{/if}

<style>
</style>
