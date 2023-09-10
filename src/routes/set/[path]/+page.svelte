<script lang="ts">
	export let data;
	import App from "$lib/App.svelte";
	import { docState } from "$lib/core/doc";
	import Title from "$lib/util/domStuff/Title.svelte";
    import { get } from "svelte/store";

	const setProm = docState(data.id);

	let title: null | string = null;

	setProm.then((set) => {
		set.subscribe((e) => {
			if (e && e.name != "") {
				title = e.name + " | nooglia";
			}
		});
	});

	setProm.catch((e) => {
		window.location.href = "/404";
	});
</script>

<Title {title} />

{#await setProm then set}
	{#if get(set) != null}
		<App setSub={set} />
	{/if}
{/await}

<style>
</style>
