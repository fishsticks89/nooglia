<script lang="ts">
    export let options: string[];
    export let selected: number;
    export let onSelect: (index: number) => void;
</script>
    
<div class="selectMain">
    {#each options as option, i}
        <p class="option" on:click={() => onSelect(i)} style:background-color={(i == selected) ? "var(--accent)" : "var(--glass)"}>
            {option}
        </p>
    {/each}
</div>
    
<style>
    .option {
        padding: 0.4rem;
        padding-inline: 0.4rem;
        margin-top: 0.3rem;
        margin-left: 0rem;
        margin-right: 0.4rem;
        margin-bottom: 0px;
        background-color: var(--glass);
        color: var(--light);
        transition-property: background-color, scale;
        transition-duration: 0.1s;
        scale: 100%;
        font-family: 'GilroyBold', sans-serif;

        border: 0px solid transparent;
        border-radius: var(--round);

        cursor: pointer;
    }
    .option:hover {
        scale: 105%;
    }
    .selectMain {
        display: flex;
        flex-direction: row;


        width: fit-content;
        height: fit-content;
        padding-inline: 1rem;
    }
</style>