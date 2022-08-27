<script lang="ts">
    import { browser } from "$app/env";

    export let regex: RegExp;

    let items = [
        { value: /\t *?/, label: "Tab" },
        { value: /, *?/, label: "Comma" },
        { value: /- *?/, label: "Dash" },
        { value: /; *?/, label: "SemiColon" },
        { value: /: *?/, label: "Colon" },
    ].map((e, i) => {
        return { id: i, ...e };
    });
    let select: HTMLElement;
    if (browser)
        requestAnimationFrame(() =>
            select.addEventListener("change", (e) => {
                regex = (select as any).value;
                console.log(regex);
            })
        );
</script>

<select bind:this={select} name="split" id="split">
    {#each items as item}
        <option value={item.value}>{item.label}</option>
    {/each}
</select>

<style>
    #split {
        cursor: pointer;
        appearance: none;

        font-family: "Montserrat", sans-serif;
        font-weight: bold;
        letter-spacing: 0.3px;
        font-size: large;
        color: white;

        background-color: var(--emp);
        border-radius: var(--round);
        position: fixed;
        top: 1rem;
        left: 1rem;
        padding: 0.5rem;
        padding-inline: 0.8rem;

        border: 0px;
    }
    #split:focus-visible {
        outline: 0px;
        border: 0px;
    }
</style>
