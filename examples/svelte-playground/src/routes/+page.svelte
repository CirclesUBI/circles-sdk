<script lang="ts">
  import AnvilInfo, { type BlockInfo } from '../components/AnvilInfo.svelte';

  import { Avatar, Sdk } from '@circles-sdk/sdk/dist/sdk/src';
  import AvatarComponent from '../components/Avatar.svelte';
  import { ethers, HDNodeWallet } from 'ethers';
  import HorizontalLayout from '../components/HorizontalLayout.svelte';
  import Collapsible from '../components/Collapsible.svelte';
  import { EoaEthersProvider } from '@circles-sdk/providers/dist';
  import PromiseButton from '../components/ActionButton.svelte';
  import EventList, { subscribeAvatar } from '../components/EventList.svelte';
  import { onMount } from 'svelte';

  const rpcUrl = 'https://rpc.gnosis.gateway.fm';

  const hubv1Address = '0x29b9a7fBb8995b2423a71cC17cf9810798F6C543';
  const hubv2Address = '0xb3389C1759ce8E11dBed22ad96B44E706cc0E3eb';

  const jsonRpcProvider = new ethers.JsonRpcProvider(rpcUrl);
  const mainWallet = new ethers.Wallet('', jsonRpcProvider);


  const onBlockInfo = async (e: CustomEvent<BlockInfo>) => {
    console.log(e.detail);
  };

  let avatars: Avatar[] = [];

  onMount(async () => {
    const index = localStorage.getItem('avatars') || '[]';
    const addresses = JSON.parse(index);
    for (const address of addresses) {
      const avatarRecord = JSON.parse(localStorage.getItem(`avatar_${address}`) || '');
      if (!avatarRecord.privateKey) {
        continue;
      }
      const jsonRpcProvider = new ethers.JsonRpcProvider(rpcUrl);
      const ethersWallet = new ethers.Wallet(avatarRecord.privateKey, jsonRpcProvider);
      const provider = new EoaEthersProvider(jsonRpcProvider, ethersWallet);
      const sdk = new Sdk(hubv1Address, hubv2Address, provider);
      const avatar = await sdk.getAvatar(address);
      await avatar.initialize();

      subscribeAvatar(avatar);

      avatars = [...avatars, avatar];
    }
  });

  const createAvatar = async () => {
    const jsonRpcProvider = new ethers.JsonRpcProvider(rpcUrl);
    const subWallet = await randomFundedWallet(jsonRpcProvider);
    const provider = new EoaEthersProvider(jsonRpcProvider, subWallet);
    const sdk = new Sdk(hubv1Address, hubv2Address, provider);
    const avatar = await sdk.getAvatar(await subWallet.getAddress());
    await avatar.initialize();

    localStorage.setItem(`avatar_${await subWallet.getAddress()}`, JSON.stringify({
      address: await subWallet.getAddress(),
      privateKey: subWallet.privateKey
    }));

    const index = localStorage.getItem('avatars') || '[]';
    localStorage.setItem('avatars', JSON.stringify([...JSON.parse(index), await subWallet.getAddress()]));

    subscribeAvatar(avatar);

    avatars = [...avatars, avatar];
  };


  const skipDays = async (days: number) => {
    const jsonRpcProvider = new ethers.JsonRpcProvider(rpcUrl);
    await jsonRpcProvider.send('evm_increaseTime', [days * 24 * 60 * 60]);
    await jsonRpcProvider.send('evm_mine', []);
  };

  const skipSeconds = async (seconds: number) => {
    const jsonRpcProvider = new ethers.JsonRpcProvider(rpcUrl);
    await jsonRpcProvider.send('evm_increaseTime', [seconds]);
    await jsonRpcProvider.send('evm_mine', []);
  };

  export const randomFundedWallet = async (jsonRpcProvider: ethers.JsonRpcProvider): Promise<HDNodeWallet> => {
    const subWallet = ethers.Wallet.createRandom().connect(jsonRpcProvider);
    const tx = await mainWallet.sendTransaction({
      to: subWallet.address,
      value: ethers.parseEther('0.0075')
    });
    await tx.wait();
    return subWallet;
  };
</script>
<!--<AnvilInfo on:newBlock={onBlockInfo} />-->
<Collapsible label={`Tools`} isOpen={true}>
  <PromiseButton action={() => createAvatar()}>
    Create Avatar
  </PromiseButton>
  <PromiseButton action={() => skipSeconds(60*60)}>
    Skip 1 hour &gt;&gt;
  </PromiseButton>
  <PromiseButton action={() => skipDays(1)}>
    Skip 1 day &gt;&gt;
  </PromiseButton>
  <PromiseButton action={() => skipDays(7)}>
    Skip 7 days &gt;&gt;
  </PromiseButton>
</Collapsible>
<HorizontalLayout>
  <EventList />
  {#each avatars as avatar}
    <AvatarComponent {avatar} />
  {/each}
</HorizontalLayout>
<!--
<h1>v1</h1>
<V1Info v1LastMint="0" v1MintableAmount="0" v1OwnTokenBalance="0" v1TokenAddress="0" />
<V1Actions address="0" isStopped={true} />
<h1>v2</h1>
<V2Info v2LastMint="0" v2MintableAmount="0" v2OwnTokenBalance="0" v2TokenId="0" />
<V2Actions address="0" isStopped={true} />
-->