<script lang="ts">
	import { spring } from "svelte/motion";

    export let on: boolean = false;
    export let lightBackground = false;
    export let onChange = (pos: boolean) => {

    }
    const spr = spring(+on, {
        damping: 0.6,
        stiffness: 0.2,
        precision: 0.01,
    })
    $: spr.set(+on);
</script>

<div class="outer" style:background-color={(lightBackground) ? "var(--glass)" : "var(--emp)"} on:click={() => {
    onChange(!on);
}}>
    <div class="propopen"/>
    <div class="outer blue" style:width={$spr * 2.7 + "rem"}></div>
    <div class="inner" style:left={($spr * 1.6 - 0.2).toString() + "rem"} />
</div>
    
<style>
    .propopen {
        width: 2.8rem;
    }
    .outer {
        margin: 0rem 0.7rem;
        position: relative;
        width: 2.8rem;
        height: 1.2rem;
        background-color: var(--emp);
        border: 0px solid var(--light);
        border-radius: 100vmax;
        cursor: pointer;
    }
    .blue {
        margin: 0px;
        background-color: var(--accent);
        opacity: 95%;
    }
    .inner {
        position: absolute;
        top: 50%;
        left: -0.2rem;
        transform:translateY(-50%);
        width: 1.5rem;
        height: 1.5rem;
        border: 0px;
        border-radius: 100vmax;
        background-color: var(--light);
    }
</style>