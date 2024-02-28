<script lang="ts">
    export let from: string;
    export let to: string;
    export let amount: string;
    export let txHash: string;
    export let timestamp: string;
</script>
<div>
    <div class="form-group">
        <label for="timestamp">Timestamp:</label>
        <input type="text" readonly class="form-control" id="timestamp" name="timestamp" placeholder="0"
               value={timestamp}>
    </div>
    <div class="form-group">
        <label for="txHash">Tx hash:</label>
        <input type="text" readonly class="form-control" id="txHash" name="txHash" placeholder="0" value={txHash}>
    </div>
    <div class="form-group">
        <label for="from">From:</label>
        <input type="text" readonly class="form-control" id="from" name="from" placeholder="0x..." value={from}>
    </div>
    <div class="form-group">
        <label for="to">To:</label>
        <input type="text" readonly class="form-control" id="to" name="to" placeholder="0x..." value={to}>
    </div>
    <div class="form-group">
        <label for="value">Value:</label>
        <input type="text" readonly class="form-control" id="value" name="value" placeholder="0" value={amount}>
    </div>
</div>