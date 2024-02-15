import { ethers } from 'ethers';
import HubV2 from '@circles/circles-contracts-v2/out/Hub.sol/Hub.json';
export const V2HubFunctionNames = {
  'BETA_64x64': null,
  'GAMMA_64x64': null,
  'INDEFINITE_FUTURE': null,
  'ISSUANCE_PER_SECOND': null,
  'MAX_CLAIM_DURATION': null,
  'MINIMUM_DONATION': null,
  'SENTINEL': null,
  'WELCOME_BONUS': null,
  'demurrage_day_zero': null,
  'invitationOnlyTime': null,
  'standardTreasury': null,
  'treasuries': null,
  'avatars': null,
  'balanceOf': null,
  'balanceOfBatch': null,
  'burn': null,
  'burnBatch': null,
  'safeBatchTransferFrom': null,
  'safeTransferFrom': null,
  'setApprovalForAll': null,
  'isApprovedForAll': null,
  'registerHuman': null,
  'registerOrganization': null,
  'registerGroup': null,
  'registerCustomGroup': null,
  'inviteHuman': null,
  'inviteHumanAsOrganization': null,
  'personalMint': null,
  'groupMint': null,
  'trust': null,
  'stop': null,
  'uri': null,
  'wrapInflationaryERC20': null,
  'unwrapInflationaryERC20': null,
  'createERC20InflationWrapper': null,
  'calculateIssuance': null,
  'getDeterministicAddress': null,
  'hubV1': null,
  'inflationaryBurn': null,
  'inflationaryBurnBatch': null,
  'inflationarySafeBatchTransferFrom': null,
  'inflationarySafeTransferFrom': null,
  'isGroup': null,
  'isHuman': null,
  'isOrganization': null,
  'mintPolicies': null,
  'mintTimes': null,
  'names': null,
  'operatorPathTransfer': null,
  'singleSourcePathTransfer': null,
  'setIpfsCidV0': null,
  'stopped': null,
  'symbols': null,
  'tokenIDToInfERC20': null,
  'tokenIdToCidV0Digest': null,
  'trustMarkers': null,
} as const;

export type V2HubFunctionName = keyof typeof V2HubFunctionNames;

export class V2HubCalls {
  private static readonly contractInterface: ethers.Interface = ethers.Interface.from(HubV2.abi);

  static encodeFunctionData(functionName: V2HubFunctionName, args: any[]): string {
    return this.contractInterface.encodeFunctionData(functionName, args);
  }

  static BETA_64x64(): string {
    return this.encodeFunctionData('BETA_64x64', []);
  }

  static GAMMA_64x64(): string {
    return this.encodeFunctionData('GAMMA_64x64', []);
  }

  static INDEFINITE_FUTURE(): string {
    return this.encodeFunctionData('INDEFINITE_FUTURE', []);
  }

  static ISSUANCE_PER_SECOND(): string {
    return this.encodeFunctionData('ISSUANCE_PER_SECOND', []);
  }

  static MAX_CLAIM_DURATION(): string {
    return this.encodeFunctionData('MAX_CLAIM_DURATION', []);
  }

  static MINIMUM_DONATION(): string {
    return this.encodeFunctionData('MINIMUM_DONATION', []);
  }

  static SENTINEL(): string {
    return this.encodeFunctionData('SENTINEL', []);
  }

  static WELCOME_BONUS(): string {
    return this.encodeFunctionData('WELCOME_BONUS', []);
  }

  static avatars(_address: string): string {
    return this.encodeFunctionData('avatars', [_address]);
  }

  static balanceOf(_account: string, _id: string): string {
    return this.encodeFunctionData('balanceOf', [_account, _id]);
  }

  static balanceOfBatch(_accounts: string[], _ids: string[]): string {
    return this.encodeFunctionData('balanceOfBatch', [_accounts, _ids]);
  }

  static burn(_id: string, _value: bigint): string {
    return this.encodeFunctionData('burn', [_id, _value]);
  }

  static burnBatch(_ids: string[], _values: bigint[]): string {
    return this.encodeFunctionData('burnBatch', [_ids, _values]);
  }

  static calculateIssuance(_human: string): string {
    return this.encodeFunctionData('calculateIssuance', [_human]);
  }

  static createERC20InflationWrapper(_tokenId: string, _name: string, _symbol: string): string {
    return this.encodeFunctionData('createERC20InflationWrapper', [_tokenId, _name, _symbol]);
  }

  static demurrage_day_zero(): string {
    return this.encodeFunctionData('demurrage_day_zero', []);
  }

  static getDeterministicAddress(_tokenId: string, _bytecodeHash: string): string {
    return this.encodeFunctionData('getDeterministicAddress', [_tokenId, _bytecodeHash]);
  }

  static groupMint(_group: string, _collateral: string[], _amounts: bigint[]): string {
    return this.encodeFunctionData('groupMint', [_group, _collateral, _amounts]);
  }

  static hubV1(): string {
    return this.encodeFunctionData('hubV1', []);
  }

  static inflationaryBurn(_id: string, _value: bigint): string {
    return this.encodeFunctionData('inflationaryBurn', [_id, _value]);
  }

  static inflationaryBurnBatch(_ids: string[], _values: bigint[]): string {
    return this.encodeFunctionData('inflationaryBurnBatch', [_ids, _values]);
  }

