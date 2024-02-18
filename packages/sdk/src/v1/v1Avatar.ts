import { Provider } from '@circles-sdk/providers/dist';
import { V1Hub } from './v1Hub';
import { V1Token } from './v1Token';
import {ethers} from 'ethers';
import {ObservableProperty} from "../observableProperty";

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

  public readonly state: ObservableProperty<V1AvatarState>;
  private readonly setState: (state: V1AvatarState) => void;

  constructor(v1Hub: V1Hub, avatarAddress: string, provider: Provider) {
    this.v1Hub = v1Hub;
    this.avatarAddress = avatarAddress;
    this.provider = provider;

    const stateProperty = ObservableProperty.create<V1AvatarState>();
    this.state = stateProperty.property;
    this.setState = stateProperty.emit;
  }

  async initialize() {
    const [isOrganization, tokenAddress] = await Promise.all([
      this.v1Hub.organizations(this.avatarAddress),
      this.v1Hub.userToToken(this.avatarAddress)
    ]);

    let newState = this.state.value;
    newState = isOrganization
      ? V1AvatarState.Organization
      : V1AvatarState.Unregistered;

    this._v1Token = tokenAddress && ethers.getAddress(tokenAddress) != ethers.ZeroAddress
      ? this.v1Hub.getToken(tokenAddress)
      : undefined;

    if (this._v1Token) {
      newState = V1AvatarState.Human;

      const stopped = await this._v1Token.stopped();
      if (stopped) {
        newState = V1AvatarState.StoppedHuman;
      }
    }

    this.setState(newState);
  }
}