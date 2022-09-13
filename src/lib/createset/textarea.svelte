<script lang="ts">
	import { flyin } from '$lib/transitions/flyin';
    import { get } from "svelte/store";
    import { browser } from "$app/environment";
    import type { setStore } from "$lib/data/setStore";
    import { authState } from "$lib/auth/authState";
    export let state: setStore;
    let tx: HTMLElement; // the elem
    let txf: string; // curr contents
    const oninput = (updatestate: boolean, _: any = {}) => {
        if (tx) {
            tx.style.height = "auto";
            tx.style.height = tx.scrollHeight + "px";
        } else {
            // console.error("no tx");
        }
        if (updatestate)
            state.update((e) => {
                e.set.contents = txf;
                return e;
            });
    };
    if (browser)
        setTimeout(() => {
            tx.setAttribute(
                "style",
                "height:" + tx.scrollHeight + "px;overflow-y:hidden;"
            );
            function txshadow() {
                const txwidth = tx.clientWidth;
                tx.style.filter = `drop-shadow(0px 0px 8px var(--background)) drop-shadow(${txwidth}px 0px 8px var(--background)) drop-shadow(-${txwidth}px 0px 8px var(--background));`;
            }
            document.addEventListener("resize", () => {
                txshadow();
            });
            txf = get(state).set.contents;
            state.subscribe((e) => {
                txf = e.set.contents;
            });
            setTimeout(() => {
                tx.dispatchEvent(new Event("input"));
                setTimeout(txshadow);
                oninput(false);
            }, 1);
        });
    $: setTimeout(() => {
        oninput(true, txf);
    });
</script>

<textarea
    in:flyin={{isin: true, additionalTransforms: ""}}
    out:flyin={{isin: false, additionalTransforms: ""}}
    bind:this={tx}
    bind:value={txf}
    placeholder={browser
        ? `e.g.

California, Sacramento

Wisconsin, Madison

Georgia, Atlanta

North Dakota, Bismark

South Dakota, Pierre

Massachusetts, Boston
`
        : ""}
/>

<style>
    textarea::placeholder {
        font-family: "Montserrat", sans-serif;
        color: var(--light);
    }
    textarea {
        font-family: "Montserrat", sans-serif;

        margin-top: 1rem;

        padding: 1rem;
        padding-bottom: 0rem;

        margin-left: 0px;
        width: 80vw;
        max-width: 100vh;

        resize: none;
        background-color: var(--emp);

        border-width: 0px;
        border-radius: var(--round);
    }
    textarea:focus-visible {
        outline: none;
    }
</style>
