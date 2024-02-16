import { ethers, keccak256 } from 'ethers';
import { V2HubCalls as V2HubCallsEncoder } from '@circles/circles-sdk-v2-abi-encoder/dist';
import {
  InviteHumanAsOrganizationInputs,
  InviteHumanInputs,
  OperatorPathTransferInputs,
  PersonalMintInputs,
  RegisterGroupInputs,
  SetApprovalForAllInputs, SetIpfsCidV0Inputs, SingleSourcePathTransferInputs, StopInputs,
  V2HubCalls as V2HubCallsDecoder
} from '@circles/circles-sdk-v2-abi-decoder/dist';
import HubV2 from '@circles/circles-contracts-v2/out/Hub.sol/Hub.json';
import { HashCode, HashName } from 'multihashes';
import { decodeMultihash, encodeMultihash, generateRandomAddress, uintToAddress } from '../util';
import {
  BurnBatchInputs,
  BurnInputs,
  RegisterCustomGroupInputs,
  RegisterHumanInputs, RegisterOrganizationInputs,
  SafeBatchTransferFromInputs, SafeTransferFromInputs,
  TrustInputs_v2
} from '@circles/circles-sdk-v2-abi-decoder/dist';

describe('V2HubCalls', () => {
  const contractInterface = new ethers.Interface(HubV2.abi);

  test('BETA_64x64() encodes and decodes correctly', () => {
    const encoded = V2HubCallsEncoder.BETA_64x64();
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('BETA_64x64');
    expect(decoded?.args).toEqual([]);
  });

  // GAMMA_64x64
  test('GAMMA_64x64() encodes and decodes correctly', () => {
    const encoded = V2HubCallsEncoder.GAMMA_64x64();
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('GAMMA_64x64');
    expect(decoded?.args).toEqual([]);
  });

  // INDEFINITE_FUTURE
  test('INDEFINITE_FUTURE() encodes and decodes correctly', () => {
    const encoded = V2HubCallsEncoder.INDEFINITE_FUTURE();
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('INDEFINITE_FUTURE');
    expect(decoded?.args).toEqual([]);
  });

  // ISSUANCE_PER_SECOND
  test('ISSUANCE_PER_SECOND() encodes and decodes correctly', () => {
    const encoded = V2HubCallsEncoder.ISSUANCE_PER_SECOND();
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('ISSUANCE_PER_SECOND');
    expect(decoded?.args).toEqual([]);
  });

  // MINIMUM_DONATION
  test('MINIMUM_DONATION() encodes and decodes correctly', () => {
    const encoded = V2HubCallsEncoder.MINIMUM_DONATION();
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('MINIMUM_DONATION');
    expect(decoded?.args).toEqual([]);
  });

  // SENTINEL
  test('SENTINEL() encodes and decodes correctly', () => {
    const encoded = V2HubCallsEncoder.SENTINEL();
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('SENTINEL');
    expect(decoded?.args).toEqual([]);
  });

  // WELCOME_BONUS
  test('WELCOME_BONUS() encodes and decodes correctly', () => {
    const encoded = V2HubCallsEncoder.WELCOME_BONUS();
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('WELCOME_BONUS');
    expect(decoded?.args).toEqual([]);
  });

  // avatars
  test('avatars(_address) encodes and decodes correctly', () => {
    const address = generateRandomAddress();
    const encoded = V2HubCallsEncoder.avatars(address);
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('avatars');
    expect(decoded?.args).toEqual([address]);
  });

  test('balanceOf(_account, _id) encodes and decodes correctly', () => {
    const account = generateRandomAddress();
    const id = generateRandomAddress();
    const encoded = V2HubCallsEncoder.balanceOf(account, id);
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('balanceOf');

    const decodedAccount = decoded?.args[0];
    expect(decodedAccount).toEqual(account);

    const decodedId = decoded?.args[1];
    expect(id).toEqual(uintToAddress(BigInt((decodedId))));
  });

  test('balanceOfBatch(_accounts, _ids) encodes and decodes correctly', () => {
    const accounts = [generateRandomAddress(), generateRandomAddress()];
    const ids = [generateRandomAddress(), generateRandomAddress()];
    const encoded = V2HubCallsEncoder.balanceOfBatch(accounts, ids);
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('balanceOfBatch');

    const decodedAccounts = decoded?.args[0];
    expect(decodedAccounts.map((p: string) => uintToAddress(BigInt(p)))).toEqual(accounts);

    const decodedIds = decoded?.args[1];
    expect(decodedIds.map((p: string) => uintToAddress(BigInt(p)))).toEqual(ids);
  });

  test('burn(_id, _value) encodes and decodes correctly', () => {
    const id = generateRandomAddress();
    const value = ethers.parseEther('100');
    const encoded = V2HubCallsEncoder.burn(id, value);
    const decoded = new V2HubCallsDecoder().decodeFunctionCallData(encoded);
    const inputs = <BurnInputs>decoded.inputs;

    expect(decoded?.name).toBe('burn');
    expect(id).toEqual(uintToAddress(BigInt((inputs._id))));
    expect(BigInt(value)).toEqual(inputs._value);
  });

  test('burnBatch(_ids, _values) encodes and decodes correctly', () => {
    const ids = [generateRandomAddress(), generateRandomAddress()];
    const values = [ethers.parseEther('100'), ethers.parseEther('200')];
    const encoded = V2HubCallsEncoder.burnBatch(ids, values);
    const decoded = new V2HubCallsDecoder().decodeFunctionCallData(encoded);
    const inputs = <BurnBatchInputs>decoded.inputs;

    expect(decoded?.name).toBe('burnBatch');
    expect(inputs._ids.map((id) => uintToAddress(BigInt(id)))).toEqual(ids);
    expect(inputs._values.map((val) => BigInt(val))).toEqual(values);
  });

  test('calculateIssuance(_human) encodes and decodes correctly', () => {
    const human = generateRandomAddress();
    const encoded = V2HubCallsEncoder.calculateIssuance(human);
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('calculateIssuance');
    expect(decoded?.args).toEqual([human]);
  });

  test('createERC20InflationWrapper(_tokenId, _name, _symbol) encodes and decodes correctly', () => {
    const tokenId = generateRandomAddress();
    const name = 'TestToken';
    const symbol = 'TT';
    const encoded = V2HubCallsEncoder.createERC20InflationWrapper(tokenId, name, symbol);
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('createERC20InflationWrapper');

    const decodedTokenId = decoded?.args[0];
    expect(uintToAddress(BigInt(decodedTokenId))).toEqual(tokenId);

    const decodedName = decoded?.args[1];
    expect(decodedName).toEqual(name);

    const decodedSymbol = decoded?.args[2];
    expect(decodedSymbol).toEqual(symbol);
  });

  // demurrage_day_zero
  test('demurrage_day_zero() encodes and decodes correctly', () => {
    const encoded = V2HubCallsEncoder.demurrage_day_zero();
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('demurrage_day_zero');
    expect(decoded?.args).toEqual([]);
  });

  // getDeterministicAddress
  test('getDeterministicAddress(_tokenId, _bytecodeHash) encodes and decodes correctly', () => {
    const tokenId = generateRandomAddress();
    const bytecodeHash = keccak256('0x1234567890abcdef');
    const encoded = V2HubCallsEncoder.getDeterministicAddress(tokenId, bytecodeHash);
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('getDeterministicAddress');
    expect(uintToAddress(BigInt(decoded?.args[0]))).toEqual(tokenId);
    expect(decoded?.args[1]).toEqual(bytecodeHash);
  });

  test('groupMint(_group, _collateral, _amounts) encodes and decodes correctly', () => {
    const group = generateRandomAddress();
    const collateral = [generateRandomAddress(), generateRandomAddress()];
    const amounts = [ethers.parseEther('1000'), ethers.parseEther('2000')];
    const encoded = V2HubCallsEncoder.groupMint(group, collateral, amounts);
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

  // hubV1
  test('hubV1() encodes and decodes correctly', () => {
    const encoded = V2HubCallsEncoder.hubV1();
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('hubV1');
    expect(decoded?.args).toEqual([]);
  });

  // inflationaryBurn
  test('inflationaryBurn(_id, _value) encodes and decodes correctly', () => {
    const id = generateRandomAddress();
    const value = ethers.parseEther('1000');
    const encoded = V2HubCallsEncoder.inflationaryBurn(id, value);
    const decoded = new V2HubCallsDecoder().decodeFunctionCallData(encoded);
    const inputs = <BurnInputs>decoded.inputs;

    expect(decoded?.name).toBe('inflationaryBurn');
    expect(id).toEqual(uintToAddress(BigInt((inputs._id))));
    expect(BigInt(value)).toEqual(inputs._value);
  });

  // inflationaryBurnBatch
  test('inflationaryBurnBatch(_ids, _values) encodes and decodes correctly', () => {
    const ids = [generateRandomAddress(), generateRandomAddress()];
    const values = [ethers.parseEther('100'), ethers.parseEther('200')];
    const encoded = V2HubCallsEncoder.inflationaryBurnBatch(ids, values);
    const decoded = new V2HubCallsDecoder().decodeFunctionCallData(encoded);
    const inputs = <BurnBatchInputs>decoded.inputs;

    expect(decoded?.name).toBe('inflationaryBurnBatch');
    expect(inputs._ids.map((id) => uintToAddress(BigInt(id)))).toEqual(ids);
    expect(inputs._values.map((val) => BigInt(val))).toEqual(values);
  });

  // inflationarySafeBatchTransferFrom
  test('inflationarySafeBatchTransferFrom(_from, _to, _ids, _values, _data) encodes and decodes correctly', () => {
    const from = generateRandomAddress();
    const to = generateRandomAddress();
    const ids = [generateRandomAddress(), generateRandomAddress()];
    const values = [ethers.parseEther('100'), ethers.parseEther('200')];
    const data = '0x1234567890abcdef';
    const encoded = V2HubCallsEncoder.inflationarySafeBatchTransferFrom(from, to, ids, values, data);
    const decoded = new V2HubCallsDecoder().decodeFunctionCallData(encoded);
    const inputs = <SafeBatchTransferFromInputs>decoded.inputs;

    expect(decoded?.name).toBe('inflationarySafeBatchTransferFrom');
    expect(inputs._from).toEqual(from);
    expect(inputs._to).toEqual(to);
    expect(inputs._ids.map((id) => uintToAddress(BigInt(id)))).toEqual(ids);
    expect(inputs._values.map((val) => BigInt(val))).toEqual(values);
    expect(inputs._data).toEqual(data);
  });

  // inflationarySafeTransferFrom
  test('inflationarySafeTransferFrom(_from, _to, _id, _value, _data) encodes and decodes correctly', () => {
    const from = generateRandomAddress();
    const to = generateRandomAddress();
    const id = generateRandomAddress();
    const value = ethers.parseEther('1000');
    const data = '0x0123456789abcdef';
    const encoded = V2HubCallsEncoder.inflationarySafeTransferFrom(from, to, id, value, data);
    const decoded = new V2HubCallsDecoder().decodeFunctionCallData(encoded);
    const inputs = <SafeTransferFromInputs>decoded.inputs;

    expect(decoded?.name).toBe('inflationarySafeTransferFrom');
    expect(inputs._from).toEqual(from);
    expect(inputs._to).toEqual(to);
    expect(uintToAddress(BigInt(inputs._id))).toEqual(id);
    expect(BigInt(inputs._value)).toEqual(value);
    expect(inputs._data).toEqual(data);
  });

  // invitationOnlyTime
  test('invitationOnlyTime() encodes and decodes correctly', () => {
    const encoded = V2HubCallsEncoder.invitationOnlyTime();
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('invitationOnlyTime');
    expect(decoded?.args).toEqual([]);
  });

  // inviteHuman
  test('inviteHuman(_human) encodes and decodes correctly', () => {
    const human = generateRandomAddress();
    const encoded = V2HubCallsEncoder.inviteHuman(human);
    const decoded = new V2HubCallsDecoder().decodeFunctionCallData(encoded);
    const inputs = <InviteHumanInputs>decoded.inputs;

    expect(decoded?.name).toBe('inviteHuman');
    expect(inputs._human).toEqual(human);
  });

  // inviteHumanAsOrganization
  test('inviteHumanAsOrganization(_human, _donationReceiver) encodes and decodes correctly', () => {
    const human = generateRandomAddress();
    const donationReceiver = generateRandomAddress();
    const encoded = V2HubCallsEncoder.inviteHumanAsOrganization(human, donationReceiver);
    const decoded = new V2HubCallsDecoder().decodeFunctionCallData(encoded);
    const inputs = <InviteHumanAsOrganizationInputs>decoded.inputs;

    expect(decoded?.name).toBe('inviteHumanAsOrganization');
    expect(inputs._human).toEqual(human);
    expect(inputs._donationReceiver).toEqual(donationReceiver);
  });

  test('isApprovedForAll(account, operator) encodes and decodes correctly', () => {
    const account = generateRandomAddress();
    const operator = generateRandomAddress();
    const encoded = V2HubCallsEncoder.isApprovedForAll(account, operator);
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('isApprovedForAll');
    expect(decoded?.args).toEqual([account, operator]);
  });

  // isGroup
  test('isGroup(_group) encodes and decodes correctly', () => {
    const group = generateRandomAddress();
    const encoded = V2HubCallsEncoder.isGroup(group);
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('isGroup');
    expect(decoded?.args).toEqual([group]);
  });

  test('isHuman(_human) encodes and decodes correctly', () => {
    const human = generateRandomAddress();
    const encoded = V2HubCallsEncoder.isHuman(human);
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('isHuman');
    expect(decoded?.args).toEqual([human]);
  });

  // isOrganization
  test('isOrganization(_organization) encodes and decodes correctly', () => {
    const organization = generateRandomAddress();
    const encoded = V2HubCallsEncoder.isOrganization(organization);
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('isOrganization');
    expect(decoded?.args).toEqual([organization]);
  });

  test('mintPolicies(_address) encodes and decodes correctly', () => {
    const address = generateRandomAddress();
    const encoded = V2HubCallsEncoder.mintPolicies(address);
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('mintPolicies');
    expect(decoded?.args).toEqual([address]);
  });

  // mintTimes
  test('mintTimes(_address) encodes and decodes correctly', () => {
    const address = generateRandomAddress();
    const encoded = V2HubCallsEncoder.mintTimes(address);
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('mintTimes');
    expect(decoded?.args).toEqual([address]);
  });

  // names
  test('names(_address) encodes and decodes correctly', () => {
    const address = generateRandomAddress();
    const encoded = V2HubCallsEncoder.names(address);
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('names');
    expect(decoded?.args).toEqual([address]);
  });

  // operatorPathTransfer
  test('operatorPathTransfer() encodes and decodes correctly', () => {
    // TODO: This operation is not yet implemented in the contract
    const encoded = V2HubCallsEncoder.operatorPathTransfer();
    const decoded = new V2HubCallsDecoder().decodeFunctionCallData(encoded);
    const inputs = <OperatorPathTransferInputs>decoded.inputs;

    expect(decoded?.name).toBe('operatorPathTransfer');
    expect(inputs).toEqual([]);
  });

  // personalMint
  test('personalMint() encodes and decodes correctly', () => {
    const encoded = V2HubCallsEncoder.personalMint();
    const decoded = new V2HubCallsDecoder().decodeFunctionCallData(encoded);
    const inputs = <PersonalMintInputs>decoded.inputs;

    expect(decoded?.name).toBe('personalMint');
    expect(inputs).toEqual([]);
  });

  test('registerCustomGroup(_mint, _treasury, _name, _symbol, _cidV0Digest) encodes and decodes correctly', () => {
    const mint = generateRandomAddress();
    const treasury = generateRandomAddress();
    const name = 'GroupName';
    const symbol = 'GN';
    const cidV0Digest = 'QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB';
    const decodedMultihash = decodeMultihash(cidV0Digest);

    const encoded = V2HubCallsEncoder.registerCustomGroup(mint, treasury, name, symbol, decodedMultihash.digest);
    const decoded = new V2HubCallsDecoder().decodeFunctionCallData(encoded);
    const inputs = <RegisterCustomGroupInputs>decoded.inputs;

    expect(decoded?.name).toBe('registerCustomGroup');
    expect(inputs._mint).toEqual(mint);
    expect(inputs._treasury).toEqual(treasury);
    expect(inputs._name).toEqual(name);
    expect(inputs._symbol).toEqual(symbol);
    expect(inputs._cidV0Digest).toEqual(decodedMultihash.digest);

    const bas58Encoded = encodeMultihash(inputs._cidV0Digest, {
      code: <HashCode>18,
      name: <HashName>'sha2-256',
      length: 32,
      digest: inputs._cidV0Digest
    });
    expect(bas58Encoded).toEqual(cidV0Digest);
  });

  test('registerGroup(_name, _symbol, _cidV0Digest) encodes and decodes correctly', () => {
    const name = 'GroupName';
    const symbol = 'GN';
    const cidV0Digest = 'QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB';
    const decodedMultihash = decodeMultihash(cidV0Digest);

    const encoded = V2HubCallsEncoder.registerGroup(generateRandomAddress(), name, symbol, decodedMultihash.digest);
    const decoded = new V2HubCallsDecoder().decodeFunctionCallData(encoded);
    const inputs = <RegisterGroupInputs>decoded.inputs;

    expect(decoded?.name).toBe('registerGroup');
    expect(inputs._name).toEqual(name);
    expect(inputs._symbol).toEqual(symbol);
    expect(inputs._cidV0Digest).toEqual(decodedMultihash.digest);

    const bas58Encoded = encodeMultihash(inputs._cidV0Digest, {
      code: <HashCode>18,
      name: <HashName>'sha2-256',
      length: 32,
      digest: inputs._cidV0Digest
    });
    expect(bas58Encoded).toEqual(cidV0Digest);
  });

  test('registerHuman(_cidV0Digest) encodes and decodes correctly', () => {
    const cidV0 = 'QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB';
    const decodedMultihash = decodeMultihash(cidV0);

    const encoded = V2HubCallsEncoder.registerHuman(decodedMultihash.digest);
    const decoded = new V2HubCallsDecoder().decodeFunctionCallData(encoded);
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

  test('registerOrganization(_name, _cidV0Digest) encodes and decodes correctly', () => {
    const name = 'OrgName';
    const cidV0Digest = 'QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB';
    const decodedMultihash = decodeMultihash(cidV0Digest);

    const encoded = V2HubCallsEncoder.registerOrganization(name, decodedMultihash.digest);
    const decoded = new V2HubCallsDecoder().decodeFunctionCallData(encoded);
    const inputs = <RegisterOrganizationInputs>decoded.inputs;

    expect(decoded?.name).toBe('registerOrganization');
    expect(inputs._name).toEqual(name);
    expect(inputs._cidV0Digest).toEqual(decodedMultihash.digest);

    const bas58Encoded = encodeMultihash(inputs._cidV0Digest, {
      code: <HashCode>18,
      name: <HashName>'sha2-256',
      length: 32,
      digest: inputs._cidV0Digest
    });
    expect(bas58Encoded).toEqual(cidV0Digest);
  });

  test('safeBatchTransferFrom(_from, _to, _ids, _values, _data) encodes and decodes correctly', () => {
    const from = generateRandomAddress();
    const to = generateRandomAddress();
    const ids = [generateRandomAddress(), generateRandomAddress()];
    const values = [ethers.parseEther('100'), ethers.parseEther('200')];
    const data = '0x1234567890abcdef';
    const encoded = V2HubCallsEncoder.safeBatchTransferFrom(from, to, ids, values, data);
    const decoded = new V2HubCallsDecoder().decodeFunctionCallData(encoded);
    const inputs = <SafeBatchTransferFromInputs>decoded.inputs;

    expect(decoded?.name).toBe('safeBatchTransferFrom');
    expect(inputs._from).toEqual(from);
    expect(inputs._to).toEqual(to);
    expect(inputs._ids.map((id) => uintToAddress(BigInt(id)))).toEqual(ids);
    expect(inputs._values.map((val) => BigInt(val))).toEqual(values);
    expect(inputs._data).toEqual(data);
  });

  test('safeTransferFrom(_from, _to, _id, _value, _data) encodes and decodes correctly', () => {
    const from = generateRandomAddress();
    const to = generateRandomAddress();
    const id = generateRandomAddress();
    const value = ethers.parseEther('1000');
    const data = '0x0123456789abcdef';
    const encoded = V2HubCallsEncoder.safeTransferFrom(from, to, id, value, data);
    const decoded = new V2HubCallsDecoder().decodeFunctionCallData(encoded);
    const inputs = <SafeTransferFromInputs>decoded.inputs;

    expect(decoded?.name).toBe('safeTransferFrom');
    expect(inputs._from).toEqual(from);
    expect(inputs._to).toEqual(to);
    expect(uintToAddress(BigInt(inputs._id))).toEqual(id);
    expect(BigInt(inputs._value)).toEqual(value);
    expect(inputs._data).toEqual(data);
  });

  test('setApprovalForAll(operator, approved) encodes and decodes correctly', () => {
    const operator = generateRandomAddress();
    const approved = true;
    const encoded = V2HubCallsEncoder.setApprovalForAll(operator, approved);
    const decoded = new V2HubCallsDecoder().decodeFunctionCallData(encoded);
    const inputs = <SetApprovalForAllInputs>decoded.inputs;

    expect(decoded?.name).toBe('setApprovalForAll');
    expect(inputs.operator).toEqual(operator);
    expect(inputs.approved).toEqual(approved);
  });

  // setIpfsCidV0
  test('setIpfsCidV0(_cidV0Digest) encodes and decodes correctly', () => {
    const cidV0Digest = 'QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB';
    const decodedMultihash = decodeMultihash(cidV0Digest);

    const encoded = V2HubCallsEncoder.setIpfsCidV0(decodedMultihash.digest);
    const decoded = new V2HubCallsDecoder().decodeFunctionCallData(encoded);
    const inputs = <SetIpfsCidV0Inputs>decoded.inputs;

    expect(decoded?.name).toBe('setIpfsCidV0');
    expect(inputs._ipfsCid).toEqual(decodedMultihash.digest);
  });

  // singleSourcePathTransfer
  test('singleSourcePathTransfer() encodes and decodes correctly', () => {
    // TODO: This operation is not yet implemented in the contract
    const encoded = V2HubCallsEncoder.singleSourcePathTransfer();
    const decoded = new V2HubCallsDecoder().decodeFunctionCallData(encoded);
    const inputs = <SingleSourcePathTransferInputs>decoded.inputs;

    expect(decoded?.name).toBe('singleSourcePathTransfer');
    expect(inputs).toEqual([]);
  });

  // standardTreasury
  test('standardTreasury() encodes and decodes correctly', () => {
    const encoded = V2HubCallsEncoder.standardTreasury();
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('standardTreasury');
    expect(decoded?.args).toEqual([]);
  });

  // stop
  test('stop() encodes and decodes correctly', () => {
    const encoded = V2HubCallsEncoder.stop();
    const decoded = new V2HubCallsDecoder().decodeFunctionCallData(encoded);
    const inputs = <StopInputs>decoded.inputs;

    expect(decoded?.name).toBe('stop');
    expect(inputs).toEqual([]);
  });

  // stopped
  test('stopped() encodes and decodes correctly', () => {
    const address = generateRandomAddress();
    const encoded = V2HubCallsEncoder.stopped(address);
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('stopped');
    expect(decoded?.args).toEqual([address]);
  });

  // symbols
  test('symbols(_address) encodes and decodes correctly', () => {
    const address = generateRandomAddress();
    const encoded = V2HubCallsEncoder.symbols(address);
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('symbols');
    expect(decoded?.args).toEqual([address]);
  });

  // tokenIDToInfERC20
  test('tokenIDToInfERC20(_tokenId) encodes and decodes correctly', () => {
    const tokenId = generateRandomAddress();
    const encoded = V2HubCallsEncoder.tokenIDToInfERC20(tokenId);
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('tokenIDToInfERC20');
    expect(uintToAddress(BigInt(decoded?.args[0]))).toEqual(tokenId);
  });

  // tokenIdToCidV0Digest
  test('tokenIdToCidV0Digest(_tokenId) encodes and decodes correctly', () => {
    const tokenId = generateRandomAddress();
    const encoded = V2HubCallsEncoder.tokenIdToCidV0Digest(tokenId);
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('tokenIdToCidV0Digest');
    expect(uintToAddress(BigInt(decoded?.args[0]))).toEqual(tokenId);
  });

  // treasuries
  test('treasuries(_address) encodes and decodes correctly', () => {
    const address = generateRandomAddress();
    const encoded = V2HubCallsEncoder.treasuries(address);
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('treasuries');
    expect(decoded?.args).toEqual([address]);
  });

  test('trust(_trustReceiver, _expiry) encodes and decodes correctly', () => {
    const trustReceiver = generateRandomAddress();
    const expiry = BigInt('1234567890');
    const encoded = V2HubCallsEncoder.trust(trustReceiver, expiry);
    const decoded = new V2HubCallsDecoder().decodeFunctionCallData(encoded);
    const inputs = <TrustInputs_v2>decoded.inputs;

    expect(decoded?.name).toBe('trust');
    expect(inputs._trustReceiver).toEqual(trustReceiver);
    expect(inputs._expiry).toEqual(expiry);
  });

  test('trustMarkers(_truster, _trustee) encodes and decodes correctly', () => {
    const truster = generateRandomAddress();
    const trustee = generateRandomAddress();
    const encoded = V2HubCallsEncoder.trustMarkers(truster, trustee);
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('trustMarkers');
    expect(decoded?.args).toEqual([truster, trustee]);
  });

  test('unwrapInflationaryERC20(_tokenId, _amount) encodes and decodes correctly', () => {
    const tokenId = generateRandomAddress();
    const amount = ethers.parseEther('1000');
    const encoded = V2HubCallsEncoder.unwrapInflationaryERC20(tokenId, amount);
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('unwrapInflationaryERC20');

    const decodedTokenId = decoded?.args[0];
    expect(uintToAddress(BigInt(decodedTokenId))).toEqual(tokenId);

    const decodedAmount = decoded?.args[1];
    expect(BigInt(decodedAmount)).toEqual(amount);
  });

  test('uri(_id) encodes and decodes correctly', () => {
    const id = generateRandomAddress();
    const encoded = V2HubCallsEncoder.uri(id);
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('uri');

    const decodedId = decoded?.args[0];
    expect(uintToAddress(BigInt(decodedId))).toEqual(id);
  });

  // wrapInflationaryERC20
  test('wrapInflationaryERC20(_tokenId, _amount) encodes and decodes correctly', () => {
    const tokenId = generateRandomAddress();
    const amount = ethers.parseEther('1000');
    const encoded = V2HubCallsEncoder.wrapInflationaryERC20(tokenId, amount);
    const decoded = contractInterface.parseTransaction({ data: encoded });

    expect(decoded?.name).toBe('wrapInflationaryERC20');

    const decodedTokenId = decoded?.args[0];
    expect(uintToAddress(BigInt(decodedTokenId))).toEqual(tokenId);

    const decodedAmount = decoded?.args[1];
    expect(BigInt(decodedAmount)).toEqual(amount);
  });
});
