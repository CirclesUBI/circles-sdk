import { Provider } from '@circles-sdk/providers/dist';
import { V1Avatar, V1AvatarState } from './v1/v1Avatar';
import { V2Avatar, V2AvatarState } from './v2/v2Avatar';
import { V1Hub } from './v1/v1Hub';
import { V2Hub } from './v2/v2Hub';
import { V1Data } from './v1/v1Data';
import { ParsedV1HubEvent, V1HubEvent } from '@circles-sdk/abi-decoder/dist';
import { ParsedV2HubEvent, V2HubEvent } from '@circles-sdk/abi-decoder/dist';
import {
  ParsedV1TokenEvent,
  V1TokenEvent
} from '@circles-sdk/abi-decoder/dist';
import { ethers, TransactionReceipt } from 'ethers';
import { cidV0Digest } from './utils';
import { ObservableProperty } from './observableProperty';

export enum AvatarState {
  NotInitialized,
  Unregistered,
  V1_Human,
  V1_StoppedHuman,
  V1_Organization,
  V2_Human,
  V2_Group,
  V2_Organization,
  V1_StoppedHuman_and_V2_Human,
  Unknown
}

export type AvatarEvent =
  ParsedV1HubEvent<V1HubEvent>
  | ParsedV1TokenEvent<V1TokenEvent>
  | ParsedV2HubEvent<V2HubEvent>

export class Avatar {
  private readonly provider: Provider;
  readonly v1Hub: V1Hub;
  readonly v1Data: V1Data = new V1Data('https://circles-rpc.circlesubi.id');
  readonly v2Hub: V2Hub;

  public readonly address: string;

  private readonly v1Avatar: V1Avatar;
  private readonly v2Avatar: V2Avatar;

  public readonly state: ObservableProperty<AvatarState>;
  private readonly setState: (state: AvatarState) => void;

  public readonly lastEvent: ObservableProperty<AvatarEvent>;
  private readonly setLastEvent: (event: AvatarEvent) => void;

  constructor(v1Hub: V1Hub, v2Hub: V2Hub, avatarAddress: string, provider: Provider) {
    this.provider = provider;
    this.address = avatarAddress;

    const stateProperty = ObservableProperty.create<AvatarState>();
    this.state = stateProperty.property;
    this.setState = stateProperty.emit;
    this.setState(AvatarState.NotInitialized);

    const lastEventProperty = ObservableProperty.create<AvatarEvent>();
    this.lastEvent = lastEventProperty.property;
    this.setLastEvent = lastEventProperty.emit;

    this.v1Hub = v1Hub;
    this.v1Hub.events.subscribe(this.setLastEvent);
    this.v1Avatar = new V1Avatar(this.v1Hub, avatarAddress, provider);

    this.v2Hub = v2Hub;
    this.v2Hub.events.subscribe(this.setLastEvent);
    this.v2Avatar = new V2Avatar(this.v2Hub, avatarAddress, provider);
  }

  initialize = async () => {
    await Promise.all([
      this.v1Avatar.initialize(),
      this.v2Avatar.initialize()
    ]);
    console.log(`Avatar 1 state: ${this.v1Avatar.state.value}, Avatar 2 state: ${this.v2Avatar.state.value}.`);

    if (this.v1Avatar.v1Token) {
      this.v1Avatar.v1Token.events.subscribe(this.setLastEvent);
    }

    if (this.v1Avatar.state.value === V1AvatarState.NotInitialized
      || this.v2Avatar.state.value === V2AvatarState.NotInitialized) {
      throw new Error('Avatar not initialized');
    }

    this.updateState();
    return this;
  };

