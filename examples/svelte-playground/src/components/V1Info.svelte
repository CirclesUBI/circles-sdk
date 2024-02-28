<script lang="ts">
  export let v1TokenAddress: string;
  export let v1LastMint: string;
  export let v1OwnTokenBalance: string;
  export let v1MintableAmount: string;
</script>
<fieldset>
  <legend>v1 info:</legend>
  <label for="v1TokenAddress">Token address:</label>
  <input id="v1TokenAddress" readonly type="text" value={v1TokenAddress} />
  <br />
  <label for="v1MintableAmount">Mintable amount:</label>
  <input id="v1MintableAmount" readonly type="text" value={v1MintableAmount} />
  <br />
  <label for="v1LastMint">Last mint:</label>
  <input id="v1LastMint" readonly type="text" value={v1LastMint} />
  <br />
  <label for="v1OwnTokenBalance">Own token balance:</label>
  <input id="v1OwnTokenBalance" readonly type="text" value={v1OwnTokenBalance} />
</fieldset>