<script lang="ts">
	import { onDestroy, onMount } from "svelte";

    export let enter: () => void = () => {};
    export let leave: () => void = () => {};

    onMount(enter)
    onDestroy(leave)
</script>