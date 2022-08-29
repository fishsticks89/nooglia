<script lang="ts">
</script>

<h1>Open&#8203;Learn</h1>
<h2>Quizlet learn but freer</h2>
<button on:click={() => {window.location.replace("./learn")}}>Get Started</button>

<img on:click={() => {window.location.replace("https://github.com/fishsticks89/openlearn")}} style={"cursor: pointer;border-radius: 50%;filter: invert();position: fixed;right: 1rem;top: 1rem;width: 2rem;height: 2rem;"} src="./ghlogo.png" alt="" srcset="">

<style>
    h1 {
        font-size: 15vw;
        margin: 0px;
        width: 60vw;
        padding: 2rem;
        padding-top: 1rem;
        padding-bottom: 0rem;
    }
    h2 {
        padding: 3rem;
        margin: 0px;
        padding: calc(2rem + 1vw);
        padding-top: 3vh;
        padding-bottom: 0px;
        font-size: calc(2vw + 1rem);
        position: relative;
    }
    button {
        background-color: var(--accent);
        border-radius: var(--round);
        border: 0px;
        color: white;
        padding: 1.3rem;
        padding-inline: 2.7rem;
        position: fixed;
        bottom: 3rem;
        right: 3rem;

        font-size: 1rem;
        font-weight: 500;
        font-family: 'OpenSans', sans-serif;
        /* font-weight: bold; */
        /* letter-spacing: 0.2vw; */
    }
</style>
