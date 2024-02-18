import { Provider } from '@circles-sdk/providers/dist';
import { Avatar } from './avatar';
import { V2Hub } from './v2/v2Hub';
import { V1Hub } from './v1/v1Hub';

export class Sdk {
  private readonly provider: Provider;

  public readonly hubV1Address: string;
  public readonly v1Hub: V1Hub;

  public readonly hubV2Address: string;
  public readonly v2Hub: V2Hub;

  constructor(hubV1Address: string, hubV2Address: string, provider: Provider) {
    this.provider = provider;

    this.hubV1Address = hubV1Address;
    this.v1Hub = new V1Hub(provider, hubV1Address);

    this.hubV2Address = hubV2Address;
    this.v2Hub = new V2Hub(provider, hubV2Address);
  }

  getInvitationFee = async () =>
    (await this.v2Hub.WELCOME_BONUS()) * BigInt(2);

  isRegistrationPeriodOver: () => Promise<boolean> = async () =>
    (await this.v2Hub.invitationOnlyTime()) < BigInt(Date.now() / 1000);

  getAvatar = async (avatarAddress: string) =>
    new Avatar(this.v1Hub, this.v2Hub, avatarAddress, this.provider);
}