import {Provider} from '@circles-sdk/providers/dist';
import {V2Hub} from './v2Hub.js';
import {ObservableProperty} from "../observableProperty";
import {TransactionReceipt} from "ethers";

export enum V2AvatarState {
    NotInitialized,
    Unregistered,
    Human,
    StoppedHuman, // Not used right now
    Organization,
    Group
}

export class V2Avatar {
    private readonly provider: Provider;
    private readonly v2Hub: V2Hub;
    private readonly avatarAddress: string;

    public readonly state: ObservableProperty<V2AvatarState>;
    private readonly setState: (state: V2AvatarState) => void;

    constructor(v2Hub: V2Hub, avatarAddress: string, provider: Provider) {
        this.v2Hub = v2Hub;
        this.avatarAddress = avatarAddress;
        this.provider = provider;

        const stateProperty = ObservableProperty.create<V2AvatarState>();
        this.state = stateProperty.property;
        this.setState = stateProperty.emit;
    }

    async initialize() {
        const [
            isHuman,
            isOrganization,
            isGroup
        ] = await Promise.all([
            this.v2Hub.isHuman(this.avatarAddress),
            this.v2Hub.isOrganization(this.avatarAddress),
            this.v2Hub.isGroup(this.avatarAddress)
        ]);

        let newState = isOrganization
            ? V2AvatarState.Organization
            : isGroup
                ? V2AvatarState.Group
                : isHuman
                    ? V2AvatarState.Human
                    : V2AvatarState.Unregistered;

        // We don't care about stopped v2 avatars during initialization because we assume
        // that they are not stopped. If required, this state must be checked manually.
        this.setState(newState);
    }

    async transfer(to: string, amount: bigint): Promise<TransactionReceipt> {
        throw new Error('Not implemented');
    }

    async trust(avatar: string): Promise<TransactionReceipt> {
        return await this.v2Hub.trust(avatar, BigInt("79228162514264337593543950335"));
    }

    async untust(avatar: string): Promise<TransactionReceipt> {
        return await this.v2Hub.trust(avatar, BigInt("0"));
    }

    async getMintableAmount(): Promise<bigint> {
        return await this.v2Hub.calculateIssuance(this.avatarAddress);
    }
}