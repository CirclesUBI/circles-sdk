<script lang="ts">
  import { Sdk } from '@circles/circles-sdk-v2/dist';
  import { EoaEthersProvider, Provider } from '@circles/circles-sdk-v2-providers/dist';
  import { ethers } from 'ethers';
  import { onMount } from 'svelte';

  const rpcUrl = 'http://localhost:8545';
  const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
  const v1HubAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
  const v2HubAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

  const jsonRpcProvider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, jsonRpcProvider);

  const provider: Provider = new EoaEthersProvider(jsonRpcProvider, wallet);
  const sdk = new Sdk(v1HubAddress, v2HubAddress, provider);

  let avatar;

  onMount(async () => {
    await provider.init();

    avatar = await sdk.createAvatar(wallet.address);
    await avatar.init();
  });
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>
