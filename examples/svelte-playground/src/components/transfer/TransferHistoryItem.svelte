<script lang="ts">
  export let from: string;
  export let to: string;
  export let amount: string;
  export let txHash: string;
  export let timestamp: string;
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
  <div title="Timestamp: {timestamp}">{timestamp}</div>
  <div title="Tx hash: {txHash}">{txHash}</div>
  <div title="From: {from}">{from}</div>
  <div title="To: {to}">{to}</div>
  <div title="Value: {amount}">{amount}</div>
</div>
