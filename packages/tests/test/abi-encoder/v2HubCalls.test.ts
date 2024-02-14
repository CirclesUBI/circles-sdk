import { ethers } from 'ethers';
import { V2HubEncoder } from '@circles/circles-sdk-v2-abi-encoder/dist/v2HubEncoder';
import HubV2 from '@circles/circles-contracts-v2/out/Hub.sol/Hub.json';
import { HashCode, HashName } from 'multihashes';
import { decodeMultihash, encodeMultihash, generateRandomAddress, uintToAddress } from '../util';
import {
  BurnBatchInputs,
  BurnInputs, RegisterHumanInputs, SafeBatchTransferFromInputs, TrustInputs,
  V2HubCalls
} from '@circles/circles-sdk-v2-abi-decoder/src/v2HubCalls'; // Adjust the import path as necessary

describe('V2HubCalls', () => {
  const contractInterface = new ethers.Interface(HubV2.abi);

  // Test for the BETA_64x64 constant
  test('BETA_64x64() encodes and decodes correctly', () => {
    const encoded = V2HubEncoder.BETA_64x64();
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('BETA_64x64');
    expect(decoded?.args).toEqual([]);
  });

  // Test for the balanceOf method
  test('balanceOf(_account, _id) encodes and decodes correctly', () => {
    const account = generateRandomAddress();
    const id = generateRandomAddress();
    const encoded = V2HubEncoder.balanceOf(account, id);
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('balanceOf');

    const decodedAccount = decoded?.args[0];
    expect(decodedAccount).toEqual(account);

    const decodedId = decoded?.args[1];
    expect(id).toEqual(uintToAddress(BigInt((decodedId))));
  });

  // Test for the balanceOfBatch method
  test('balanceOfBatch(_accounts, _ids) encodes and decodes correctly', () => {
    const accounts = [generateRandomAddress(), generateRandomAddress()];
    const ids = [generateRandomAddress(), generateRandomAddress()];
    const encoded = V2HubEncoder.balanceOfBatch(accounts, ids);
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('balanceOfBatch');

    const decodedAccounts = decoded?.args[0];
    expect(decodedAccounts.map((p: string) => uintToAddress(BigInt(p)))).toEqual(accounts);

    const decodedIds = decoded?.args[1];
    expect(decodedIds.map((p: string) => uintToAddress(BigInt(p)))).toEqual(ids);
  });

  // Test for the burn method
  test('burn(_id, _value) encodes and decodes correctly', () => {
    const id = generateRandomAddress();
    const value = ethers.parseEther('100');
    const encoded = V2HubEncoder.burn(id, value);
    const decoded = new V2HubCalls().decodeFunctionCallData(encoded);
    const inputs = <BurnInputs>decoded.inputs;

    expect(decoded?.name).toBe('burn');
    expect(id).toEqual(uintToAddress(BigInt((inputs._id))));
    expect(BigInt(value)).toEqual(inputs._value);
  });

  // Test for the burnBatch method
  test('burnBatch(_ids, _values) encodes and decodes correctly', () => {
    const ids = [generateRandomAddress(), generateRandomAddress()];
    const values = [ethers.parseEther('100'), ethers.parseEther('200')];
    const encoded = V2HubEncoder.burnBatch(ids, values);
    const decoded = new V2HubCalls().decodeFunctionCallData(encoded);
    const inputs = <BurnBatchInputs>decoded.inputs;

    expect(decoded?.name).toBe('burnBatch');
    expect(inputs._ids.map((id) => uintToAddress(BigInt(id)))).toEqual(ids);
    expect(inputs._values.map((val) => BigInt(val))).toEqual(values);
  });

  // Test for the safeBatchTransferFrom method
  test('safeBatchTransferFrom(_from, _to, _ids, _values, _data) encodes and decodes correctly', () => {
    const from = generateRandomAddress();
    const to = generateRandomAddress();
    const ids = [generateRandomAddress(), generateRandomAddress()];
    const values = [ethers.parseEther('100'), ethers.parseEther('200')];
    const data = '0x1234567890abcdef';
    const encoded = V2HubEncoder.safeBatchTransferFrom(from, to, ids, values, data);
    const decoded = new V2HubCalls().decodeFunctionCallData(encoded);
    const inputs = <SafeBatchTransferFromInputs>decoded.inputs;

    expect(decoded?.name).toBe('safeBatchTransferFrom');
    expect(inputs._from).toEqual(from);
    expect(inputs._to).toEqual(to);
    expect(inputs._ids.map((id) => uintToAddress(BigInt(id)))).toEqual(ids);
    expect(inputs._values.map((val) => uintToAddress(BigInt(val)))).toEqual(ids);
    expect(inputs._data).toEqual(data);
  });

  // Test for the isApprovedForAll method
  test('isApprovedForAll(account, operator) encodes and decodes correctly', () => {
    const account = generateRandomAddress();
    const operator = generateRandomAddress();
    const encoded = V2HubEncoder.isApprovedForAll(account, operator);
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('isApprovedForAll');
    expect(decoded?.args).toEqual([account, operator]);
  });

  // Test for the registerHuman method
  test('registerHuman(_cidV0Digest) encodes and decodes correctly', () => {
    const cidV0 = 'QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB';
    const decodedMultihash = decodeMultihash(cidV0);

    const encoded = V2HubEncoder.registerHuman(decodedMultihash.digest);
    const decoded = new V2HubCalls().decodeFunctionCallData(encoded);
    const inputs = <RegisterHumanInputs>decoded.inputs;

    expect(decoded?.name).toBe('registerHuman');
    expect(inputs._cidV0Digest).toEqual(decodedMultihash.digest);

    const bas58Encoded = encodeMultihash(inputs._cidV0Digest, {
      code: <HashCode>18,
      name: <HashName>'sha2-256',
      length: 32,
      digest: inputs._cidV0Digest
    });
    expect(bas58Encoded).toEqual(cidV0);
  });

  // Test for the trust method
  test('trust(_trustReceiver, _expiry) encodes and decodes correctly', () => {
    const trustReceiver = generateRandomAddress();
    const expiry = BigInt('1234567890');
    const encoded = V2HubEncoder.trust(trustReceiver, expiry);
    const decoded = new V2HubCalls().decodeFunctionCallData(encoded);
    const inputs = <TrustInputs>decoded.inputs;

    expect(decoded?.name).toBe('trust');
    expect(inputs._trustReceiver).toEqual(trustReceiver);
    expect(inputs._expiry).toEqual(expiry);
  });

  // Test for the createERC20InflationWrapper method
  test('createERC20InflationWrapper(_tokenId, _name, _symbol) encodes and decodes correctly', () => {
    const tokenId = generateRandomAddress();
    const name = 'TestToken';
    const symbol = 'TT';
    const encoded = V2HubEncoder.createERC20InflationWrapper(tokenId, name, symbol);
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('createERC20InflationWrapper');

    const decodedTokenId = decoded?.args[0];
    expect(uintToAddress(BigInt(decodedTokenId))).toEqual(tokenId);

    const decodedName = decoded?.args[1];
    expect(decodedName).toEqual(name);

    const decodedSymbol = decoded?.args[2];
    expect(decodedSymbol).toEqual(symbol);
  });

  // Test for the groupMint method
  test('groupMint(_group, _collateral, _amounts) encodes and decodes correctly', () => {
    const group = generateRandomAddress();
    const collateral = [generateRandomAddress(), generateRandomAddress()];
    const amounts = [ethers.parseEther('1000'), ethers.parseEther('2000')];
    const encoded = V2HubEncoder.groupMint(group, collateral, amounts);
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('groupMint');

    const decodedGroup = decoded?.args[0];
    expect(ethers.isAddress(decodedGroup)).toBe(true);
    expect(decodedGroup).toEqual(group);

    const decodedCollateral = decoded?.args[1];
    expect(decodedCollateral.map((p: string) => uintToAddress(BigInt(p)))).toEqual(collateral);

    const decodedAmounts = decoded?.args[2];
    expect(decodedAmounts.map((p: string) => BigInt(p))).toEqual(amounts);
  });

  // Test for the isHuman method
  test('isHuman(_human) encodes and decodes correctly', () => {
    const human = generateRandomAddress();
    const encoded = V2HubEncoder.isHuman(human);
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('isHuman');
    expect(decoded?.args).toEqual([human]);
  });

  // Test for the registerOrganization method
  test('registerOrganization(_name, _cidV0Digest) encodes and decodes correctly', () => {
    const name = 'OrgName';
    const cidV0Digest = 'QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB';
    const decodedMultihash = decodeMultihash(cidV0Digest);

    const encoded = V2HubEncoder.registerOrganization(name, decodedMultihash.digest);
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('registerOrganization');

    const decodedName = decoded?.args[0];
    expect(decodedName).toEqual(name);

    const decodedCidV0Digest = new Uint8Array(Buffer.from(decoded?.args[1].substring(2), 'hex'));
    expect(decodedCidV0Digest).toEqual(decodedMultihash.digest);

    const bas58Encoded = encodeMultihash(decodedCidV0Digest, {
      code: <HashCode>18,
      name: <HashName>'sha2-256',
      length: 32,
      digest: decodedCidV0Digest
    });
    expect(bas58Encoded).toEqual(cidV0Digest);
  });

  // Test for the unwrapInflationaryERC20 method
  test('unwrapInflationaryERC20(_tokenId, _amount) encodes and decodes correctly', () => {
    const tokenId = generateRandomAddress();
    const amount = ethers.parseEther('1000');
    const encoded = V2HubEncoder.unwrapInflationaryERC20(tokenId, amount);
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('unwrapInflationaryERC20');

    const decodedTokenId = decoded?.args[0];
    expect(uintToAddress(BigInt(decodedTokenId))).toEqual(tokenId);

    const decodedAmount = decoded?.args[1];
    expect(BigInt(decodedAmount)).toEqual(amount);
  });

  // Test for the calculateIssuance method
  test('calculateIssuance(_human) encodes and decodes correctly', () => {
    const human = generateRandomAddress();
    const encoded = V2HubEncoder.calculateIssuance(human);
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('calculateIssuance');
    expect(decoded?.args).toEqual([human]);
  });

  // Test for the safeTransferFrom method
  test('safeTransferFrom(_from, _to, _id, _value, _data) encodes and decodes correctly', () => {
    const from = generateRandomAddress();
    const to = generateRandomAddress();
    const id = generateRandomAddress();
    const value = ethers.parseEther('1000');
    const data = '0x0123456789abcdef';
    const encoded = V2HubEncoder.safeTransferFrom(from, to, id, value, data);
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('safeTransferFrom');

    const decodedFrom = decoded?.args[0];
    expect(decodedFrom).toEqual(from);

    const decodedTo = decoded?.args[1];
    expect(decodedTo).toEqual(to);

    const decodedId = decoded?.args[2];
    expect(uintToAddress(BigInt(decodedId))).toEqual(id);

    const decodedValue = decoded?.args[3];
    expect(BigInt(decodedValue)).toEqual(value);

    const decodedData = decoded?.args[4];
    expect(decodedData).toEqual(data);
  });

  // Test for the setApprovalForAll method
  test('setApprovalForAll(operator, approved) encodes and decodes correctly', () => {
    const operator = generateRandomAddress();
    const approved = true;
    const encoded = V2HubEncoder.setApprovalForAll(operator, approved);
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('setApprovalForAll');
    expect(decoded?.args).toEqual([operator, approved]);
  });

  // Test for the uri method
  test('uri(_id) encodes and decodes correctly', () => {
    const id = generateRandomAddress();
    const encoded = V2HubEncoder.uri(id);
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('uri');

    const decodedId = decoded?.args[0];
    expect(uintToAddress(BigInt(decodedId))).toEqual(id);
  });

  // Test for the mintPolicies method
  test('mintPolicies(_address) encodes and decodes correctly', () => {
    const address = generateRandomAddress();
    const encoded = V2HubEncoder.mintPolicies(address);
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('mintPolicies');
    expect(decoded?.args).toEqual([address]);
  });

  // Test for the trustMarkers method
  test('trustMarkers(_truster, _trustee) encodes and decodes correctly', () => {
    const truster = generateRandomAddress();
    const trustee = generateRandomAddress();
    const encoded = V2HubEncoder.trustMarkers(truster, trustee);
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('trustMarkers');
    expect(decoded?.args).toEqual([truster, trustee]);
  });

  // Test for complex methods like registerCustomGroup, demonstrating handling of multiple parameters
  test('registerCustomGroup(_mint, _treasury, _name, _symbol, _cidV0Digest) encodes and decodes correctly', () => {
    const mint = generateRandomAddress();
    const treasury = generateRandomAddress();
    const name = 'GroupName';
    const symbol = 'GN';
    const cidV0Digest = 'QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB';
    const decodedMultihash = decodeMultihash(cidV0Digest);

    const encoded = V2HubEncoder.registerCustomGroup(mint, treasury, name, symbol, decodedMultihash.digest);
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('registerCustomGroup');

    const decodedMint = decoded?.args[0];
    expect(decodedMint).toEqual(mint);

    const decodedTreasury = decoded?.args[1];
    expect(decodedTreasury).toEqual(treasury);

    const decodedName = decoded?.args[2];
    expect(decodedName).toEqual(name);

    const decodedSymbol = decoded?.args[3];
    expect(decodedSymbol).toEqual(symbol);

    const decodedCidV0Digest = new Uint8Array(Buffer.from(decoded?.args[4].substring(2), 'hex'));
    expect(decodedCidV0Digest).toEqual(decodedMultihash.digest);

    const bas58Encoded = encodeMultihash(decodedCidV0Digest, {
      code: <HashCode>18,
      name: <HashName>'sha2-256',
      length: 32,
      digest: decodedCidV0Digest
    });
    expect(bas58Encoded).toEqual(cidV0Digest);
  });
});
