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
        padding-inline: 0.8rem;
        margin-inline: 0.2rem;
        background-color: var(--glass);
        color: var(--light);
        font-family: 'GilroyBold', sans-serif;

        border: 0px solid transparent;
        border-radius: var(--round);

        cursor: pointer;
    }
    .selectMain {
        display: flex;
        flex-direction: row;


        width: fit-content;
        height: fit-content;
        padding-inline: 1rem;
    }
</style>