<script lang="ts">
</script>

<style>
    .list-item {
        display: grid;
        grid-template-columns: repeat(5, 1fr); /* Allocates equal width to each piece of data */
        gap: 8px; /* Adjusts space between columns */
        padding: 8px; /* Provides internal space within each item */
        align-items: center; /* Vertically aligns content in each cell */
        border-bottom: 1px solid #eee; /* Adds a subtle separator */
        font-size: 0.8rem; /* Reduces font size for compactness */
    }

    .list-item > div {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis; /* Ensures the content does not overflow */
    }
</style>

<div class="list-item">
  <div title="Timestamp">Timestamp</div>
  <div title="Tx hash">Tx hash</div>
  <div title="From">From</div>
  <div title="To">To</div>
  <div title="Value">Amount</div>
</div>
