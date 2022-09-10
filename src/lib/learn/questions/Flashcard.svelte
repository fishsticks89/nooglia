<script lang="ts">
    import ClearButton from "$lib/ui/ClearButton.svelte";
    import { onDestroy } from "svelte";
    import { quadIn, quadOut } from "svelte/easing";

    export let answer: (correct: boolean) => void;
    export let currentquestion: { q: string; a: string };

    let direction: null | boolean = null; // null if no arrow yet
    let answered = false;
    function onanswer() {
        if (!answered) {
            answered = true;
            setTimeout(() => {
                answer(true);
            }, 500);
        }
    }

    let flipped = false;
    const flipit = () => {flipped = !flipped}
    const slideit = (dir: boolean = true) => {
        direction = dir;
        onanswer();
    }
    const listener = (event: KeyboardEvent) => {
        if (event.key === "ArrowUp" || event.key == "ArrowDown") {
            flipit()
        } else if (event.key === "ArrowLeft") {
            direction = false;
            onanswer();
        } else if (event.key === "ArrowRight") {
            direction = true;
            onanswer();
        }
    };
    document.addEventListener("keydown", listener);
    onDestroy(() => {
        document.removeEventListener("keydown", listener);
    });

    function flip(
        node: any,
        { duration, rev = false }: { duration: number; rev: boolean }
    ) {
        return {
            duration,
            css: (t: number) => {
                const asdf = (quadOut(t) + t) / 2;
                const eased = rev ? asdf : 1 - asdf;
                const rotation = (1 - t) * 20;
                if (direction != null) return "";
                return `
                opacity: ${t * 100}%;
                transform: translateY(${
                    (rev ? 1 - eased : -eased) * 200
                }px) perspective(1000px) rotateX(${
                    rev ? "" : "-"
                }${rotation}deg);
                `;
            },
        };
    }
    let learnwidth = 0;
    function slide(
        node: any,
        {
            duration,
            direction = false,
        }: { duration: number; direction: boolean }
    ) {
        return {
            duration,
            css: (t: number) => {
                const eased = direction ? quadIn(1 - t) : -quadIn(1 - t);
                if (!answered) return "";
                return `
                    outine: 8px solid;
                    outline-color: rgba(0, 255, 0, ${Math.abs(eased) * 255});
                    left: calc(${50 + eased * 50}vw + ${direction ? "" : "-"}${
                    (Math.abs(eased) * learnwidth) / 2
                }px);
                `;
            },
        };
    }
</script>

{#if !answered}
    <ClearButton
        on:click={flipit}
        style="position: fixed; top: 1.5rem; left: 50vw; transform: translateX(-50%); z-index: 2"
        >Flip
    </ClearButton>
    <ClearButton
        on:click={_=>slideit(true)}
        style="position: fixed; right: 1.5rem; top: 50vh; transform: translateY(-50%); z-index: 2"
        >next
    </ClearButton>
    <!-- used for translate out -->
    <div
        bind:clientWidth={learnwidth}
        out:slide={{ duration: 400, direction: direction ? direction : false }}
        class="mover"
    >
        <!-- the flipped part -->
        {#if flipped}
            <div
                in:flip={{ rev: true, duration: 200 }}
                out:flip={{ rev: false, duration: 200 }}
                class="qholder"
                on:click={flipit}
            >
                <p class="center">
                    {currentquestion.a}
                </p>
            </div>
        {:else}
            <div
                in:flip={{ rev: true, duration: 200 }}
                out:flip={{ rev: false, duration: 200 }}
                class="qholder"
                on:click={flipit}
            >
                <p class="center">
                    {currentquestion.q}
                </p>
            </div>
        {/if}
    </div>
{/if}

<style>
    .center {
        text-align: center;
        color: white;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 2rem;
        margin: 0px;
    }
    .qholder {
        position: absolute;
        height: calc(100% - calc(2 * 1rem));
        width: calc(100% - calc(2 * 1rem));

        padding: 1rem;

        border: 0px;
        border-color: transparent;
        background-color: var(--emp);
        border-radius: var(--round);

        display: flex;
        flex-direction: column;
        justify-content: flex-end;

        cursor: pointer;
    }
    .mover {
        width: 80vw;
        max-width: 100vh;
        position: fixed;
        top: 15vh;
        left: 50vw;
        transform: translateX(-50%);
        height: 70vh;

        padding: 0px;
        width: 80vw;

        border: 0px;
        border-color: transparent;
        background-color: transparent;
        border-radius: var(--round);
    }
</style>
