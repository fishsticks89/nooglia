<h2>Importing from quizlet</h2>
<button on:click={() => {window.location.replace("./learn")}}>Get Started</button>
<p>To import a set from quizlet, click the three little dots, and then the export button</p>
<img src="./export.png" alt="">
<p>Then, copy the text and paste it into Openlearn (make sure the dropdown in the top left is set to "Tab")!</p>
<style>
    h2 {
        margin: 0rem;
        padding: 2rem;
        font-size: calc(2vw + 1rem);
        position: relative;
    }
    button {
        background-color: var(--accent);
        border-radius: var(--round);
        border: 0px;
        color: white;
        font-size: 3vw;
        padding: 1.4rem;
        position: fixed;
        bottom: 3rem;
        right: 3rem;
        font-weight: 500;
        font-family: 'HermesLight';
        font-weight: bold;
        letter-spacing: 0.2vw;
    }
    img {
        max-width: 20rem;
        width: 70vw;
    }
    img, p {
        margin-left: 2rem
    }
</style>