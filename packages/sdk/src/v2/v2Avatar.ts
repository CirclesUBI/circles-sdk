import { Provider } from '@circles/circles-sdk-v2-providers/dist';
import { V2Hub } from './v2Hub';
import { EventEmitter } from '../eventEmitter';

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

  private readonly _onStateChanged: EventEmitter<V2AvatarState> = new EventEmitter();
  public readonly onStateChanged = this._onStateChanged.subscribe;

  get state(): V2AvatarState {
    return this._state;
  }

  private _state: V2AvatarState = V2AvatarState.NotInitialized;

  constructor(v2Hub: V2Hub, avatarAddress: string, provider: Provider) {
    this.v2Hub = v2Hub;
    this.avatarAddress = avatarAddress;
    this.provider = provider;
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

    this._state = isOrganization
      ? V2AvatarState.Organization
      : isGroup
        ? V2AvatarState.Group
        : isHuman
          ? V2AvatarState.Human
          : V2AvatarState.Unregistered;

    // We don't care about stopped v2 avatars during initialization because we assume
    // that they are not stopped. If required, this state must be checked manually.

    this._onStateChanged.emit(this._state);
  }
}