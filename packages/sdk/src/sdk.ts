import { Provider } from '@circles/circles-sdk-v2-providers/dist/provider';
import { Avatar } from './avatar';

export class Sdk {
  private readonly provider: Provider;

  private readonly hubV1Address: string;
  private readonly hubV2Address: string;

  constructor(hubV1Address: string, hubV2Address: string, provider: Provider) {
    this.provider = provider;
    this.hubV1Address = hubV1Address;
    this.hubV2Address = hubV2Address;
  }

  getAvatar = async (avatarAddress: string) => {
    return new Avatar(this.hubV1Address, this.hubV2Address, avatarAddress, this.provider);
  }
}