import { ethers } from 'ethers';
import HubV2 from '@circles/circles-contracts-v2/out/Hub.sol/Hub.json';
import { NoInputs } from './noInputs.js';

export type BurnInputs = {
  _id: bigint;
  _value: bigint;
};

export type BurnBatchInputs = {
  _ids: bigint[];
  _values: bigint[];
};

export type CreateERC20InflationWrapperInputs = {
  _tokenId: bigint;
  _name: string;
  _symbol: string;
};

export type GroupMintInputs = {
  _group: string;
  _collateral: bigint[];
  _amounts: bigint[];
};

export type InflationaryBurnInputs = {
  _id: bigint;
  _value: bigint;
};

export type InflationaryBurnBatchInputs = {
  _ids: bigint[];
  _values: bigint[];
};

export type InflationarySafeBatchTransferFromInputs = {
  _from: string;
  _to: string;
  _ids: bigint[];
  _values: bigint[];
  _data: Uint8Array;
};

export type InflationarySafeTransferFromInputs = {
  _from: string;
  _to: string;
  _id: bigint;
  _value: bigint;
  _data: Uint8Array;
};

export type InviteHumanInputs = {
  _human: string;
};

export type InviteHumanAsOrganizationInputs = {
  _human: string;
  _donationReceiver: string;
};

export type RegisterCustomGroupInputs = {
  _mint: string;
  _treasury: string;
  _name: string;
  _symbol: string;
  _cidV0Digest: Uint8Array;
};

export type RegisterGroupInputs = {
  _mint: string;
  _name: string;
  _symbol: string;
  _cidV0Digest: Uint8Array;
};

export type RegisterHumanInputs = {
  _cidV0Digest: Uint8Array;
};

export type RegisterOrganizationInputs = {
  _name: string;
  _cidV0Digest: Uint8Array;
};

export type SafeBatchTransferFromInputs = {
  _from: string;
  _to: string;
  _ids: bigint[];
  _values: bigint[];
  _data: Uint8Array;
};

export type SafeTransferFromInputs = {
  _from: string;
  _to: string;
  _id: bigint;
  _value: bigint;
  _data: Uint8Array;
};

export type SetApprovalForAllInputs = {
  operator: string;
  approved: boolean;
};

export type SetIpfsCidV0Inputs = {
  _ipfsCid: Uint8Array;
};

export type SingleSourcePathTransferInputs = {
  // Placeholder for future implementation specifics
};

export type UnwrapInflationaryERC20Inputs = {
  _tokenId: bigint;
  _amount: bigint;
};

export type WrapDemurrageERC20Inputs = {
  // Placeholder for future implementation specifics
};

export type WrapInflationaryERC20Inputs = {
  _tokenId: bigint;
  _amount: bigint;
};

export type TrustInputs_v2 = {
  _trustReceiver: string;
  _expiry: bigint;
};

export type PersonalMintInputs = NoInputs;
export type OperatorPathTransferInputs = NoInputs;
export type StopInputs = NoInputs;

export type V2HubFunctionInputs =
  | BurnInputs
  | BurnBatchInputs
  | CreateERC20InflationWrapperInputs
  | GroupMintInputs
  | InflationaryBurnInputs
  | InflationaryBurnBatchInputs
  | InflationarySafeBatchTransferFromInputs
  | InflationarySafeTransferFromInputs
  | InviteHumanInputs
  | InviteHumanAsOrganizationInputs
  | RegisterCustomGroupInputs
  | RegisterGroupInputs
  | RegisterHumanInputs
  | RegisterOrganizationInputs
  | SafeBatchTransferFromInputs
  | SafeTransferFromInputs
  | SetApprovalForAllInputs
  | SetIpfsCidV0Inputs
  | SingleSourcePathTransferInputs
  | UnwrapInflationaryERC20Inputs
  | WrapDemurrageERC20Inputs
  | WrapInflationaryERC20Inputs
  | TrustInputs_v2
  | OperatorPathTransferInputs
  | PersonalMintInputs
  | StopInputs
  | NoInputs;

export type V2HubFunctionCall = {
  name: string;
  inputs: V2HubFunctionInputs;
};

const contractInterface: ethers.Interface = ethers.Interface.from(HubV2.abi);

const decodeBurn = (callData: string): BurnInputs => {
  const decoded = contractInterface.decodeFunctionData('burn', callData);
  return {
    _id: BigInt(decoded[0].toString()),
    _value: BigInt(decoded[1].toString())
  };
};

const decodeBurnBatch = (callData: string): BurnBatchInputs => {
  const decoded = contractInterface.decodeFunctionData('burnBatch', callData);
  return {
    _ids: decoded[0].map((id: any) => BigInt(id.toString())),
    _values: decoded[1].map((value: any) => BigInt(value.toString()))
  };
};

