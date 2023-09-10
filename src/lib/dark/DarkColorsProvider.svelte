<script lang="ts">
    import { darkModeDisabled, darkmode } from "./darkMode";
</script>

<svelte:head>
    {#if $darkmode && !$darkModeDisabled}
        <style>
            :root {
                color-scheme: dark;
                /* "lighten" */
                --glass: #b6b6b6;
                /* "lightenhover" */
                --glasser: #d9d9d947;
                --hue: 241;
                --background: #343434;
                /* the background */
                --emp: #2b2b2b;
                /* panes */
                --accent: #d9d9d9;
                --yellow: #ffbb00;
                /* buttons
				--disabled: var(--emp); */
                /* buttons */
                --light: #ffffff;
                --lighter: #ffffff;
                /* correct */
                --correct: #00ff9d;
                /* incorrect */
                --incorrect: #ff3d00;
                /* emp for inputs */
                --comp: #ff00c3;
                /* emp for text */
                --complight: #ff56d8;
                --round: 0.3rem;
                background-color: var(--background);
            }
        </style>
    {/if}
</svelte:head>
