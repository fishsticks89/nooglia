<script lang="ts">
    export let title: string | null;
</script>

<svelte:head>
    {#if title != null}
        <title>{title}</title>
    {/if}
</svelte:head>
