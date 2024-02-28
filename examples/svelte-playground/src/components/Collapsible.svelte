<script lang="ts">
    export let label: string;
    export let isOpen = false; // Manage open/close state internally
    export let isLocked = false; // Lock the section closed

    function toggle() {
        isOpen = !isOpen;
    }
</script>

<style>
    .collapsible-section {
        margin-bottom: 1rem;
    }

    /*.section-header {*/
    /*    background-color: #f0f0f0;*/
    /*    padding: 10px;*/
    /*    font-weight: bold;*/
    /*    cursor: pointer;*/
    /*}*/

    .section-content {
        padding: 10px;
        background-color: #f9f9f9;
        border-top: 1px solid #ddd;
        display: none;
    }

    .section-content.open {
        display: block;
    }

    .locked {
        cursor: not-allowed;
        background: #6c757d;
        color: #fff;
    }
</style>

<div class="collapsible-section">
    <div class:locked={isLocked}
         class="section-header"
         on:click={toggle}>{label}</div>
    {#if isOpen && !isLocked}
        <div class="section-content open">
            <slot/>
        </div>
    {/if}
</div>
