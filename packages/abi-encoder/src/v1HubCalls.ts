import { ethers } from 'ethers';
import HubV1 from '@circles/circles-contracts/build/contracts/Hub.json';

export const V1HubFunctionNames = {
  'deployedAt': null,
  'inflation': null,
  'initialIssuance': null,
  'limits': null,
  'name': null,
  'organizations': null,
  'period': null,
  'symbol': null,
  'divisor': null,
  'timeout': null,
  'tokenToUser': null,
  'userToToken': null,
  "signup": null,
  "organizationSignup": null,
  "transferThrough": null,
} as const;

export type V1HubFunctionName = keyof typeof V1HubFunctionNames;

export class V1HubCalls {
  private static readonly contractInterface: ethers.Interface = ethers.Interface.from(HubV1.abi);

  static encodeFunctionData(functionName: V1HubFunctionName, args: any[]): string {
    return this.contractInterface.encodeFunctionData(functionName, args);
  }

  static deployedAt(): string {
    return this.encodeFunctionData('deployedAt', []);
  }

  static divisor(): string {
    return this.encodeFunctionData('divisor', []);
  }

  static inflation(): string {
    return this.encodeFunctionData('inflation', []);
  }

  static initialIssuance(): string {
    return this.encodeFunctionData('initialIssuance', []);
  }

  static limits(truster: string, trustee: string): string {
    return this.encodeFunctionData('limits', [truster, trustee]);
  }

  static hubName(): string {
    return this.encodeFunctionData('name', []);
  }

  static organizations(address: string): string {
    return this.encodeFunctionData('organizations', [address]);
  }

  static period(): string {
    return this.encodeFunctionData('period', []);
  }

  static symbol(): string {
    return this.encodeFunctionData('symbol', []);
  }

  static timeout(): string {
    return this.encodeFunctionData('timeout', []);
  }

  static tokenToUser(address: string): string {
    return this.encodeFunctionData('tokenToUser', [address]);
  }

  static userToToken(address: string): string {
    return this.encodeFunctionData('userToToken', [address]);
  }

  static signup(): string {
    return this.encodeFunctionData('signup', []);
  }

  static organizationSignup(): string {
    return this.encodeFunctionData('organizationSignup', []);
  }

  static transferThrough(
    tokenOwners: string[],
    srcs: string[],
    dests: string[],
    wads: bigint[],
  ) {
    return this.encodeFunctionData('transferThrough', [tokenOwners, srcs, dests, wads]);
  }
}