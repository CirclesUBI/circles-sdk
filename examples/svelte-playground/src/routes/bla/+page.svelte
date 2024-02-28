<script lang="ts">
    import V1Actions from '../../components/V1Actions.svelte';
    import V1Info from '../../components/V1Info.svelte';
    import V2Actions from '../../components/V2Actions.svelte';
    import V2Info from '../../components/V2Info.svelte';
    import AvatarActions from '../../components/AvatarActions.svelte';
    import AvatarInfo from '../../components/AvatarInfo.svelte';
    import AnvilInfo, {type BlockInfo} from '../../components/AnvilInfo.svelte';

    import {Avatar, Sdk} from '@circles-sdk/sdk/dist/sdk/src';
    import {ethers, type Signer, Wallet} from 'ethers';
    import HorizontalLayout from '../../components/HorizontalLayout.svelte';
    import Collapsible from '../../components/Collapsible.svelte';
    import {EoaEthersProvider} from "@circles-sdk/providers/dist";
    import PromiseButton from "../../components/ActionButton.svelte";
    import EventList, {addAvatar} from "../../components/EventList.svelte";

    const rpcUrl = 'http://localhost:8545/';

    const hubv1Address = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
    const hubv2Address = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

    const jsonRpcProvider = new ethers.JsonRpcProvider('http://localhost:8545/');
    const mainWallet = new ethers.Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', jsonRpcProvider);


    const onBlockInfo = async (e: CustomEvent<BlockInfo>) => {
        console.log(e.detail);
    }

    let avatars: Avatar[] = [];

    const createAvatar = async () => {
        const jsonRpcProvider = new ethers.JsonRpcProvider(rpcUrl);
        const subWallet = await randomFundedWallet(jsonRpcProvider);
        const provider = new EoaEthersProvider(jsonRpcProvider, subWallet);
        const sdk = new Sdk(hubv1Address, hubv2Address, provider);
        const avatar = await sdk.getAvatar(await subWallet.getAddress());
        await avatar.initialize();

        addAvatar(avatar);

        avatars = [...avatars, avatar];
    }


    const skipDays = async (days: number) => {
        const jsonRpcProvider = new ethers.JsonRpcProvider(rpcUrl);
        await jsonRpcProvider.send('evm_increaseTime', [days * 24 * 60 * 60]);
        await jsonRpcProvider.send('evm_mine', []);
    }

    export const randomFundedWallet = async (jsonRpcProvider: ethers.JsonRpcProvider): Promise<Signer> => {
        const subWallet = ethers.Wallet.createRandom().connect(jsonRpcProvider);
        const tx = await mainWallet.sendTransaction({
            to: subWallet.address,
            value: ethers.parseEther("1")
        });
        await tx.wait();
        return subWallet;
    };
</script>
<AnvilInfo on:newBlock={onBlockInfo}/>
<Collapsible label={`Tools`} isOpen={true}>
    <PromiseButton action={() => createAvatar()}>
        Create Avatar
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
        <div>
            <AvatarInfo {avatar}/>
            <AvatarActions {avatar}/>
        </div>
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