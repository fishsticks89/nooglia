<script>
    import { get } from "svelte/store";

    import { darkModeDisabled, darkmode } from "./darkMode";
</script>

{#if !$darkModeDisabled}
    <button on:click={() => darkmode.set(!get(darkmode))}>
        <div class="inner" />
    </button>
{/if}

<style>
    .inner {
        background-color: var(--background);
        width: 100%;
        height: 100%;
        border-radius: 50%;

        position: absolute;
        bottom: 7px;
        left: 7px;
    }
    button {
        position: relative;

        width: 20px;
        height: 20px;
        background-color: var(--lighter);

        border: none;
        border-radius: 50%;

        padding: 0px;

        margin-inline: 10px;
    }

    button:hover > .inner {
        background-color: var(--emp);
    }
    button:hover {
        box-shadow: 0px 0px 0px 12px var(--emp);
    }
</style>
