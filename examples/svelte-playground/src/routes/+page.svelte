<script lang="ts">
  import { Avatar, Sdk } from '@circles-sdk/sdk/dist/sdk/src';
  import AvatarComponent from '../components/avatar/Avatar.svelte';
  import { ethers, HDNodeWallet } from 'ethers';
  import HorizontalLayout from '../components/common/HorizontalLayout.svelte';
  import VerticalCollapsible from '../components/common/VerticalCollapsible.svelte';
  import { EoaEthersProvider } from '@circles-sdk/providers/dist';
  import PromiseButton from '../components/common/ActionButton.svelte';
  import EventList, { subscribeAvatar } from '../components/EventList.svelte';
  import { onMount } from 'svelte';
  import HorizontalCollapsible from '../components/common/HorizontalCollapsible.svelte';
  import { AvatarState } from '@circles-sdk/sdk/dist/sdk/src/avatar';

  let environment = 'gnosisChain';
  const environments = {
    gnosisChain: {
      rpcUrl: 'https://circles-rpc.circlesubi.id',
      hubv1Address: '0x29b9a7fBb8995b2423a71cC17cf9810798F6C543',
      hubv2Address: '0xb3389C1759ce8E11dBed22ad96B44E706cc0E3eb',
      mainWallet: ''
    },
    anvil: {
      rpcUrl: 'http://localhost:8545',
      hubv1Address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
      hubv2Address: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
      mainWallet: 'ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
    }
  };

  let chainId: number = 0;
  let avatars: Avatar[] = [];

  async function onEnvironmentChange() {
    localStorage.setItem('environment', environment);
    await Initialize();
  }

  function migrateLocalStorage() {
    const newEntries = {};
    const newIndex = [];

    if (!localStorage.getItem('v0.2')) {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key === 'avatars') {
          continue;
        }
        const newKey = key.replace('avatar_', '');
        newEntries[`${chainId}_${newKey}`] = localStorage.getItem(key);
        newIndex.push(`${chainId}_${newKey}`);
      }

      for (const key in newEntries) {
        localStorage.setItem(key, newEntries[key]);
      }
      localStorage.setItem(`${chainId}_avatars`, JSON.stringify(newIndex));
      localStorage.setItem('v0.2', 'true');
    }
  }

  async function Initialize() {
    avatars = [];
    environment = localStorage.getItem('environment') || 'anvil';
    const jsonRpcProvider = new ethers.JsonRpcProvider(environments[environment].rpcUrl);
    chainId = (await jsonRpcProvider.getNetwork()).chainId;

    migrateLocalStorage();

    const index = localStorage.getItem(`${chainId}_avatars`) || '[]';
    const avatarIds = JSON.parse(index);
    for (const avatarId of avatarIds) {
      const avatarRecord = JSON.parse(localStorage.getItem(avatarId) || '');
      if (!avatarRecord.privateKey) {
        continue;
      }
      const jsonRpcProvider = new ethers.JsonRpcProvider(environments[environment].rpcUrl);
      const ethersWallet = new ethers.Wallet(avatarRecord.privateKey, jsonRpcProvider);
      const provider = new EoaEthersProvider(jsonRpcProvider, ethersWallet);
      const sdk = new Sdk(environments[environment].hubv1Address, environments[environment].hubv2Address, provider);
      const avatar = await sdk.getAvatar(avatarId.replace(`${chainId}_`, ''));
      await avatar.initialize();

      subscribeAvatar(avatar);

      avatars = [...avatars, avatar];
    }
  }

  onMount(async () => {
    await Initialize();
  });

  const createAvatar = async () => {
    const jsonRpcProvider = new ethers.JsonRpcProvider(environments[environment].rpcUrl);
    const subWallet = await randomFundedWallet(jsonRpcProvider);
    const provider = new EoaEthersProvider(jsonRpcProvider, subWallet);
    const sdk = new Sdk(environments[environment].hubv1Address, environments[environment].hubv2Address, provider);
    const avatar = await sdk.getAvatar(await subWallet.getAddress());
    await avatar.initialize();

    const avatarKey = `${chainId}_${await subWallet.getAddress()}`;
    const avatarIndexKey = `${chainId}_avatars`;

    localStorage.setItem(avatarKey, JSON.stringify({
      address: await subWallet.getAddress(),
      privateKey: subWallet.privateKey
    }));

    const index = localStorage.getItem(avatarIndexKey) || '[]';
    localStorage.setItem(`${chainId}_avatars`, JSON.stringify([...JSON.parse(index), avatarKey]));

    subscribeAvatar(avatar);

    avatars = [...avatars, avatar];
  };


  const skipDays = async (days: number) => {
    const jsonRpcProvider = new ethers.JsonRpcProvider(environments[environment].rpcUrl);
    await jsonRpcProvider.send('evm_increaseTime', [days * 24 * 60 * 60]);
    await jsonRpcProvider.send('evm_mine', []);
  };

  const skipSeconds = async (seconds: number) => {
    const jsonRpcProvider = new ethers.JsonRpcProvider(environments[environment].rpcUrl);
    await jsonRpcProvider.send('evm_increaseTime', [seconds]);
    await jsonRpcProvider.send('evm_mine', []);
  };

  export const randomFundedWallet = async (jsonRpcProvider: ethers.JsonRpcProvider): Promise<HDNodeWallet> => {
    const subWallet = ethers.Wallet.createRandom().connect(jsonRpcProvider);
    const mainWallet = new ethers.Wallet(environments[environment].mainWallet, jsonRpcProvider);
    const tx = await mainWallet.sendTransaction({
      to: subWallet.address,
      value: ethers.parseEther('0.0075')
    });
    await tx.wait();
    return subWallet;
  };

  async function exportData() {
    // Export the complete local storage
    const data = JSON.stringify(localStorage);
    console.log(data);

    // Create a blob and download it
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'circles-export.json';
    a.click();
  }

  async function importData() {
    // Import the complete local storage
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) {
        return;
      }
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = e.target?.result;
        if (typeof data !== 'string') {
          return;
        }
        const parsed = JSON.parse(data);
        for (const key in parsed) {
          localStorage.setItem(key, parsed[key]);
        }
        location.reload();
      };
      reader.readAsText(file);
    };
    input.click();
  }

  let textColorByState = (avatar: Avatar) => {
    if (avatar.state.value === AvatarState.V2_Human
      || avatar.state.value === AvatarState.V2_Group
      || avatar.state.value === AvatarState.V2_Organization
      || avatar.state.value === AvatarState.V1_StoppedHuman_and_V2_Human) {
      return 'var(--green-extra-dark)';
    }
    if (avatar.state.value === AvatarState.V1_Human
      || avatar.state.value === AvatarState.V1_Organization
      || avatar.state.value === AvatarState.V1_StoppedHuman) {
      return 'var(--blue-extra-dark)';
    }
  };
  let backgroundColorByState = (avatar: Avatar) => {
    return 'var(--grey-extra-light)';
  };
  let titleByState = (avatar: Avatar) => {
    const shortenedAddress = avatar.address.trim().slice(0, 8) + '...' + avatar.address.trim().slice(-8);
    const isV1 = avatar.state.value === AvatarState.V1_Human
      || avatar.state.value === AvatarState.V1_Organization
      || avatar.state.value === AvatarState.V1_StoppedHuman;
    const isV2 = avatar.state.value === AvatarState.V2_Human
      || avatar.state.value === AvatarState.V2_Group
      || avatar.state.value === AvatarState.V2_Organization
      || avatar.state.value === AvatarState.V1_StoppedHuman_and_V2_Human;
    let versionPrefix = isV1 ? 'V1' : isV2 ? 'V2' : '';
    const isHuman = avatar.state.value === AvatarState.V1_Human
      || avatar.state.value === AvatarState.V2_Human
      || avatar.state.value === AvatarState.V1_StoppedHuman_and_V2_Human;
    const isOrganization = avatar.state.value === AvatarState.V1_Organization
      || avatar.state.value === AvatarState.V2_Organization;
    const isGroup = avatar.state.value === AvatarState.V2_Group;
    let typeSuffix = isHuman ? 'Human' : isOrganization ? 'Organization' : isGroup ? 'Group' : '';
    if (typeSuffix === '') {
      typeSuffix = 'Unregistered';
    }
    if (versionPrefix !== '') {
      versionPrefix = ` ${versionPrefix}`;
    }
    return `${shortenedAddress} (${typeSuffix}) ${versionPrefix}`;
  };
