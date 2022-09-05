<script lang="ts">
    import Flashcard from "./questions/Flashcard.svelte";
    import MultiChoice from "./questions/MultiChoice.svelte";
    import ShortAns from "./questions/ShortAns.svelte";
    import type { mode } from "$lib/learn/questiontype";
    // exposed to questions
    export let onanswer: (correct: boolean) => void;
    export let questions: { q: string; a: string }[];
    export let registerSetQuestion: (
        fun: (qa: { q: string; a: string }, newmode: mode) => void
    ) => void;
    registerSetQuestion((qa, newmode) => {
        currentquestion = qa;
        mode = newmode;
    });
    console.log(questions)
    const answer = (correct: boolean) => {
        mode = null;
        currentquestion = null;
        setTimeout(() => onanswer(correct), 220);
    };
    let currentquestion: { q: string; a: string } | null = null;
    // awaits parent interaction (setquestion)
    let mode: mode | null = null;
</script>

{#if currentquestion != null && mode != null}
    {#if mode === "flashcard"}
        <Flashcard {answer} currentquestion={currentquestion} />
    {:else if mode === "multiple choice"}
        <MultiChoice {answer} questions={questions} currentquestion={currentquestion} />
    {:else if mode === "short answer"}
        <ShortAns {answer} currentquestion={currentquestion} />
    {:else}
        error
    {/if}
{/if}
