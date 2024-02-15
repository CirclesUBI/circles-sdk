import { Provider } from '@circles/circles-sdk-v2-providers/dist/provider';
import { V1Avatar, V1AvatarState } from './v1/v1Avatar';
import { V2Avatar, V2AvatarState } from './v2/v2Avatar';
import { V1Hub } from './v1/v1Hub';
import { V2Hub } from './v2/v2Hub';
import { ParsedV1HubEvent, V1HubEvent } from '@circles/circles-sdk-v2-abi-decoder/dist/v1HubEvents';
import { ParsedV2HubEvent, V2HubEvent } from '@circles/circles-sdk-v2-abi-decoder/dist/v2HubEvents';
import {
  ParsedV1TokenEvent,
  V1TokenEvent
} from '@circles/circles-sdk-v2-abi-decoder/dist/v1TokenEvents';
import { ethers, TransactionReceipt } from 'ethers';
import { cidV0Digest } from './utils';
import { EventEmitter } from './eventEmitter';

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
  readonly v2Hub: V2Hub;

  public readonly address: string;

  private readonly v1Avatar: V1Avatar;
  private readonly v2Avatar: V2Avatar;

  get state(): AvatarState {
    return this._state;
  }

  private _state: AvatarState = AvatarState.NotInitialized;

  private readonly _onStateChanged: EventEmitter<AvatarState> = new EventEmitter();
  public readonly onStateChanged = this._onStateChanged.subscribe;

  private readonly _onEvent: EventEmitter<AvatarEvent> = new EventEmitter();
  public readonly onEvent = this._onEvent.subscribe;

  constructor(v1Hub: V1Hub, v2Hub: V2Hub, avatarAddress: string, provider: Provider) {
    this.provider = provider;
    this.address = avatarAddress;

    this.v1Hub = v1Hub
    this.v1Hub.onEvent(event => this._onEvent.emit(event));
    this.v1Avatar = new V1Avatar(this.v1Hub, avatarAddress, provider);

    this.v2Hub = v2Hub;
    this.v2Hub.onEvent(event => this._onEvent.emit(event));
    this.v2Avatar = new V2Avatar(this.v2Hub, avatarAddress, provider);
  }

  initialize = async () => {
    await Promise.all([
      this.v1Avatar.initialize(),
      this.v2Avatar.initialize()
    ]);

    if (this.v1Avatar.state === V1AvatarState.NotInitialized
      || this.v2Avatar.state === V2AvatarState.NotInitialized) {
      throw new Error('Avatar not initialized');
    }

    this.updateState();
  };

  private updateState = () => {
    this._state = AvatarState.NotInitialized;

    let v1Unregistered = this.v1Avatar.state === V1AvatarState.Unregistered;
    let v2Unregistered = this.v2Avatar.state === V2AvatarState.Unregistered;

    if (v1Unregistered && v2Unregistered) {
      this._state = AvatarState.Unregistered;
    }

    // Only_V2_* or V1_StoppedHuman_and_V2_Human
    if (this._state === AvatarState.NotInitialized && !v2Unregistered) {
      switch (this.v2Avatar.state) {
        case V2AvatarState.Human:
          this._state = v1Unregistered
            ? AvatarState.V2_Human
            : (this.v1Avatar.state === V1AvatarState.StoppedHuman
              ? AvatarState.V1_StoppedHuman_and_V2_Human
              : this._state);
          break;
        case V2AvatarState.Group:
          this._state = v1Unregistered
            ? AvatarState.V2_Group
            : this._state;
          break;
        case V2AvatarState.Organization:
          this._state = v1Unregistered
            ? AvatarState.V2_Organization
            : this._state;
          break;
      }
    }

    // Only_V1_*
    if (this._state === AvatarState.NotInitialized) {
      switch (this.v1Avatar.state) {
        case V1AvatarState.Human:
          this._state = AvatarState.V1_Human;
          break;
        case V1AvatarState.StoppedHuman:
          this._state = AvatarState.V1_StoppedHuman;
          break;
        case V1AvatarState.Organization:
          this._state = AvatarState.V1_Organization;
          break;
      }
    }

    // If we can't determine the state, set it to unknown
    if (this._state === AvatarState.NotInitialized) {
      this._state = AvatarState.Unknown;
    }

    this._onStateChanged.emit(this._state);
  };

  /**
   * Get the avatar's balance of a token.
   * @param tokenOrAvatar The address of a v1 token or a v2 human/group-avatar. Defaults to the avatar's address.
   */
  getTokenBalance = async (tokenOrAvatar?:string): Promise<bigint> => {
    tokenOrAvatar = tokenOrAvatar || this.address;

    if (!ethers.isAddress(tokenOrAvatar)) {
      throw new Error(`Invalid address: ${tokenOrAvatar}`);
    }

    const v2TokenBalance = await this.v2Hub.balanceOf(this.address, tokenOrAvatar);
    if (v2TokenBalance > 0n) {
      return v2TokenBalance;
    }

    const v1Token = this.v1Hub.getToken(tokenOrAvatar);
    if (!v1Token) {
      throw new Error(`Token not found: ${tokenOrAvatar} (address is neither a v1 token nor a v2 human- or group-avatar)`);
    }

    return await v1Token.balanceOf(this.address);
  }

  migrateAvatar = async (cidV0:string): Promise<void> => {
    await this.stopV1();
    await this.registerHuman(cidV0);
    // TODO: Foreach eligible token, migrate
    // await this.migrateTokens();
  }

  migrateTokens = async (v1Token: string): Promise<void> => {
    // TODO: migrate tokens
  }

  registerHuman = async (cidV0: string): Promise<TransactionReceipt> => {
    if (this.state !== AvatarState.V1_StoppedHuman) {
      throw new Error('Avatar must be V1 stopped human');
    }
    const txReceipt = await this.v2Hub.registerHuman(cidV0Digest(cidV0));
    await this.initialize();
    return txReceipt;
  };

  inviteHuman = async (address: string): Promise<TransactionReceipt> =>
    await this.v2Hub.inviteHuman(address)

  registerOrganization = async (name: string, cidV0: string): Promise<TransactionReceipt> => {
    if (this.state !== AvatarState.Unregistered) {
      throw new Error('Avatar is already registered');
    }
    const txReceipt = await this.v2Hub.registerOrganization(name, cidV0Digest(cidV0));
    await this.initialize();
    return txReceipt;
  };

  registerGroup = async (mintPolicy: string, name: string, symbol: string, cidV0: string): Promise<TransactionReceipt> => {
    if (this.state !== AvatarState.Unregistered) {
      throw new Error('Avatar is already registered');
    }
    const txReceipt = await this.v2Hub.registerGroup(mintPolicy, name, symbol, cidV0Digest(cidV0));
    await this.initialize();
    return txReceipt;
  };

  personalMint = async (): Promise<TransactionReceipt> => {
    let txReceipt: TransactionReceipt | undefined;
    if (this.state === AvatarState.V1_Human && this.v1Avatar.v1Token) {
      txReceipt = await this.v1Avatar.v1Token.update();
    }
    if (this.state === AvatarState.V2_Human || this.state === AvatarState.V1_StoppedHuman_and_V2_Human) {
       await this.v2Hub.personalMint();
    }
    if (!txReceipt) {
      throw new Error('Avatar must be V1 or V2 human in order to mint');
    }
    return txReceipt;
  };

  groupMint = async (group: string, collateral: string[], amounts: bigint[]) =>
    await this.v2Hub.groupMint(group, collateral, amounts)

  stopV1 = async (): Promise<TransactionReceipt> => {
    if (this.state !== AvatarState.V1_Human || !this.v1Avatar.v1Token) {
      throw new Error('Avatar must be V1 human');
    }
    const txReceipt = await this.v1Avatar.v1Token.stop();
    await this.initialize();
    return txReceipt;
  }

  updateProfile = async (cidV0: string): Promise<TransactionReceipt> =>
    await this.v2Hub.setIpfsCidV0(cidV0Digest(cidV0))
}