<script lang="ts">
    import Textarea from "$lib/textarea.svelte";
    import Learn from "$lib/learn.svelte";
    import { SvelteToast } from "@zerodevx/svelte-toast";
    import { toast } from "@zerodevx/svelte-toast";
    import { browser } from "$app/env";

    let starttext = browser ? localStorage.getItem("words&stuff") : null;
    let txt = { txt: starttext ? starttext : "" };
    let learn = false;
    let terms: { q: string; a: string }[] = [];
    function maketerms() {
        terms = txt.txt
            .split(/\n *?/)
            .filter((e) => !e.match(/^ *?$/))
            .map((e) => {
                const stuff = e.split(/[\t,] ?/);
                return {
                    q: stuff[0],
                    a: stuff.splice(1, stuff.length - 1).join(", "),
                };
            })
            .filter((e) => e.a != undefined && e.q != undefined);
    }
</script>

<div class="toast">
    <SvelteToast />
</div>

<button
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
        <Textarea {txt} />
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
    button {
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
        padding-top: 2rem;
        margin: 0px;
    }
</style>
