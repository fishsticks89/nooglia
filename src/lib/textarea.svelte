<script lang="ts">
    import { browser } from "$app/env";
    export let txt: { txt: string };
    let tx: HTMLElement; // the elem
    let txf: string; // curr contents
    if (browser)
        requestAnimationFrame(() => {
            txf = txt.txt;
            tx.setAttribute(
                "style",
                "height:" + tx.scrollHeight + "px;overflow-y:hidden;"
            );
            tx.oninput = (event: Event) => {
                tx.style.height = "auto";
                tx.style.height = tx.scrollHeight + "px";
                txt.txt = txf;
                localStorage.setItem("words&stuff", txt.txt);
            };
        });
</script>

<textarea bind:this={tx} bind:value={txf} placeholder="Enter Text Here" cols="40" rows="5" />

<style>
    textarea::placeholder {
		font-family: 'Montserrat', sans-serif;
        color: var(--light)
    }
    textarea {
		font-family: 'Montserrat', sans-serif;

        margin-top: 3rem;

        padding: 1rem;

        margin-left: 50vw;
        transform: translateX(-50%);
        width: 80vw;
        max-width: 100vh;

        resize: none;
        background-color: var(--emp);
        border-color: transparent;
        border-radius: var(--round);
    }
    textarea:focus-visible {
        outline: none;
    }
</style>
