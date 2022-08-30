<script lang="ts">
    import { get } from "svelte/store";
    import { browser } from "$app/env";
    import { state } from "./state";

    export let reg: { reg: RegExp };

    let items = [
        { value: /\t */, label: "Tab" },
        { value: /, */, label: "Comma" },
        { value: /- */, label: "Dash" },
        { value: /; */, label: "SemiColon" },
        { value: /: */, label: "Colon" },
    ].map((e, i) => {
        return { id: i, ...e };
    });
    let select: HTMLElement;
    if (browser)
        setTimeout(() => {
            select.getElementsByTagName("option")[get(state).concat].selected =
                true;
            // setSelectedValue(select as any, get(state).concat);

            // function setSelectedValue(selectObj: any, valueToSet: any) {
            //     for (var i = 0; i < selectObj.options.length; i++) {
            //         if (selectObj.options[i].text == valueToSet) {
            //             selectObj.options[i].selected = true;
            //             return;
            //         }
            //     }
            // }
            reg.reg = items.filter(
                (e) => e.id == (select as any).value
            )[0].value;
            select.addEventListener("change", (f) => {
                reg.reg = items.filter(
                    (e) => e.id == (select as any).value
                )[0].value;
                state.update((state) => {
                    state.concat = (select as any).value;
                    return state;
                });
            });
        });
</script>

<div class="spt">
    <p>Split terms by:</p>
    {#if (!browser)}
    <!-- placeholder with correct spacing -->
    <div id="split" class="split">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
    {:else}
    <select bind:this={select} name="split" id="split">
        {#each items as item}
            <option value={item.id}>{item.label}</option>
        {/each}
    </select>
    {/if}
</div>

<style>
    .spt {
        font-family: "Montserrat", sans-serif;
        color: white;

        position: fixed;
        top: 1.5rem;
        left: 2rem;

        display: flex;
        flex-direction: row;
        align-items: center;
    }
    #split {
        height: fit-content;
        width: fit-content;

        font-family: "Montserrat", sans-serif;
        color: white;

        cursor: pointer;
        appearance: none;

        background-color: var(--emp);
        border-radius: var(--round);
        padding: 0.5rem;
        padding-left: 0.8rem;
        padding-right: 0.8rem;

        margin-inline: 0.5rem;

        font-weight: bold;
        letter-spacing: 0.3px;
        font-size: large;

        border: 0px;
    }
    #split:focus-visible {
        outline: 0px;
        border: 0px;
    }
</style>
