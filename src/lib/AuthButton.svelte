<script lang="ts">
    export let oncl: () => void;
    export let posStyle: string = "";
    export let text = "Library";
    import { authState } from "$lib/state";
    import { fly } from "svelte/transition";
    import { signin } from "./signin";
    $: pfp = $authState ? $authState?.photoURL : null;
    let showpfp = true;
</script>

<div
    class="pos"
    style={posStyle}
    on:click={$authState
        ? oncl
        : () => {
              signin();
          }}
>
    {#if $authState}
          {#if (showpfp && pfp)}
        <img on:error={() => {showpfp = false}} in:fly={{ duration: 600, y: 200 }} src={pfp} alt="" />
        <div in:fly={{ duration: 600, y: 200 }} class="vr" />
        {/if}
        {#key text}
        <p in:fly={{ duration: 600, y: 200 }}>{text}</p>
        {/key}
    {:else}
        Sign In
    {/if}
</div>

<style>
    p {
        width: 55px;
    }
    img {
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        border: 0px;
        outline: 0px;
    }
    .vr {
        height: 40%;
        width: 1.5px;
        background-color: rgba(255, 255, 255, 0.427);
    }
    .pos {
        cursor: pointer;
        width: 8.5rem;
        height: 3rem;
        padding: 0px;
        background-color: var(--accent);
        border-radius: var(--round);

        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-evenly;
    }
</style>
