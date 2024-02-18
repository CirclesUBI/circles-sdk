<script lang="ts">
    import {onMount} from 'svelte';
    import {Observable, Sdk, V1Hub} from '@circles-sdk/sdk/dist';
    import {EoaEthersProvider} from '@circles-sdk/providers/dist';
    import {ethers} from "ethers";
    import {type Avatar, AvatarState} from "@circles-sdk/sdk/dist/avatar";

    const rpcUrl = 'http://localhost:8545';
    const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
    const jsonRpcProvider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, jsonRpcProvider);
    const provider = new EoaEthersProvider(jsonRpcProvider, wallet);

    const v1HubAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
    const v1Hub = new V1Hub(provider, v1HubAddress);

    const v2HubAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';


    let avatar: Avatar;
    let state: Observable<AvatarState>;

    onMount(async () => {
        await provider.initialize();

        const sdk = new Sdk(v1HubAddress, v2HubAddress, provider);

        avatar = await sdk.getAvatar(wallet.address)
        state = avatar.state;

        await avatar.initialize();
    });

    const registerV1Human = async () => {
        const receipt = await v1Hub.signup();
        console.log(receipt);
        await avatar.initialize();
    }

    const stopV1 = async () => {
        const receipt = await avatar.stopV1();
        console.log(receipt);
    }

    const registerV2Human = async () => {
        const receipt = await avatar.registerHuman("QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB");
        console.log(receipt);
    }

    const personalMint = async () => {
        const receipt = await avatar.personalMint();
        console.log(receipt);
    }
</script>
{#if avatar}
    <fieldset>
        <legend>Avatar</legend>
        <p>Address: {avatar.address}</p>
        <p>
            Balance:
            {#await (avatar.getTokenBalance())}
            {:then balance}
                {balance}
            {:catch error}
                {error}
            {/await}
        </p>
        <p>
            State: {$state}
        </p>
    </fieldset>
    {#if $state === AvatarState.Unregistered}
        Avatar is not yet registered<br/>
        <button on:click={registerV1Human}>Register v1 human</button>
    {:else if $state === AvatarState.V1_StoppedHuman}
        Avatar is v1 only and the minting is stopped<br/>
        <button on:click={registerV2Human}>Register v2 human</button>
    {:else if $state === AvatarState.V1_Human}
        Avatar is a v1 human.<br/>
        <button on:click={stopV1}>Stop v1 token</button><br/>
        <button on:click={personalMint}>Mint outstanding personal tokens</button>
    {:else if $state === AvatarState.V1_Organization}
        Avatar is a v1 organization
    {:else if $state === AvatarState.V2_Human}
        Avatar is a v2 human<br/>
        <button on:click={personalMint}>Mint outstanding personal tokens</button>
    {:else if $state === AvatarState.V2_Organization}
        Avatar is a v2 organization
    {:else if $state === AvatarState.V2_Group}
        Avatar is a v2 group
    {:else if $state === AvatarState.V1_StoppedHuman_and_V2_Human}
        Avatar is a v2 human and has a stopped v1 token<br/>
        <button on:click={personalMint}>Mint outstanding personal tokens</button>
    {/if}
{/if}