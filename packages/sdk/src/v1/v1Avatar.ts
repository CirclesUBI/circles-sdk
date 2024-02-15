import { Provider } from '@circles/circles-sdk-v2-providers/dist/provider';
import { V1Hub } from './v1Hub';
import { V1Token } from './v1Token';
import { ethers } from 'ethers';
import { EventEmitter } from '../eventEmitter';

export enum V1AvatarState {
  NotInitialized,
  Unregistered,
  Human,
  StoppedHuman,
  Organization
}

export class V1Avatar {
  private readonly provider: Provider;
  private readonly v1Hub: V1Hub;
  private readonly avatarAddress: string;

  get v1Token(): V1Token|undefined {
    return this._v1Token;
  }
  private _v1Token?: V1Token;

  get state(): V1AvatarState {
    return this._state;
  }
  private _state: V1AvatarState = V1AvatarState.NotInitialized;

  private readonly _onStateChanged: EventEmitter<V1AvatarState> = new EventEmitter();
  public readonly onStateChanged = this._onStateChanged.subscribe;

  constructor(v1Hub: V1Hub, avatarAddress: string, provider: Provider) {
    this.v1Hub = v1Hub;
    this.avatarAddress = avatarAddress;
    this.provider = provider;
  }

  async initialize() {
    const [isOrganization, tokenAddress] = await Promise.all([
      this.v1Hub.organizations(this.avatarAddress),
      this.v1Hub.userToToken(this.avatarAddress)
    ]);

    this._state = isOrganization
      ? V1AvatarState.Organization
      : V1AvatarState.Unregistered;

    this._v1Token = tokenAddress && tokenAddress != ethers.ZeroAddress
      ? this.v1Hub.getToken(tokenAddress)
      : undefined;

    if (this._v1Token) {
      this._state = V1AvatarState.Human;

      const stopped = await this._v1Token.stopped();
      if (stopped) {
        this._state = V1AvatarState.StoppedHuman;
      }
    }

    this._onStateChanged.emit(this._state);
  }
}