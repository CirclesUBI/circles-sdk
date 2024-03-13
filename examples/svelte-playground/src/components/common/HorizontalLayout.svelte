<script lang="ts">
  export let minWidth: string = '100px'; // Default minimum width for each element
</script>

<style>
    .horizontal-layout {
        display: flex;
        flex-wrap: nowrap;
        overflow-x: auto;
        align-items: stretch; /* Ensures the height is as high as the tallest content */
        gap: 10px; /* Optional: Adds some space between elements */
    }

    .horizontal-layout > * {
        flex: 0 0 auto; /* Prevents the elements from shrinking and respects the minWidth */
        min-width: var(--min-width); /* Uses the --min-width variable for minimum width */
    }
</style>

<div class="horizontal-layout" style="--min-width: {minWidth};">
  <slot></slot>
</div>