  private updateState = () => {
    let newState: AvatarState = AvatarState.Unknown;

    const v1State = this.v1Avatar.state.value;
    const v2State = this.v2Avatar.state.value;

    if (v1State === V1AvatarState.NotInitialized && v2State === V2AvatarState.NotInitialized) {
      newState = AvatarState.NotInitialized;
    } else if (v1State === V1AvatarState.Unregistered && v2State === V2AvatarState.Unregistered) {
      newState = AvatarState.Unregistered;
    } else if (v1State === V1AvatarState.StoppedHuman && v2State === V2AvatarState.Human) {
      newState = AvatarState.V1_StoppedHuman_and_V2_Human;
    } else {
      switch (v1State) {
        case V1AvatarState.Human:
          newState = AvatarState.V1_Human;
          break;
        case V1AvatarState.StoppedHuman:
          newState = AvatarState.V1_StoppedHuman;
          break;
        case V1AvatarState.Organization:
          newState = AvatarState.V1_Organization;
          break;
      }

      if (newState === AvatarState.Unknown) {
        switch (v2State) {
          case V2AvatarState.Human:
            newState = AvatarState.V2_Human;
            break;
          case V2AvatarState.Group:
            newState = AvatarState.V2_Group;
            break;
          case V2AvatarState.Organization:
            newState = AvatarState.V2_Organization;
            break;
        }
      }
    }

    this.setState(newState);
  };

  getMintableAmount = () => {
    if (!this.canMint()) {
      throw new Error(`Avatar cannot mint in state: ${this.state.value}`);
    }
    if (this.livesInV1()) {
      return this.v1Avatar.v1Token?.getMintableAmount();
    } else if (this.livesInV2()) {
      return this.v2Avatar.getMintableAmount();
    }
  };

  /**
   * Get the avatar's balance of a token.
   * @param tokenOrAvatar The address of a v1 token or a v2 human/group-avatar. Defaults to the avatar's address.
   */
  getTokenBalance = async (tokenOrAvatar?: string): Promise<bigint> => {
    tokenOrAvatar = tokenOrAvatar || this.address;

    if (!ethers.isAddress(tokenOrAvatar)) {
      throw new Error(`Invalid address: ${tokenOrAvatar}`);
    }

    const v2TokenBalance = await this.v2Hub.balanceOf(this.address, tokenOrAvatar);
    if (v2TokenBalance > BigInt(0)) {
      return v2TokenBalance;
    }

    if (!this.v1Avatar.v1Token) {
      throw new Error(`Token not found: ${tokenOrAvatar} (address is neither a v1 token nor a v2 human- or group-avatar)`);
    }
    return await this.v1Avatar.v1Token.balanceOf(this.address);
  };

  migrateAvatar = async (cidV0: string): Promise<void> => {
    await this.stopV1();
    await this.registerHuman(cidV0);
    // TODO: Foreach eligible token, migrate
    // await this.migrateTokens();
  };

  migrateTokens = async (v1Token: string): Promise<void> => {
    // TODO: migrate tokens
  };

  registerHuman = async (cidV0: string): Promise<TransactionReceipt> => {
    if (this.state.value !== AvatarState.V1_StoppedHuman) {
      throw new Error('Avatar must be V1 stopped human');
    }
    const txReceipt = await this.v2Hub.registerHuman(cidV0Digest(cidV0));
    await this.initialize();
    return txReceipt;
  };

  inviteHuman = async (address: string): Promise<TransactionReceipt> =>
    await this.v2Hub.inviteHuman(address);

  registerOrganization = async (name: string, cidV0: string): Promise<TransactionReceipt> => {
    if (this.state.value !== AvatarState.Unregistered) {
      throw new Error('Avatar is already registered');
    }
    const txReceipt = await this.v2Hub.registerOrganization(name, cidV0Digest(cidV0));
    await this.initialize();
    return txReceipt;
  };

  registerGroup = async (mintPolicy: string, name: string, symbol: string, cidV0: string): Promise<TransactionReceipt> => {
    if (this.state.value !== AvatarState.Unregistered) {
      throw new Error('Avatar is already registered');
    }
    const txReceipt = await this.v2Hub.registerGroup(mintPolicy, name, symbol, cidV0Digest(cidV0));
    await this.initialize();
    return txReceipt;
  };

