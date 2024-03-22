import { ObservableProperty } from '../observableProperty';
import { ethers, TransactionReceipt } from 'ethers';
import { V2Hub, V2HubCalls as V2HubCallsEncoder, V2HubInputTypes } from '@circles-sdk/abi-v2';
import { generateRandomAddress, generateRandomData } from '@circles-sdk/tests/test/util';

export enum V2AvatarState {
  NotInitialized,
  Unregistered,
  Human,
  StoppedHuman, // Not used right now
  Organization,
  Group
}

export class V2Avatar {
  private readonly provider: ethers.Provider;
  private readonly v2Hub: V2Hub;
  private readonly avatarAddress: string;

  public readonly state: ObservableProperty<V2AvatarState>;
  private readonly setState: (state: V2AvatarState) => void;

  constructor(v2Hub: V2Hub, avatarAddress: string, provider: ethers.Provider) {
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
    throw new Error(`Not implemented`)
    // TODO: Implement
    // const flowMatrix = await findFlowMatrix(this.avatarAddress, to, amount);
    //
    // const receipt = await this.v2Hub.operateFlowMatrix(
    //   flowMatrix._flowVertices,
    //   flowMatrix._flow,
    //   flowMatrix._streams,
    //   flowMatrix._packedCoordinates
    // );
    //
    // if (!receipt) {
    //   throw new Error('Transfer failed');
    // }
    //
    // return receipt;
  }

  async groupMint(group:string, collateral: string[], amounts: bigint[], data: Uint8Array): Promise<TransactionReceipt> {
    const txReceipt = await this.v2Hub.groupMint(group, collateral, amounts, data);
    if (!txReceipt) {
      throw new Error('Group mint failed');
    }
    return txReceipt;
  }

  async wrapInErc20() {
  }

  async unwrapFromErc20() {
  }

  async trust(avatar: string): Promise<TransactionReceipt | null> {
    return await this.v2Hub.trust(avatar, BigInt('79228162514264337593543950335'));
  }

  async untust(avatar: string): Promise<TransactionReceipt | null> {
    return await this.v2Hub.trust(avatar, BigInt('0'));
  }

  async getMintableAmount(): Promise<bigint> {
    return await this.v2Hub.calculateIssuance(this.avatarAddress);
  }
}