</script>
<VerticalCollapsible label="Circles SDK Example Application" isOpen={true}>
  <PromiseButton action={() => createAvatar()}>
    Create Avatar
  </PromiseButton>
  <PromiseButton action={() => exportData()}>
    Export
  </PromiseButton>
  <PromiseButton action={() => importData()}>
    Import
  </PromiseButton>
  <select style="width: 150px; display: inline-block;" bind:value={environment}
          on:change={onEnvironmentChange}>
    {#each Object.keys(environments) as env}
      <option value={env}>{env}</option>
    {/each}
  </select>
  {#if environment === 'anvil'}
    <PromiseButton action={() => skipSeconds(60*60)}>
      Skip 1 hour &gt;&gt;
    </PromiseButton>
    <PromiseButton action={() => skipDays(1)}>
      Skip 1 day &gt;&gt;
    </PromiseButton>
    <PromiseButton action={() => skipDays(7)}>
      Skip 7 days &gt;&gt;
    </PromiseButton>
  {/if}
</VerticalCollapsible>
<HorizontalLayout>
  <EventList />
  {#each avatars as avatar}
    <HorizontalCollapsible label={titleByState(avatar)} isOpen={true}
                           headerTextColor={textColorByState(avatar)}
                           headerBackgroundColor={backgroundColorByState(avatar)}>
      <AvatarComponent {avatar} />
    </HorizontalCollapsible>
  {/each}
</HorizontalLayout>