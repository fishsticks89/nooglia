<script lang="ts">
	import { get } from 'svelte/store';
    import { browser } from "$app/env";
import { state } from "./state";
    let tx: HTMLElement; // the elem
    let txf: string; // curr contents
    const oninput = (event: Event) => {
        console.log("e");
        tx.style.height = "auto";
        tx.style.height = tx.scrollHeight + "px";
        state.update((e) => {e.text = txf; return e});
    };
    if (browser)
        setTimeout(() => {
            tx.setAttribute(
                "style",
                "height:" + tx.scrollHeight + "px;overflow-y:hidden;"
            );
            txf = get(state).text;
            tx.oninput = oninput;
            oninput(new Event("ASdf"));
            setTimeout(() => {
                tx.dispatchEvent(new Event("input"))
            }, 1)
        });
</script>

<textarea bind:this={tx} bind:value={txf} placeholder="Enter Text Here" />

<style>
    textarea::placeholder {
        font-family: "Montserrat", sans-serif;
        color: var(--light);
    }
    textarea {
        font-family: "Montserrat", sans-serif;

        margin-top: 3rem;

        padding: 1rem;

        margin-left: 50vw;
        transform: translateX(-50%);
        width: 80vw;
        max-width: 100vh;

        resize: none;
        background-color: var(--emp);
        box-shadow: 0px 0px 0.5rem 10vw var(--background);

        border-width: 0px;
        border-radius: var(--round);
    }
    textarea:focus-visible {
        outline: none;
    }
</style>
