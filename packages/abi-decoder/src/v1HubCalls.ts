import { ethers } from 'ethers';
import HubV1 from '@circles/circles-contracts/out/Hub.sol/Hub.json';

export type TransferThroughInputs = {
  tokenOwners: string[];
  srcs: string[];
  dests: string[];
  wads: bigint[];
};

export type TrustInputs = {
  user: string;
  limit: bigint;
};

export type NoInputs = [];

export type V1HubFunctionInputs =
  | TransferThroughInputs
  | TrustInputs
  | NoInputs;

export type V1HubFunctionCall = {
  name: string;
  inputs: V1HubFunctionInputs;
};

const contractInterface: ethers.Interface = ethers.Interface.from(HubV1.abi);

const decodeTransferThrough = (callData: string): TransferThroughInputs => {
  const decoded = contractInterface.decodeFunctionData('transferThrough', callData);
  return {
    tokenOwners: decoded[0],
    srcs: decoded[1],
    dests: decoded[2],
    wads: decoded[3].map((wad: any) => BigInt(wad.toString()))
  };
};

const decodeTrust = (callData: string): TrustInputs => {
  const decoded = contractInterface.decodeFunctionData('trust', callData);
  return {
    user: decoded[0],
    limit: BigInt(decoded[1].toString())
  };
};

export class V1HubCalls {
  decodeFunctionCallData(callData: string): V1HubFunctionCall {
    const methodId = callData.slice(0, 10);
    const functionFragment = contractInterface.getFunction(methodId);

    if (!functionFragment) {
      throw new Error('Invalid function call data');
    }

    let inputs: V1HubFunctionInputs = <NoInputs>[];
    switch (functionFragment.name) {
      case 'transferThrough':
        inputs = decodeTransferThrough(callData);
        break;
      case 'trust':
        inputs = decodeTrust(callData);
        break;
      case 'organizationSignup':
      case 'signup':
        break;
      default:
        throw new Error(`Unsupported function name: ${functionFragment.name}`);
    }

    return {
      name: functionFragment.name,
      inputs: inputs
    };
  }
}