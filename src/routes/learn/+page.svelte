<script lang="ts">
    import Dropdown from "$lib/dropdown.svelte";
    import Textarea from "$lib/textarea.svelte";
    import Learn from "$lib/learn.svelte";
    import { SvelteToast } from "@zerodevx/svelte-toast";
    import { toast } from "@zerodevx/svelte-toast";
    import { browser } from "$app/env";

    let starttext = browser ? localStorage.getItem("words&stuff") : null;
    let txt = { txt: starttext ? starttext : "" };
    let learn = false;
    let terms: { q: string; a: string }[] = [];
    let splitregex = /\t *?/;
    function maketerms() {
        terms = txt.txt
            .split(/\n *?/)
            .filter((e) => !e.match(/^ *?$/)) // get rid of nothings
            .map((e) => {
                console.log(splitregex);
                const stuff = e.split(splitregex);
                return {
                    q: stuff[0],
                    a: stuff.splice(1, stuff.length - 1).join(", "),
                };
            })
            .filter((e) => e.a != undefined && e.q != undefined);
    }
    $: showbutton = txt.txt.split("\n").length < 5;
</script>

<div class="toast">
    <SvelteToast />
</div>

<button
    id="startlearn"
    on:click={() => {
        maketerms();
        if (terms.length > 4) learn = !learn;
        else
            toast.push("not enough terms", {
                dismissable: false,
                intro: { x: -256 },
            });
    }}>Learn</button
>

<div>
    {#if learn}
        <Learn {terms} />
    {:else}
        <Dropdown regex={splitregex} />
        <Textarea {txt} />
        <button
            class="import"
            on:click={() => {
                window.open("./quizlet", "_blank");
            }}>Import from Quizlet</button
        >
    {/if}
</div>

<style>
    .toast {
        --toastBackground: var(--emp);
        --toastWidth: fit-content;
        --toastPadding: 0px 0.5rem 0px 0.5rem;
        --toastBorderRadius: var(--round);
        --toastContainerTop: 1rem;
        --toastContainerLeft: 1rem;
        --toastContainerRight: auto;
        --toastBarBackground: var(--light);
    }
    .import {
        appearance: none;
        color: white;
        background-color: var(--accent);
        border: 0px;
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
            background-color: transparent;
            padding-right: 1rem;
        }
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
        position: fixed;
        top: 1rem;
        right: 1rem;
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
