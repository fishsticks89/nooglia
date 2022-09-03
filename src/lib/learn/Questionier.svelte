<script lang="ts">
    import type { mode } from "$lib/learn/questiontype";
    export let questions: { q: string; a: string }[];
    export let onanswer: (correct: boolean) => void;
    let question: string = "";
    let answer: string = "";
    let show: boolean = false;
    let mode: mode = "flashcard";

    export const setQuestion = (qa: { q: string; a: string }, mode: mode) => {
        question = qa.q;
        answer = qa.a;
        mode = mode;
        show = true;
    };
</script>

{#if show}
    {#if mode === "flashcard"}
        flashcard {mode} {question} {answer}
    {:else if mode === "multiple choice"}
        mchoice {mode} {question} {answer}
    {:else if mode === "short answer"}
        sa {mode} {question} {answer}
    {/if}
{/if}
