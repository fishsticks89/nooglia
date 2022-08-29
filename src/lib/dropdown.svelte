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
            select.getElementsByTagName('option')[get(state).concat].selected = true;
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

<select bind:this={select} name="split" id="split">
    {#each items as item}
        <option value={item.id}>{item.label}</option>
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
