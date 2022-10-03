<script lang="ts">
	import { analytics } from '$lib/firebase';
	import { logEvent } from 'firebase/analytics';
	import printStore from './printStore';

	let printContents: HTMLElement;
	printStore.subscribe((e) => {
		if (e) {
			setTimeout(() => {
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