  personalMint = async (): Promise<TransactionReceipt> => {
    let txReceipt: TransactionReceipt | undefined;
    if (this.state.value === AvatarState.V1_Human && this.v1Avatar.v1Token) {
      txReceipt = await this.v1Avatar.v1Token.update();
    }
    if (this.state.value === AvatarState.V2_Human || this.state.value === AvatarState.V1_StoppedHuman_and_V2_Human) {
      txReceipt = await this.v2Hub.personalMint();
    }
    if (!txReceipt) {
      throw new Error('Avatar must be V1 or V2 human in order to mint');
    }
    return txReceipt;
  };

  groupMint = async (group: string, collateral: string[], amounts: bigint[]) =>
    await this.v2Hub.groupMint(group, collateral, amounts);

  stopV1 = async (): Promise<TransactionReceipt> => {
    if (this.state.value !== AvatarState.V1_Human || !this.v1Avatar.v1Token) {
      throw new Error('Avatar must be V1 human');
    }
    const txReceipt = await this.v1Avatar.v1Token.stop();
    await this.initialize();
    return txReceipt;
  };

  updateProfile = async (cidV0: string): Promise<TransactionReceipt> =>
    await this.v2Hub.setIpfsCidV0(cidV0Digest(cidV0));

  transfer = async (to: string, amount: bigint): Promise<TransactionReceipt> => {
    if (!this.canTransfer()) {
      throw new Error(`Avatar cannot transfer in state: ${this.state.value}`);
    }
    if (this.livesInV1()) {
      return await this.v1Avatar.transfer(to, amount);
    } else if (this.livesInV2()) {
      return await this.v2Avatar.transfer(to, amount);
    } else {
      throw new Error(`Transfer not implemented for state: ${this.state.value}`);
    }
  };

  trust = async (avatar: string): Promise<TransactionReceipt> => {
    if (!this.isRegistered()) {
      throw new Error(`Avatar cannot trust in state: ${this.state.value}`);
    }
    if (this.livesInV1()) {
      return await this.v1Avatar.trust(avatar);
    } else if (this.livesInV2()) {
      return await this.v2Avatar.trust(avatar);
    } else {
      throw new Error(`Trust not implemented for state: ${this.state.value}`);
    }
  };

  untrust = async (avatar: string): Promise<TransactionReceipt> => {
    if (!this.isRegistered()) {
      throw new Error(`Avatar cannot untust in state: ${this.state.value}`);
    }
    if (this.livesInV1()) {
      return await this.v1Avatar.untust(avatar);
    } else if (this.livesInV2()) {
      return await this.v2Avatar.untust(avatar);
    } else {
      throw new Error(`Untust not implemented for state: ${this.state.value}`);
    }
  };

  isRegistered = () => this.state.value !== AvatarState.NotInitialized
    && this.state.value !== AvatarState.Unknown
    && this.state.value !== AvatarState.Unregistered;

  isHuman = () => this.state.value === AvatarState.V1_Human
    || this.state.value === AvatarState.V2_Human
    || this.state.value === AvatarState.V1_StoppedHuman
    || this.state.value === AvatarState.V1_StoppedHuman_and_V2_Human;

  isOrganization = () => this.state.value === AvatarState.V1_Organization
    || this.state.value === AvatarState.V2_Organization;

  isGroup = () => this.state.value === AvatarState.V2_Group;

  canMint = () => this.canMintInV1() || this.canMintInV2();

  canInvite = () => this.isHuman() && this.livesInV2();

  canTrust = () => this.isRegistered();

  canTransfer = () => this.isHuman() || this.isOrganization();

  private livesInV1 = () => this.state.value === AvatarState.V1_Human
    || this.state.value === AvatarState.V1_Organization
    || this.state.value === AvatarState.V1_StoppedHuman;

  private livesInV2 = () => this.state.value === AvatarState.V2_Human
    || this.state.value === AvatarState.V1_StoppedHuman_and_V2_Human
    || this.state.value === AvatarState.V2_Organization
    || this.state.value === AvatarState.V2_Group;

  private canMintInV1 = () => this.state.value === AvatarState.V1_Human;

  private canMintInV2 = () => this.state.value === AvatarState.V2_Human
    || this.state.value === AvatarState.V1_StoppedHuman_and_V2_Human;
}