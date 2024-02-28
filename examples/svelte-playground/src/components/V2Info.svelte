<script lang="ts">
  export let v2TokenId: string;
  export let v2LastMint: string;
  export let v2OwnTokenBalance: string;
  export let v2MintableAmount: string;
</script>
<fieldset>
  <legend>v2 info:</legend>
  <label for="v2TokenId">Token id:</label>
  <input id="v2TokenId" readonly type="text" value={v2TokenId} />
  <br />
  <label for="v2MintableAmount">Mintable amount:</label>
  <input id="v2MintableAmount" readonly type="text" value={v2MintableAmount} />
  <br />
  <label for="v2LastMint">Last mint:</label>
  <input id="v2LastMint" readonly type="text" value={v2LastMint} />
  <br />
  <label for="v2OwnTokenBalance">Own token balance:</label>
  <input id="v2OwnTokenBalance" readonly type="text" value={v2OwnTokenBalance} />
</fieldset>