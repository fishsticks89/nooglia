<script lang="ts">
    export let style: string = '';
</script>
    
<button style={style} on:click><slot>Button</slot></button>
    
<style>
    button {
        border: 0px;
        
        border-radius: 100vmax;
        background-color: rgba(255, 255, 255, 0.2);
        backdrop-filter: saturate(100%);
        margin: 0px;
        padding: 0.5rem;
        min-width: 5rem;
        width: fit-content;
        height: fit-content;
    }
    button:focus-visible {
        outline: 0px;
    }
</style>