const decodeCreateERC20InflationWrapper = (callData: string): CreateERC20InflationWrapperInputs => {
  const decoded = contractInterface.decodeFunctionData('createERC20InflationWrapper', callData);
  return {
    _tokenId: BigInt(decoded[0].toString()),
    _name: decoded[1],
    _symbol: decoded[2]
  };
};

const decodeGroupMint = (callData: string): GroupMintInputs => {
  const decoded = contractInterface.decodeFunctionData('groupMint', callData);
  return {
    _group: decoded[0],
    _collateral: decoded[1].map((collateral: any) => BigInt(collateral.toString())),
    _amounts: decoded[2].map((amount: any) => BigInt(amount.toString()))
  };
};

const decodeInflationaryBurn = (callData: string): InflationaryBurnInputs => {
  const decoded = contractInterface.decodeFunctionData('inflationaryBurn', callData);
  return {
    _id: BigInt(decoded[0].toString()),
    _value: BigInt(decoded[1].toString())
  };
};

const decodeInflationaryBurnBatch = (callData: string): InflationaryBurnBatchInputs => {
  const decoded = contractInterface.decodeFunctionData('inflationaryBurnBatch', callData);
  return {
    _ids: decoded[0].map((id: any) => BigInt(id.toString())),
    _values: decoded[1].map((value: any) => BigInt(value.toString()))
  };
};

const decodeInflationarySafeBatchTransferFrom = (callData: string): InflationarySafeBatchTransferFromInputs => {
  const decoded = contractInterface.decodeFunctionData('inflationarySafeBatchTransferFrom', callData);
  return {
    _from: decoded[0],
    _to: decoded[1],
    _ids: decoded[2].map((id: any) => BigInt(id.toString())),
    _values: decoded[3].map((value: any) => BigInt(value.toString())),
    _data: decoded[4]
  };
};

const decodeInflationarySafeTransferFrom = (callData: string): InflationarySafeTransferFromInputs => {
  const decoded = contractInterface.decodeFunctionData('inflationarySafeTransferFrom', callData);
  return {
    _from: decoded[0],
    _to: decoded[1],
    _id: BigInt(decoded[2].toString()),
    _value: BigInt(decoded[3].toString()),
    _data: decoded[4]
  };
};

const decodeInviteHuman = (callData: string): InviteHumanInputs => {
  const decoded = contractInterface.decodeFunctionData('inviteHuman', callData);
  return {
    _human: decoded[0]
  };
};

const decodeInviteHumanAsOrganization = (callData: string): InviteHumanAsOrganizationInputs => {
  const decoded = contractInterface.decodeFunctionData('inviteHumanAsOrganization', callData);
  return {
    _human: decoded[0],
    _donationReceiver: decoded[1]
  };
};

const decodeRegisterCustomGroup = (callData: string): RegisterCustomGroupInputs => {
  const decoded = contractInterface.decodeFunctionData('registerCustomGroup', callData);
  return {
    _mint: decoded[0],
    _treasury: decoded[1],
    _name: decoded[2],
    _symbol: decoded[3],
    _cidV0Digest: new Uint8Array(Buffer.from(decoded[4].substring(2), 'hex'))
  };
};

const decodeRegisterGroup = (callData: string): RegisterGroupInputs => {
  const decoded = contractInterface.decodeFunctionData('registerGroup', callData);
  return {
    _mint: decoded[0],
    _name: decoded[1],
    _symbol: decoded[2],
    _cidV0Digest: new Uint8Array(Buffer.from(decoded[3].substring(2), 'hex'))
  };
};

const decodeRegisterHuman = (callData: string): RegisterHumanInputs => {
  const decoded = contractInterface.decodeFunctionData('registerHuman', callData);
  return {
    _cidV0Digest: new Uint8Array(Buffer.from(decoded[0].substring(2), 'hex'))
  };
};

const decodeRegisterOrganization = (callData: string): RegisterOrganizationInputs => {
  const decoded = contractInterface.decodeFunctionData('registerOrganization', callData);
  return {
    _name: decoded[0],
    _cidV0Digest: new Uint8Array(Buffer.from(decoded[1].substring(2), 'hex'))
  };
};

const decodeSafeBatchTransferFrom = (callData: string): SafeBatchTransferFromInputs => {
  const decoded = contractInterface.decodeFunctionData('safeBatchTransferFrom', callData);
  return {
    _from: decoded[0],
    _to: decoded[1],
    _ids: decoded[2].map((id: any) => BigInt(id.toString())),
    _values: decoded[3].map((value: any) => BigInt(value.toString())),
    _data: decoded[4]
  };
};

