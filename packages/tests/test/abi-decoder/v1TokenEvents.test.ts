import { ethers } from 'ethers';
import { createLog } from '../util';
import TokenV1 from '@circles/circles-contracts/out/Token.sol/Token.json';
import {
  V1TokenEvents as V1TokenEventDecoder,
  TokenTransferEvent,
  TokenApprovalEvent
} from '@circles-sdk/abi-v1/dist';

export const V1TokenEvents = {
  'Transfer': null,
  'Approval': null
} as const;

const contractInterface: ethers.Interface = ethers.Interface.from(TokenV1.abi);

describe('V1TokenEvents', () => {
  test('Transfer event decodes correctly', () => {
    const from = ethers.Wallet.createRandom().address;
    const to = ethers.Wallet.createRandom().address;
    const amount = BigInt(1000);
    const log = createLog(contractInterface, 'Transfer', [from, to, amount]);

    const decoded = new V1TokenEventDecoder().decodeEventData(log);
    const eventData = <TokenTransferEvent><unknown>decoded.data;
    expect(decoded.name).toEqual('Transfer');
    expect(eventData.from).toEqual(from);
    expect(eventData.to).toEqual(to);
    expect(eventData.value).toEqual(amount);
  });

  test('Approval event decodes correctly', () => {
    const owner = ethers.Wallet.createRandom().address;
    const spender = ethers.Wallet.createRandom().address;
    const amount = BigInt(1000);
    const log = createLog(contractInterface, 'Approval', [owner, spender, amount]);

    const decoded = new V1TokenEventDecoder().decodeEventData(log);
    const eventData = <TokenApprovalEvent><unknown>decoded.data;
    expect(decoded.name).toEqual('Approval');
    expect(eventData.owner).toEqual(owner);
    expect(eventData.spender).toEqual(spender);
    expect(eventData.value).toEqual(amount);
  });
});