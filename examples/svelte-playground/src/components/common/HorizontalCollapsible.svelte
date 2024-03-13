<script lang="ts">
  export let label: string;
  export let isOpen = false; // Manage open/close state internally
  export let isLocked = false; // Lock the section closed

  export let headerBackgroundColor = '#c4c4c4';

  export let headerTextColor = '#000000';

  function toggle() {
    if (!isLocked) {
      isOpen = !isOpen;
    }
  }
</script>

<style>
    .collapsible-section {
        display: flex;
    }

    .section-header {
        writing-mode: vertical-lr;
        transform: rotate(180deg);
        cursor: pointer;
        border: #6c757d 1px solid;
        padding: 10px;
        user-select: none;
        text-align: right;
    }

    .section-header.locked {
        cursor: not-allowed;
        background: #6c757d;
    }

    .section-content {
        padding: 10px;
        background-color: #f9f9f9;
        border-left: 1px solid #ddd;
        display: none;
        width: 100%; /* Ensure it expands to the right */
    }

    .section-content.open {
        display: block;
    }
</style>

<div class="collapsible-section">
  <div class:locked={isLocked}
       class="section-header"
       style="background-color: {headerBackgroundColor}; color: {headerTextColor};"

       on:click={toggle}>{label}</div>
  {#if isOpen && !isLocked}
    <div class="section-content open">
      <slot/>
    </div>
  {/if}
</div>
