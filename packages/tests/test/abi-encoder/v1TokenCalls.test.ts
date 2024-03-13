import { ethers } from 'ethers';
import TokenV1 from '@circles/circles-contracts/out/Token.sol/Token.json';
import { generateRandomAddress } from '../util';
import { V1TokenCalls as V1TokenCallsEncoder } from '@circles-sdk/abi-encoder/dist';
import {
  ApproveInputs,
  DecreaseAllowanceInputs,
  IncreaseAllowanceInputs,
  TransferFromInputs,
  TransferInputs,
  V1TokenCalls as V1TokenCallsDecoder
} from '@circles-sdk/abi-decoder/dist';

describe('V1TokenCalls', () => {
  const contractInterface = new ethers.Interface(TokenV1.abi);

  // Test for the deployedAt method
  test('approve() encodes and decodes correctly', () => {
    const spender = generateRandomAddress();
    const amount = BigInt(100);
    const encoded = V1TokenCallsEncoder.approve(spender, amount);
    const decoded = new V1TokenCallsDecoder().decodeFunctionCallData(encoded);
    const inputs = <ApproveInputs>decoded.inputs;

    expect(decoded?.name).toBe('approve');
    expect(inputs.spender).toEqual(spender);
    expect(inputs.amount).toEqual(amount);
  });

  test('decreaseAllowance() encodes and decodes correctly', () => {
    const spender = generateRandomAddress();
    const subtractedValue = BigInt(100);
    const encoded = V1TokenCallsEncoder.decreaseAllowance(spender, subtractedValue);
    const decoded = new V1TokenCallsDecoder().decodeFunctionCallData(encoded);
    const inputs = <DecreaseAllowanceInputs>decoded.inputs;

    expect(decoded?.name).toBe('decreaseAllowance');
    expect(inputs.spender).toEqual(spender);
    expect(inputs.subtractedValue).toEqual(subtractedValue);
  });

  test('increaseAllowance() encodes and decodes correctly', () => {
    const spender = generateRandomAddress();
    const addedValue = BigInt(100);
    const encoded = V1TokenCallsEncoder.increaseAllowance(spender, addedValue);
    const decoded = new V1TokenCallsDecoder().decodeFunctionCallData(encoded);
    const inputs = <IncreaseAllowanceInputs>decoded.inputs;

    expect(decoded?.name).toBe('increaseAllowance');
    expect(inputs.spender).toEqual(spender);
    expect(inputs.addedValue).toEqual(addedValue);
  });

  test('transfer() encodes and decodes correctly', () => {
    const dst = generateRandomAddress();
    const wad = BigInt(100);
    const encoded = V1TokenCallsEncoder.transfer(dst, wad);
    const decoded = new V1TokenCallsDecoder().decodeFunctionCallData(encoded);
    const inputs = <TransferInputs>decoded.inputs;

    expect(decoded?.name).toBe('transfer');
    expect(inputs.dst).toEqual(dst);
    expect(inputs.wad).toEqual(wad);
  });

  test('transferFrom() encodes and decodes correctly', () => {
    const sender = generateRandomAddress();
    const recipient = generateRandomAddress();
    const amount = BigInt(100);
    const encoded = V1TokenCallsEncoder.transferFrom(sender, recipient, amount);
    const decoded = new V1TokenCallsDecoder().decodeFunctionCallData(encoded);
    const inputs = <TransferFromInputs>decoded.inputs;

    expect(decoded?.name).toBe('transferFrom');
    expect(inputs.sender).toEqual(sender);
    expect(inputs.recipient).toEqual(recipient);
    expect(inputs.amount).toEqual(amount);
  });

  test('totalSupply() encodes and decodes correctly', () => {
    const encoded = V1TokenCallsEncoder.totalSupply();
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('totalSupply');
    expect(decoded?.args).toEqual([]);
  });

  test('decimals() encodes and decodes correctly', () => {
    const encoded = V1TokenCallsEncoder.decimals();
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('decimals');
    expect(decoded?.args).toEqual([]);
  });

  test('name() encodes and decodes correctly', () => {
    const encoded = V1TokenCallsEncoder.tokenName();
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('name');
    expect(decoded?.args).toEqual([]);
  });

  test('symbol() encodes and decodes correctly', () => {
    const encoded = V1TokenCallsEncoder.symbol();
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('symbol');
    expect(decoded?.args).toEqual([]);
  });

  test('currentIssuance() encodes and decodes correctly', () => {
    const encoded = V1TokenCallsEncoder.currentIssuance();
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('currentIssuance');
    expect(decoded?.args).toEqual([]);
  });

  test('findInflationOffset() encodes and decodes correctly', () => {
    const encoded = V1TokenCallsEncoder.findInflationOffset();
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('findInflationOffset');
    expect(decoded?.args).toEqual([]);
  });

  test('hub() encodes and decodes correctly', () => {
    const encoded = V1TokenCallsEncoder.hub();
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('hub');
    expect(decoded?.args).toEqual([]);
  });

  test('balanceOf(address) encodes and decodes correctly', () => {
    const address = generateRandomAddress();
    const encoded = V1TokenCallsEncoder.balanceOf(address);
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('balanceOf');
    expect(decoded?.args).toEqual([address]);
  });
});
