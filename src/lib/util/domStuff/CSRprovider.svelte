<script lang="ts">
	export let link: string | null = null;
	let actualLink = '';
	let elem: HTMLAnchorElement;
	$: if (link != null) {
		actualLink = link;
		setTimeout(() => {
			elem.click();
		});
	}
</script>

<!-- svelte-ignore a11y-missing-content -->
<a bind:this={elem} href={actualLink} />

<style>
	a {
		position: fixed;
		top: 0;
		left: 0;
		opacity: 0%;
	}
</style>
