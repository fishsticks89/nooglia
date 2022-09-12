<script lang="ts">
    import { get } from "svelte/store";
    import Dropdown from "$lib/createset/dropdown.svelte";
    import Textarea from "$lib/createset/textarea.svelte";
    import { items } from "$lib/createset/splitters";
    import Learn from "$lib/learn/Learn.svelte";
    import type { setStore } from "$lib/data/setStore";
    import AuthManager from "./auth/AuthManager.svelte";
    export let store: setStore;

    let learn = false;
    let terms: { q: string; a: string }[] = [];
    function maketerms() {
        terms = get(store)
            .set.contents.split(/\n+ */)
            .filter((e) => !e.match(/^ *?$/)) // get rid of nothings
            .map((e) => {
                const stuff = e.split(
                    items.filter((e) => e.label === get(store).set.mode)[0]
                        .value
                );
                return {
                    q: stuff[0],
                    a: stuff.splice(1, stuff.length - 1).join(", "),
                };
            })
            .filter((e) => e.a != undefined && e.q != undefined);
    }
</script>

<button
    id="startlearn"
    style:background-color={learn ? "var(--disabled)" : ""}
    on:click={() => {
        maketerms();
        if (terms.length > 4) learn = !learn;
        else
            alert("not enough terms");
    }}>{!learn ? "Learn" : "Back"}</button
>

<div>
    {#if learn}
        <Learn {terms} />
    {:else}
        <AuthManager />
        <Dropdown state={store} />
        <Textarea state={store} />
        <button
            class="import"
            on:click={() => {
                window.open("./quizlet", "_blank");
            }}>Import from Quizlet</button
        >
    {/if}
</div>

<style>
    .import {
        appearance: none;
        color: white;
        background-color: var(--background);
        border: 0px;
        box-shadow: 0px 0px 3px -1px var(--light);
        margin: 0px;
        font-weight: 600;
        font-family: "Montserrat", sans-serif;
        cursor: pointer;

        padding: 0.7rem;
        text-align: right;
        margin-inline: 10vw;
        margin-block: 1rem;
        right: 0rem;
        bottom: 0px;
        position: fixed;

        border-radius: var(--round);
    }
    @media only screen and (min-width: 190vh) {
        .import {
            box-shadow: none;
            padding-right: 1rem;
        }
    }
    #startlearn:focus-visible {
        outline: 0px;
    }
    #startlearn {
        cursor: pointer;
        font-family: "Montserrat", sans-serif;
        font-weight: bold;
        letter-spacing: 0.3px;
        font-size: large;
        color: white;

        background-color: var(--accent);
        border-radius: var(--round);
        position: absolute;
        top: 0rem;
        right: 0rem;
        margin: 1.5rem;
        margin-right: 1.5rem;
        padding: 0.5rem;
        padding-inline: 0.8rem;

        border-color: transparent;
    }
    div {
        overflow-y: auto;
        overflow-x: hidden;
        width: 100vw;
        padding: 0px;
        padding-block: 2rem;
        padding-bottom: 4rem;
        margin: 0px;
        justify-content: start;
    }
</style>