  static inflationarySafeBatchTransferFrom(_from: string, _to: string, _ids: string[], _values: bigint[], _data: string): string {
    return this.encodeFunctionData('inflationarySafeBatchTransferFrom', [_from, _to, _ids, _values, _data]);
  }

  static inflationarySafeTransferFrom(_from: string, _to: string, _id: string, _value: bigint, _data: string): string {
    return this.encodeFunctionData('inflationarySafeTransferFrom', [_from, _to, _id, _value, _data]);
  }

  static invitationOnlyTime(): string {
    return this.encodeFunctionData('invitationOnlyTime', []);
  }

  static inviteHuman(_human: string): string {
    return this.encodeFunctionData('inviteHuman', [_human]);
  }

  static inviteHumanAsOrganization(_human: string, _donationReceiver: string): string {
    return this.encodeFunctionData('inviteHumanAsOrganization', [_human, _donationReceiver]);
  }

  static isApprovedForAll(account: string, operator: string): string {
    return this.encodeFunctionData('isApprovedForAll', [account, operator]);
  }

  static isGroup(_group: string): string {
    return this.encodeFunctionData('isGroup', [_group]);
  }

  static isHuman(_human: string): string {
    return this.encodeFunctionData('isHuman', [_human]);
  }

  static isOrganization(_organization: string): string {
    return this.encodeFunctionData('isOrganization', [_organization]);
  }

  static mintPolicies(_address: string): string {
    return this.encodeFunctionData('mintPolicies', [_address]);
  }

  static mintTimes(_address: string): string {
    return this.encodeFunctionData('mintTimes', [_address]);
  }

  static names(_address: string): string {
    return this.encodeFunctionData('names', [_address]);
  }

  static operatorPathTransfer(): string {
    return this.encodeFunctionData('operatorPathTransfer', []);
  }

  static personalMint(): string {
    return this.encodeFunctionData('personalMint', []);
  }

  static registerCustomGroup(_mint: string, _treasury: string, _name: string, _symbol: string, _cidV0Digest: Uint8Array): string {
    return this.encodeFunctionData('registerCustomGroup', [_mint, _treasury, _name, _symbol, _cidV0Digest]);
  }

  static registerGroup(_mint: string, _name: string, _symbol: string, _cidV0Digest: Uint8Array): string {
    return this.encodeFunctionData('registerGroup', [_mint, _name, _symbol, _cidV0Digest]);
  }

  static registerHuman(_cidV0Digest: Uint8Array): string {
    return this.encodeFunctionData('registerHuman', [_cidV0Digest]);
  }

  static registerOrganization(_name: string, _cidV0Digest: Uint8Array): string {
    return this.encodeFunctionData('registerOrganization', [_name, _cidV0Digest]);
  }

  static safeBatchTransferFrom(_from: string, _to: string, _ids: string[], _values: bigint[], _data: string): string {
    return this.encodeFunctionData('safeBatchTransferFrom', [_from, _to, _ids, _values, _data]);
  }

  static safeTransferFrom(_from: string, _to: string, _id: string, _value: bigint, _data: string): string {
    return this.encodeFunctionData('safeTransferFrom', [_from, _to, _id, _value, _data]);
  }

  static setApprovalForAll(operator: string, approved: boolean): string {
    return this.encodeFunctionData('setApprovalForAll', [operator, approved]);
  }

  static setIpfsCidV0(_ipfsCid: Uint8Array): string {
    return this.encodeFunctionData('setIpfsCidV0', [_ipfsCid]);
  }

  static singleSourcePathTransfer(): string {
    return this.encodeFunctionData('singleSourcePathTransfer', []);
  }

  static standardTreasury(): string {
    return this.encodeFunctionData('standardTreasury', []);
  }

  static stop(): string {
    return this.encodeFunctionData('stop', []);
  }

  static stopped(_human: string): string {
    return this.encodeFunctionData('stopped', [_human]);
  }

  static symbols(_address: string): string {
    return this.encodeFunctionData('symbols', [_address]);
  }

  static tokenIDToInfERC20(_tokenId: string): string {
    return this.encodeFunctionData('tokenIDToInfERC20', [_tokenId]);
  }

  static tokenIdToCidV0Digest(_tokenId: string): string {
    return this.encodeFunctionData('tokenIdToCidV0Digest', [_tokenId]);
  }

  static treasuries(_address: string): string {
    return this.encodeFunctionData('treasuries', [_address]);
  }

  static trust(_trustReceiver: string, _expiry: bigint): string {
    return this.encodeFunctionData('trust', [_trustReceiver, _expiry]);
  }

  static trustMarkers(_truster: string, _trustee: string): string {
    return this.encodeFunctionData('trustMarkers', [_truster, _trustee]);
  }

  static unwrapInflationaryERC20(_tokenId: string, _amount: bigint): string {
    return this.encodeFunctionData('unwrapInflationaryERC20', [_tokenId, _amount]);
  }

  static uri(_id: string): string {
    return this.encodeFunctionData('uri', [_id]);
  }

  static wrapInflationaryERC20(_tokenId: string, _amount: bigint): string {
    return this.encodeFunctionData('wrapInflationaryERC20', [_tokenId, _amount]);
  }
}