<script lang="ts">
    import { toast } from "@zerodevx/svelte-toast";
    import shuffle from "./shuffle";

    let done = false;

    export let terms: { q: string; a: string }[];
    let termpractice = terms.map((e) => {
        return {
            ...e,
            choiced: false,
            practiced: 0,
            timesince: 999999999999999,
        }; // practiced out of three min -1
    });
    function randof(x: any[]) {
        return x[Math.floor(Math.random() * x.length)];
    }
    const maxbandwidth = 5;
    function getRemainingBandwidth() {
        return (
            maxbandwidth -
            termpractice.filter((e) => e.choiced && e.practiced < 3).length
        );
    }
    let currterm = {
        word: {
            q: "",
            a: "",
            choiced: false,
            practiced: 0,
            timesince: 999999999999999,
        },
        mode: false,
    };
    const listener = (kke: KeyboardEvent) => {
        if (kke.key == "Enter") answer(typedans);
    };
    function queuenext() {
        answered = false;
        const bterms = termpractice.filter((e) => e.timesince != 0);
        if (
            getRemainingBandwidth() > 0 &&
            bterms.filter((e) => !e.choiced).length >= 1
        ) {
            currterm.word = randof(termpractice.filter((e) => !e.choiced));
            currterm.mode = true;
        } else {
            currterm.word = randof(
                bterms.filter((e) => e.choiced && e.practiced < 3)
            );
            currterm.mode = false;
            requestAnimationFrame(() => {
                typedfield.focus();
                typedfield.removeEventListener("keyup", listener);
                typedfield.addEventListener("keyup", listener);
                typedans = "";
            });
        }
        if (!currterm.word) {
            done = true;
        } else {
            termpractice.forEach((e) => (e.timesince += 1));
            currterm.word.timesince = 0;
        }
    }
    let answered = false;
    queuenext();
    let guesses = 0;
    function answer(ans: string) {
        function isCorrect(iscorr: boolean) {
            console.log(termpractice);
            if (currterm.mode) {
                // matching
                currterm.word.choiced = iscorr;
            } else {
                // practicing
                currterm.word.practiced = iscorr
                    ? currterm.word.practiced + 1
                    : currterm.word.practiced - 1;
                Math.max(currterm.word.practiced, -1);
            }
        }
        const correct = currterm.word.a.toLowerCase() == ans.toLowerCase();
        if (correct) isCorrect(!answered);
        if (!answered) {
            guesses = 0;
        }
        answered = true;
        toast.push(correct ? "Correct! ✅" : (guesses <= 2) ? "Incorrect. ❌" : "The answer is: " + currterm.word.a, {
            dismissable: !(guesses <= 2),
            intro: { x: -256, y: 20 },
            duration: (guesses <= 2) ? 1200 : 7000
        });
        guesses++;
        if (correct) queuenext();
    }
    const ansStyle = (i: number) => {
        return `
        max-width: 200px;
        max-height: 70px;
        width: 80%;
        height: 16vh;
        font-size: 100%;
        grid-column: ${(i % 2) + 1};
        grid-row: ${i < 2 ? 1 : 2};
        `;
    };
    let typedans = "";
    let typedfield: HTMLElement;
</script>

<div class="learn">
    {#if (!done)}
    <p
        style:font-size={"large"}
        style:margin={"2rem"}
        style:position={"absolute"}
        style:top={"0rem"}
        style:left={"0rem"}
    >
        {currterm.word.q}
    </p>
    {#if currterm.mode}
        <div class="grid">
            {#each shuffle([currterm.word.a, ...shuffle(termpractice)
                        .filter((e) => e != currterm.word)
                        .map((e) => e.a)].slice(0, (3 >= termpractice.length ? termpractice.length - 1 : 3) + 1)) as term, i}
                <button
                    style={ansStyle(i)}
                    on:click={() => {
                        answer(term);
                    }}>{term}</button
                >
            {/each}
        </div>
    {:else}
        <input
            type="text"
            autofocus
            bind:this={typedfield}
            bind:value={typedans}
        />
    {/if}
    {:else}
    <p id="done">🎉 Done! 🎉</p>
    {/if}
</div>

<style>
    #done {
        font-size: 5vw;
        font-family: 'Montserrat';
        font-weight: bold;
        margin: 0px;
        padding: none;
        top: 50%;
        left:50%;
        position: absolute;
        transform: translate(-50%, -50%);
        width: 100vw;
        text-align: center;
    }
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
    button {
        background-color: var(--accent);
        border-radius: var(--round);

        border: none;
    }
    button:focus-visible {
        outline: none;
    }
    .grid {
        display: grid;
        grid-template-columns: 50% 50%;
        grid-template-rows: 50% 50%;

        width: 100%;
        height: 50%;
        margin-block: 1rem;

        align-items: center;
        align-content: center;
        justify-content: center;
        justify-items: center;
    }
    .learn {
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
