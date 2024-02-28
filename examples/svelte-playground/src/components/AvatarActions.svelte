<script lang="ts">
    import {Avatar} from '@circles-sdk/sdk/dist/sdk/src';
    import {AvatarState} from '@circles-sdk/sdk/dist/sdk/src/avatar';
    import Collapsible from "./Collapsible.svelte";
    import ActionButton from "./ActionButton.svelte";
    import Transfer from "./Transfer.svelte";
    import HorizontalLayout from "./HorizontalLayout.svelte";
    import TransferHistoryItem from "./TransferHistoryItem.svelte";
    import Trust from "./Trust.svelte";
    import InviteHuman from "./InviteHuman.svelte";

    export let avatar: Avatar;

    type TransferHistoryItem = {
        from: string;
        to: string;
        amount: string;
        timestamp: string;
        txHash: string;
    };
    const transferHistory: TransferHistoryItem[] = [];

    const signupV1 = async () => {
        await avatar.v1Hub.signup();
        await avatar.initialize();
    };

    const defaultProfile = "QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB";

    $: avatarState = avatar.state;
    $: isV1 = $avatarState === AvatarState.V1_Human
        || $avatarState === AvatarState.V1_StoppedHuman_and_V2_Human
        || $avatarState === AvatarState.V1_StoppedHuman
        || $avatarState === AvatarState.V1_Organization;
    $: isV2 = $avatarState === AvatarState.V2_Human
        || $avatarState === AvatarState.V2_Group
        || $avatarState === AvatarState.V2_Organization
        || $avatarState === AvatarState.V1_StoppedHuman_and_V2_Human;
    $: isHuman = $avatarState && avatar.isHuman();
    $: isRegistered = $avatarState && avatar.isRegistered();
    $: canTrust = $avatarState && avatar.isRegistered();
    $: canTransfer = $avatarState && avatar.canTransfer();
    $: canInvite = $avatarState && avatar.canInvite();
    $: canMint = $avatarState && avatar.canMint();
    $: isGroup = $avatarState && avatar.isGroup();
    $: isOrganization = $avatarState && avatar.isOrganization();
</script>
<Collapsible label="Signup" isOpen={!isRegistered || $avatarState === AvatarState.V1_StoppedHuman}>
    <ActionButton disabled={isV1}
                  action={signupV1}>Signup @ v1
    </ActionButton>

    <ActionButton disabled={isV2 || $avatarState !== AvatarState.V1_StoppedHuman}
                  action={() => avatar.registerHuman(defaultProfile)}>Signup @ v2
    </ActionButton>
</Collapsible>
<Collapsible label="Actions" isOpen={isRegistered}>
    <ActionButton disabled={$avatarState !== AvatarState.V1_Human}
                  action={avatar.stopV1}>Stop v1
    </ActionButton>
    <Collapsible label="Invite" isOpen={false} isLocked={!canInvite}>
        <InviteHuman avatar={avatar} />
    </Collapsible>
    <Collapsible label="Mint" isOpen={false} isLocked={!canMint}>
        <HorizontalLayout>
            <ActionButton disabled={!canMint}
                          action={avatar.personalMint}>Personal mint
            </ActionButton>
        </HorizontalLayout>
    </Collapsible>
    <Collapsible isLocked={!canTransfer} label="Transfer" isOpen={false}>
        <HorizontalLayout>
            <Transfer avatar={avatar}/>
            {#each transferHistory as item}
                <TransferHistoryItem from={item.from}
                                     to={item.to}
                                     amount={item.amount}
                                     timestamp={item.timestamp}
                                     txHash={item.txHash}/>
            {/each}
        </HorizontalLayout>
    </Collapsible>
    <Collapsible isLocked={!canTrust} label="Trust" isOpen={false}>
        <HorizontalLayout>
            <Trust avatar={avatar}/>
        </HorizontalLayout>
    </Collapsible>
</Collapsible>