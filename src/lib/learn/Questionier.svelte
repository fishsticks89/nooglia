<script lang="ts">
	import Flashcard from './questions/Flashcard.svelte';
    import type { mode } from "$lib/learn/questiontype";
    // exposed to questions
    export let onanswer: (correct: boolean) => void;
    export let questions: { q: string; a: string }[];
    let currentquestion: { q: string; a: string };
    // awaits parent interaction (setquestion)
    let mode: mode = "flashcard";
    let show: boolean = false;

    export const setQuestion = (qa: { q: string; a: string }, mode: mode) => {
        currentquestion = qa
        mode = mode;
        show = true;
    };
</script>

{#if show}
    {#if mode === "flashcard"}
        <Flashcard {onanswer} {questions} {currentquestion} />
    {:else if mode === "multiple choice"}
    {:else if mode === "short answer"}
    {/if}
{/if}
