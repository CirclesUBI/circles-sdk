import { ethers } from 'ethers';
import TokenV1 from '@circles/circles-contracts/out/Token.sol/Token.json';

export type ApproveInputs = {
  spender: string;
  amount: bigint;
};

export type DecreaseAllowanceInputs = {
  spender: string;
  subtractedValue: bigint;
};

export type IncreaseAllowanceInputs = {
  spender: string;
  addedValue: bigint;
};

export type NoInputs = [];

export type TransferInputs = {
  dst: string;
  wad: bigint;
};

export type TransferFromInputs = {
  sender: string;
  recipient: string;
  amount: bigint;
};

export type V1TokenFunctionInputs =
  | ApproveInputs
  | DecreaseAllowanceInputs
  | IncreaseAllowanceInputs
  | NoInputs
  | TransferInputs
  | TransferFromInputs;

export type V1TokenFunctionCall = {
  name: string;
  inputs: V1TokenFunctionInputs;
};

const contractInterface: ethers.Interface = new ethers.Interface(TokenV1.abi);

const decodeApprove = (callData: string): ApproveInputs => {
  const decoded = contractInterface.decodeFunctionData('approve', callData);
  return { spender: decoded[0], amount: BigInt(decoded[1].toString()) };
};

const decodeDecreaseAllowance = (callData: string): DecreaseAllowanceInputs => {
  const decoded = contractInterface.decodeFunctionData('decreaseAllowance', callData);
  return { spender: decoded[0], subtractedValue: BigInt(decoded[1].toString()) };
};

const decodeIncreaseAllowance = (callData: string): IncreaseAllowanceInputs => {
  const decoded = contractInterface.decodeFunctionData('increaseAllowance', callData);
  return { spender: decoded[0], addedValue: BigInt(decoded[1].toString()) };
};

const decodeTransfer = (callData: string): TransferInputs => {
  const decoded = contractInterface.decodeFunctionData('transfer', callData);
  return { dst: decoded[0], wad: BigInt(decoded[1].toString()) };
};

const decodeTransferFrom = (callData: string): TransferFromInputs => {
  const decoded = contractInterface.decodeFunctionData('transferFrom', callData);
  return { sender: decoded[0], recipient: decoded[1], amount: BigInt(decoded[2].toString()) };
};

export class V1TokenCalls {
  decodeFunctionCallData(callData: string): V1TokenFunctionCall {
    const methodId = callData.slice(0, 10);
    const functionFragment = contractInterface.getFunction(methodId);

    if (!functionFragment) {
      throw new Error('Invalid function call data');
    }

    let inputs: V1TokenFunctionInputs = <NoInputs>[];
    switch (functionFragment.name) {
      case 'approve':
        inputs = decodeApprove(callData);
        break;
      case 'decreaseAllowance':
        inputs = decodeDecreaseAllowance(callData);
        break;
      case 'increaseAllowance':
        inputs = decodeIncreaseAllowance(callData);
        break;
      case 'transfer':
        inputs = decodeTransfer(callData);
        break;
      case 'transferFrom':
        inputs = decodeTransferFrom(callData);
        break;
      case 'stop':
      case 'update':
        break;
      default:
        throw new Error(`Function ${functionFragment.name} not supported for decoding.`);
    }

    return {
      name: functionFragment.name,
      inputs
    };
  }
}