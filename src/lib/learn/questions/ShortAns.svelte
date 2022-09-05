<script lang="ts">
    import { flyin } from "$lib/transitions/flyin";
    import { onDestroy } from "svelte";
    export let answer: (correct: boolean) => void;
    export let currentquestion: { q: string; a: string };

    let input: HTMLElement;
    let inputText = "";
    function onanswer() {
        const correct =
            inputText.toLowerCase().split(/ +/).join("") ===
            currentquestion.a.toLowerCase().split(/ +/).join("");
        answer(correct);
    }
    const listener = (kke: KeyboardEvent) => {
        if (kke.key == "Enter") {
            kke.preventDefault();
            onanswer();
        }
    };
    setTimeout(() => {
        input.focus();
        input.addEventListener("keyup", listener);
        inputText = "";
    });
    onDestroy(() => {
        input.removeEventListener("keyup", listener)
    });
</script>

<div
    in:flyin={{ isin: true, additionalTransforms: "translateX(-50%)" }}
    out:flyin={{ isin: false, additionalTransforms: "translateX(-50%)" }}
    class="qholder"
>
    <h1 class="term">
        {currentquestion.q}
    </h1>
    <input type="text" bind:this={input} bind:value={inputText} />
</div>

<style>
    input {
        border-radius: 0px;
        border-top: 0px;
        border-left: 0px;
        border-right: 0px;
        border-bottom: 2px solid white;
        border-color: white;
        background-color: transparent;

        padding-bottom: 5px;

        position: absolute;
        bottom: calc(10% + 2rem);
        left: 2rem;
        width: calc(100% - 4rem);
        margin: 0px;

        font-size: medium;
        font-family: "Montserrat";
    }
    input:focus-visible {
        outline: none;
        border-bottom: 4px solid var(--comp);
        margin-bottom: -2px;
    }
    .term {
        font-size: large;
        margin: 2rem;
        position: absolute;
        top: 0rem;
        left: 0rem;
        font-family: "Montserrat", sans-serif;
    }
    .qholder {
        width: 80vw;
        max-width: 100vh;
        position: fixed;
        top: 15vh;
        left: 50vw;
        transform: translateX(-50%);
        height: 70vh;

        padding: 1rem;
        width: calc(80vw - calc(2 * 1rem));

        background-color: var(--emp);
        border-color: transparent;
        border-radius: var(--round);

        display: flex;
        flex-direction: column;
        justify-content: flex-end;
    }
</style>
