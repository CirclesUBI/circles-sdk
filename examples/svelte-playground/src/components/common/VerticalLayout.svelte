<script lang="ts">
  export let minHeight: string = '42px'; // Default minimum height for each element
</script>

<style>
    .vertical-layout {
        display: flex;
        flex-direction: column; /* Stacks elements vertically */
        overflow-y: auto; /* Allows vertical scrolling */
        width: 100%; /* Ensures the container takes up all available width */
        gap: 10px; /* Optional: Adds some space between elements */
    }

    .vertical-layout > * {
        width: 100%; /* Each child takes up 100% of the container's width */
        min-height: var(--min-height); /* Uses the --min-height variable for minimum height */
    }
</style>

<div class="vertical-layout" style="--min-height: {minHeight};">
  <slot></slot>
</div>
