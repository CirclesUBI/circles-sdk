import { ethers } from 'ethers';
import { V1HubCalls } from '@circles/circles-sdk-v2-abi-encoder/dist/v1HubCalls';
import { V2HubCalls } from '@circles/circles-sdk-v2-abi-encoder/src/v2HubCalls';

export type SignupState = {
  v1: {
    hasToken: boolean;
    isActive: boolean;
    isStopped: boolean;
  };
  v2: {
    hasAvatar: boolean;
    isActive: boolean;
    isStopped: boolean;
  };
};

export class Sdk {
  private readonly provider: ethers.Provider;
  private readonly hubV1Address: string;
  private readonly hubV2Address: string;

  constructor(hubV1Address: string, hubV2Address: string, provider: ethers.Provider) {
    this.provider = provider;
    this.hubV1Address = hubV1Address;
    this.hubV2Address = hubV2Address;
  }

  private async callContract(address: string, data: string): Promise<string> {
    return await this.provider.call({ to: address, data });
  }

  getSignupState = async (address: string): Promise<SignupState> => {
    const [v1TokenAddress, v2AvatarAddress] = await Promise.all([
      this.callContract(this.hubV1Address, V1HubCalls.userToToken(address)),
      this.callContract(this.hubV2Address, V2HubCalls.avatars(address))
    ]);

    const state: SignupState = {
      v1: {
        hasToken: !!v1TokenAddress && v1TokenAddress != ethers.ZeroAddress,
        isActive: false,
        isStopped: false
      },
      v2: {
        hasAvatar: !!v2AvatarAddress && v2AvatarAddress != ethers.ZeroAddress,
        isActive: false,
        isStopped: false
      }
    };

    if (state.v1.hasToken) {
      // TODO: TOKEN V1 ABI
      const v1TokenContract = new ethers.Contract(v1TokenAddress, [], this.provider);
      state.v1.isStopped = await v1TokenContract.stopped();
      state.v1.isActive = !state.v1.isStopped;
    }

    return state;
  };
}