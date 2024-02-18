import { ethers } from 'ethers';
import TokenV1 from '@circles/circles-contracts/build/contracts/Token.json';

export const V1TokenFunctionNames = {
  'allowance': null,
  'approve': null,
  'balanceOf': null,
  'currentIssuance': null,
  'decimals': null,
  'decreaseAllowance': null,
  'findInflationOffset': null,
  'hub': null,
  'hubDeployedAt': null,
  'increaseAllowance': null,
  'inflationOffset': null,
  'lastTouched': null,
  'look': null,
  'name': null,
  'owner': null,
  'period': null,
  'periods': null,
  'periodsWhenLastTouched': null,
  'stop': null,
  'stopped': null,
  'symbol': null,
  'time': null,
  'timeout': null,
  'totalSupply': null,
  'transfer': null,
  'transferFrom': null,
  'update': null,
} as const;

export type V1TokenFunctionName = keyof typeof V1TokenFunctionNames;

export class V1TokenCalls {
  private static readonly contractInterface: ethers.Interface = new ethers.Interface(TokenV1.abi);

  static encodeFunctionData(functionName: V1TokenFunctionName, args: any[] = []): string {
    return this.contractInterface.encodeFunctionData(functionName, args);
  }
  
  static balanceOf(account: string): string {
    return this.encodeFunctionData('balanceOf', [account]);
  }

  static transfer(dst: string, wad: bigint): string {
    return this.encodeFunctionData('transfer', [dst, wad]);
  }

  static approve(spender: string, amount: bigint): string {
    return this.encodeFunctionData('approve', [spender, amount]);
  }

  static allowance(owner: string, spender: string): string {
    return this.encodeFunctionData('allowance', [owner, spender]);
  }

  static decreaseAllowance(spender: string, subtractedValue: bigint): string {
    return this.encodeFunctionData('decreaseAllowance', [spender, subtractedValue]);
  }

  static increaseAllowance(spender: string, addedValue: bigint): string {
    return this.encodeFunctionData('increaseAllowance', [spender, addedValue]);
  }

  static totalSupply(): string {
    return this.encodeFunctionData('totalSupply', []);
  }

  static transferFrom(sender: string, recipient: string, amount: bigint): string {
    return this.encodeFunctionData('transferFrom', [sender, recipient, amount]);
  }

  static decimals(): string {
    return this.encodeFunctionData('decimals', []);
  }

  static tokenName(): string {
    return this.encodeFunctionData('name', []);
  }

  static symbol(): string {
    return this.encodeFunctionData('symbol', []);
  }

  static currentIssuance(): string {
    return this.encodeFunctionData('currentIssuance', []);
  }

  static findInflationOffset(): string {
    return this.encodeFunctionData('findInflationOffset', []);
  }

  static hub(): string {
    return this.encodeFunctionData('hub', []);
  }

  static hubDeployedAt(): string {
    return this.encodeFunctionData('hubDeployedAt', []);
  }

  static lastTouched(): string {
    return this.encodeFunctionData('lastTouched', []);
  }

  static stop(): string {
    return this.encodeFunctionData('stop', []);
  }

  static stopped(): string {
    return this.encodeFunctionData('stopped', []);
  }

  static update(): string {
    return this.encodeFunctionData('update', []);
  }
}