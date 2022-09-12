<script lang="ts">
    import { browser, dev } from "$app/environment";
    import { analytics } from "$lib/firebase";
    if (browser && !dev)
        analytics;
</script>

<slot />

<style>
</style>
