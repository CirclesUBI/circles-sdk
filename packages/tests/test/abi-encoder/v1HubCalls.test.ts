import { ethers } from 'ethers';
import { V1HubCalls as V1HubCallsEncoder } from '@circles/circles-sdk-v2-abi-encoder/src/v1HubCalls';
import { V1HubCalls as V1HubCallsDeecoder } from '@circles/circles-sdk-v2-abi-decoder/src/v1HubCalls';
import HubV1 from '@circles/circles-contracts/out/Hub.sol/Hub.json';
import { generateRandomAddress } from '../util';

describe('V1HubCalls', () => {
  const contractInterface = new ethers.Interface(HubV1.abi);

  // Test for the deployedAt method
  test('deployedAt() encodes and decodes correctly', () => {
    const encoded = V1HubCallsEncoder.deployedAt();
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('deployedAt');
    expect(decoded?.args).toEqual([]);
  });

  test("signup() encodes and decodes correctly", () => {
    const encoded = V1HubCallsEncoder.signup();
    const decoded = new V1HubCallsDeecoder().decodeFunctionCallData(encoded);

    expect(decoded?.name).toBe('signup');
    expect(decoded?.inputs).toEqual([]);
  });

  test("organizationSignup() encodes and decodes correctly", () => {
    const encoded = V1HubCallsEncoder.organizationSignup();
    const decoded = new V1HubCallsDeecoder().decodeFunctionCallData(encoded);

    expect(decoded?.name).toBe('organizationSignup');
    expect(decoded?.inputs).toEqual([]);
  });

  test("transferThrough() encodes and decodes correctly", () => {
    const tokenOwners = [generateRandomAddress(), generateRandomAddress()];
    const srcs = [generateRandomAddress(), generateRandomAddress()];
    const dests = [generateRandomAddress(), generateRandomAddress()];
    const wads = [BigInt(100), BigInt(200)];
    const encoded = V1HubCallsEncoder.transferThrough(tokenOwners, srcs, dests, wads );
    const decoded = new V1HubCallsDeecoder().decodeFunctionCallData(encoded);

    expect(decoded?.name).toBe('transferThrough');
    expect(decoded?.inputs).toEqual({ tokenOwners, srcs, dests, wads });
  });

  // Test for the divisor method
  test('divisor() encodes and decodes correctly', () => {
    const encoded = V1HubCallsEncoder.divisor();
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('divisor');
    expect(decoded?.args).toEqual([]);
  });

  // Test for the inflation method
  test('inflation() encodes and decodes correctly', () => {
    const encoded = V1HubCallsEncoder.inflation();
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('inflation');
    expect(decoded?.args).toEqual([]);
  });

  // Test for the initialIssuance method
  test('initialIssuance() encodes and decodes correctly', () => {
    const encoded = V1HubCallsEncoder.initialIssuance();
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('initialIssuance');
    expect(decoded?.args).toEqual([]);
  });

  // Test for the limits method
  test('limits(owner, spender) encodes and decodes correctly', () => {
    const owner = generateRandomAddress();
    const spender = generateRandomAddress();
    const encoded = V1HubCallsEncoder.limits(owner, spender);
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('limits');
    expect(decoded?.args).toEqual([owner, spender]);
  });

  // Test for the name method
  test('name() encodes and decodes correctly', () => {
    const encoded = V1HubCallsEncoder.name();
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('name');
    expect(decoded?.args).toEqual([]);
  });

  // Test for the organizations method
  test('organizations(address) encodes and decodes correctly', () => {
    const address = generateRandomAddress();
    const encoded = V1HubCallsEncoder.organizations(address);
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('organizations');
    expect(decoded?.args).toEqual([address]);
  });

  // Test for the period method
  test('period() encodes and decodes correctly', () => {
    const encoded = V1HubCallsEncoder.period();
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('period');
    expect(decoded?.args).toEqual([]);
  });

  // Test for the symbol method
  test('symbol() encodes and decodes correctly', () => {
    const encoded = V1HubCallsEncoder.symbol();
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('symbol');
    expect(decoded?.args).toEqual([]);
  });

  // Test for the timeout method
  test('timeout() encodes and decodes correctly', () => {
    const encoded = V1HubCallsEncoder.timeout();
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('timeout');
    expect(decoded?.args).toEqual([]);
  });

  // Test for the tokenToUser method
  test('tokenToUser(address) encodes and decodes correctly', () => {
    const address = generateRandomAddress();
    const encoded = V1HubCallsEncoder.tokenToUser(address);
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('tokenToUser');
    expect(decoded?.args).toEqual([address]);
  });

  // Test for the userToToken method
  test('userToToken(address) encodes and decodes correctly', () => {
    const address = generateRandomAddress();
    const encoded = V1HubCallsEncoder.userToToken(address);
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('userToToken');
    expect(decoded?.args).toEqual([address]);
  });
});