const decodeSafeTransferFrom = (callData: string): SafeTransferFromInputs => {
  const decoded = contractInterface.decodeFunctionData('safeTransferFrom', callData);
  return {
    _from: decoded[0],
    _to: decoded[1],
    _id: BigInt(decoded[2].toString()),
    _value: BigInt(decoded[3].toString()),
    _data: decoded[4]
  };
};

const decodeSetApprovalForAll = (callData: string): SetApprovalForAllInputs => {
  const decoded = contractInterface.decodeFunctionData('setApprovalForAll', callData);
  return {
    operator: decoded[0],
    approved: decoded[1]
  };
};

const decodeSetIpfsCidV0 = (callData: string): SetIpfsCidV0Inputs => {
  const decoded = contractInterface.decodeFunctionData('setIpfsCidV0', callData);
  return {
    _ipfsCid: new Uint8Array(Buffer.from(decoded[0].substring(2), 'hex'))
  };
};

const decodeUnwrapInflationaryERC20 = (callData: string): UnwrapInflationaryERC20Inputs => {
  const decoded = contractInterface.decodeFunctionData('unwrapInflationaryERC20', callData);
  return {
    _tokenId: BigInt(decoded[0].toString()),
    _amount: BigInt(decoded[1].toString())
  };
};

const decodeWrapInflationaryERC20 = (callData: string): WrapInflationaryERC20Inputs => {
  const decoded = contractInterface.decodeFunctionData('wrapInflationaryERC20', callData);
  return {
    _tokenId: BigInt(decoded[0].toString()),
    _amount: BigInt(decoded[1].toString())
  };
};

const decodeTrust = (callData: string): TrustInputs_v2 => {
  const decoded = contractInterface.decodeFunctionData('trust', callData);
  return {
    _trustReceiver: decoded[0],
    _expiry: BigInt(decoded[1].toString())
  };
};

export class V2HubCalls {
  decodeFunctionCallData(callData: string): V2HubFunctionCall {
    const methodId = callData.slice(0, 10);
    const functionFragment = contractInterface.getFunction(methodId);

    if (!functionFragment) {
      throw new Error('Invalid function call data');
    }

    let inputs: V2HubFunctionInputs = <NoInputs>[];
    switch (functionFragment.name) {
      case 'burn':
        inputs = decodeBurn(callData);
        break;
      case 'burnBatch':
        inputs = decodeBurnBatch(callData);
        break;
      case 'createERC20InflationWrapper':
        inputs = decodeCreateERC20InflationWrapper(callData);
        break;
      case 'groupMint':
        inputs = decodeGroupMint(callData);
        break;
      case 'inflationaryBurn':
        inputs = decodeInflationaryBurn(callData);
        break;
      case 'inflationaryBurnBatch':
        inputs = decodeInflationaryBurnBatch(callData);
        break;
      case 'inflationarySafeBatchTransferFrom':
        inputs = decodeInflationarySafeBatchTransferFrom(callData);
        break;
      case 'inflationarySafeTransferFrom':
        inputs = decodeInflationarySafeTransferFrom(callData);
        break;
      case 'inviteHuman':
        inputs = decodeInviteHuman(callData);
        break;
      case 'inviteHumanAsOrganization':
        inputs = decodeInviteHumanAsOrganization(callData);
        break;
      case 'registerCustomGroup':
        inputs = decodeRegisterCustomGroup(callData);
        break;
      case 'registerGroup':
        inputs = decodeRegisterGroup(callData);
        break;
      case 'registerHuman':
        inputs = decodeRegisterHuman(callData);
        break;
      case 'registerOrganization':
        inputs = decodeRegisterOrganization(callData);
        break;
      case 'safeBatchTransferFrom':
        inputs = decodeSafeBatchTransferFrom(callData);
        break;
      case 'safeTransferFrom':
        inputs = decodeSafeTransferFrom(callData);
        break;
      case 'setApprovalForAll':
        inputs = decodeSetApprovalForAll(callData);
        break;
      case 'setIpfsCidV0':
        inputs = decodeSetIpfsCidV0(callData);
        break;
      case 'unwrapInflationaryERC20':
        inputs = decodeUnwrapInflationaryERC20(callData);
        break;
      case 'wrapInflationaryERC20':
        inputs = decodeWrapInflationaryERC20(callData);
        break;
      case 'trust':
        inputs = decodeTrust(callData);
        break;
      case 'wrapDemurrageERC20':
      case 'singleSourcePathTransfer':
      case 'operatorPathTransfer':
      case 'personalMint':
      case 'stop':
        break;
      default:
        throw new Error(`Function ${functionFragment.name} not implemented`);
    }
    return {
      name: functionFragment.name,
      inputs: inputs
    };
  }
}
