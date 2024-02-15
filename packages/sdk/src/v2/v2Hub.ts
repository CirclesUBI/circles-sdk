import { Provider } from '@circles/circles-sdk-v2-providers/dist/provider';
import { V2HubCalls } from '@circles/circles-sdk-v2-abi-encoder/src/v2HubCalls';
import { ethers, TransactionReceipt } from 'ethers';
import { EventEmitter } from '@circles-sdk-v2/circles-v2-test/dist/tests/test/sdk/eventEmitter';
import {
  ParsedV2HubEvent, V2HubEvent,
  V2HubEvents
} from '@circles/circles-sdk-v2-abi-decoder/dist/v2HubEvents';

export type TrustMarker = {
  previous: string;
  expiry: bigint;
}
export class V2Hub {
  readonly address: string;
  private readonly provider: Provider;
  private readonly eventDecoder: V2HubEvents = new V2HubEvents();

  private readonly _onEvent: EventEmitter<ParsedV2HubEvent<V2HubEvent>> = new EventEmitter();
  public readonly onEvent = this._onEvent.subscribe;

  constructor(provider: Provider, address: string) {
    this.provider = provider;
    this.address = address;
  }

  BETA_64x64 = async (): Promise<bigint> =>
    BigInt(await this.provider.call({
      to: this.address,
      data: V2HubCalls.BETA_64x64()
    }));

  GAMMA_64x64 = async (): Promise<bigint> =>
    BigInt(await this.provider.call({
      to: this.address,
      data: V2HubCalls.GAMMA_64x64()
    }));

  INDEFINITE_FUTURE = async (): Promise<bigint> =>
    BigInt(await this.provider.call({
      to: this.address,
      data: V2HubCalls.INDEFINITE_FUTURE()
    }));

  ISSUANCE_PER_SECOND = async (): Promise<bigint> =>
    BigInt(await this.provider.call({
      to: this.address,
      data: V2HubCalls.ISSUANCE_PER_SECOND()
    }));

  MAX_CLAIM_DURATION = async (): Promise<bigint> =>
    BigInt(await this.provider.call({
      to: this.address,
      data: V2HubCalls.MAX_CLAIM_DURATION()
    }));

  MINIMUM_DONATION = async (): Promise<bigint> =>
    BigInt(await this.provider.call({
      to: this.address,
      data: V2HubCalls.MINIMUM_DONATION()
    }));

  SENTINEL = async (): Promise<bigint> =>
    BigInt(await this.provider.call({
      to: this.address,
      data: V2HubCalls.SENTINEL()
    }));

  WELCOME_BONUS = async (): Promise<bigint> =>
    BigInt(await this.provider.call({
      to: this.address,
      data: V2HubCalls.WELCOME_BONUS()
    }));

  avatars = async (address: string): Promise<string> =>
    await this.provider.call({
      to: this.address,
      data: V2HubCalls.avatars(address)
    });

  balanceOf = async (account: string, id: string): Promise<bigint> =>
    BigInt(await this.provider.call({
      to: this.address,
      data: V2HubCalls.balanceOf(account, id)
    }));

  // balanceOfBatch = async (accounts: string[], ids: string[]): Promise<bigint[]> =>
  //   await this.provider.call({
  //     to: this.address,
  //     data: V2HubCalls.balanceOfBatch(accounts, ids)
  //   });

  burn = async (id: string, value: bigint): Promise<ethers.TransactionReceipt> => {
    const tx = await this.provider.sendTransaction({
      to: this.address,
      data: V2HubCalls.burn(id, value)
    });
    const receipt = await tx.wait();
    if (!receipt || receipt.status !== 1) {
      throw new Error('burn failed');
    }
    this.emitEvents(receipt);
    return receipt;
  }

  burnBatch = async (ids: string[], values: bigint[]): Promise<ethers.TransactionReceipt> => {
    const tx = await this.provider.sendTransaction({
      to: this.address,
      data: V2HubCalls.burnBatch(ids, values)
    });
    const receipt = await tx.wait();
    if (!receipt || receipt.status !== 1) {
      throw new Error('burnBatch failed');
    }
    this.emitEvents(receipt);
    return receipt;
  }

  calculateIssuance = async (human: string): Promise<bigint> =>
    BigInt(await this.provider.call({
      to: this.address,
      data: V2HubCalls.calculateIssuance(human)
    }));

  createERC20InflationWrapper = async (tokenId: string, name: string, symbol: string): Promise<ethers.TransactionReceipt> => {
    const tx = await this.provider.sendTransaction({
      to: this.address,
      data: V2HubCalls.createERC20InflationWrapper(tokenId, name, symbol)
    });
    const receipt = await tx.wait();
    if (!receipt || receipt.status !== 1) {
      throw new Error('createERC20InflationWrapper failed');
    }
    this.emitEvents(receipt);
    return receipt;
  }

  demurrage_day_zero = async (): Promise<bigint> =>
    BigInt(await this.provider.call({
      to: this.address,
      data: V2HubCalls.demurrage_day_zero()
    }));

  getDeterministicAddress = async (tokenId: string, bytecodeHash: string): Promise<string> =>
    await this.provider.call({
      to: this.address,
      data: V2HubCalls.getDeterministicAddress(tokenId, bytecodeHash)
    });

  groupMint = async (group: string, collateral: string[], amounts: bigint[]): Promise<ethers.TransactionReceipt> => {
    const tx = await this.provider.sendTransaction({
      to: this.address,
      data: V2HubCalls.groupMint(group, collateral, amounts)
    });
    const receipt = await tx.wait();
    if (!receipt || receipt.status !== 1) {
      throw new Error('groupMint failed');
    }
    this.emitEvents(receipt);
    return receipt;
  }

  hubV1 = async (): Promise<string> =>
    await this.provider.call({
      to: this.address,
      data: V2HubCalls.hubV1()
    });

  inflationaryBurn = async (id: string, value: bigint): Promise<ethers.TransactionReceipt> => {
    const tx = await this.provider.sendTransaction({
      to: this.address,
      data: V2HubCalls.inflationaryBurn(id, value)
    });
    const receipt = await tx.wait();
    if (!receipt || receipt.status !== 1) {
      throw new Error('inflationaryBurn failed');
    }
    this.emitEvents(receipt);
    return receipt;
  }

  inflationaryBurnBatch = async (ids: string[], values: bigint[]): Promise<ethers.TransactionReceipt> => {
    const tx = await this.provider.sendTransaction({
      to: this.address,
      data: V2HubCalls.inflationaryBurnBatch(ids, values)
    });
    const receipt = await tx.wait();
    if (!receipt || receipt.status !== 1) {
      throw new Error('inflationaryBurnBatch failed');
    }
    this.emitEvents(receipt);
    return receipt;
  }

  inflationarySafeBatchTransferFrom = async (from: string, to: string, ids: string[], values: bigint[], data: string): Promise<ethers.TransactionReceipt> => {
    const tx = await this.provider.sendTransaction({
      to: this.address,
      data: V2HubCalls.inflationarySafeBatchTransferFrom(from, to, ids, values, data)
    });
    const receipt = await tx.wait();
    if (!receipt || receipt.status !== 1) {
      throw new Error('inflationarySafeBatchTransferFrom failed');
    }
    this.emitEvents(receipt);
    return receipt;
  }

  inflationarySafeTransferFrom = async (from: string, to: string, id: string, value: bigint, data: string): Promise<ethers.TransactionReceipt> => {
    const tx = await this.provider.sendTransaction({
      to: this.address,
      data: V2HubCalls.inflationarySafeTransferFrom(from, to, id, value, data)
    });
    const receipt = await tx.wait();
    if (!receipt || receipt.status !== 1) {
      throw new Error('inflationarySafeTransferFrom failed');
    }
    this.emitEvents(receipt);
    return receipt;
  }

  invitationOnlyTime = async (): Promise<bigint> =>
    BigInt(await this.provider.call({
      to: this.address,
      data: V2HubCalls.invitationOnlyTime()
    }));

  inviteHuman = async (human: string): Promise<ethers.TransactionReceipt> => {
    const tx = await this.provider.sendTransaction({
      to: this.address,
      data: V2HubCalls.inviteHuman(human)
    });
    const receipt = await tx.wait();
    if (!receipt || receipt.status !== 1) {
      throw new Error('inviteHuman failed');
    }
    this.emitEvents(receipt);
    return receipt;
  }

  inviteHumanAsOrganization = async (human: string, donationReceiver: string): Promise<ethers.TransactionReceipt> => {
    const tx = await this.provider.sendTransaction({
      to: this.address,
      data: V2HubCalls.inviteHumanAsOrganization(human, donationReceiver)
    });
    const receipt = await tx.wait();
    if (!receipt || receipt.status !== 1) {
      throw new Error('inviteHumanAsOrganization failed');
    }
    this.emitEvents(receipt);
    return receipt;
  }

  isApprovedForAll = async (account: string, operator: string): Promise<boolean> =>
    await this.provider.call({
      to: this.address,
      data: V2HubCalls.isApprovedForAll(account, operator)
    }) === '0x01';

  isGroup = async (group: string): Promise<boolean> =>
    await this.provider.call({
      to: this.address,
      data: V2HubCalls.isGroup(group)
    }) === '0x01';

  isHuman = async (human: string): Promise<boolean> =>
    await this.provider.call({
      to: this.address,
      data: V2HubCalls.isHuman(human)
    }) === '0x01';

  isOrganization = async (organization: string): Promise<boolean> =>
    await this.provider.call({
      to: this.address,
      data: V2HubCalls.isOrganization(organization)
    }) === '0x01';

  mintPolicies = async (group: string): Promise<string> =>
    await this.provider.call({
      to: this.address,
      data: V2HubCalls.mintPolicies(group)
    });

  mintTimes = async (human: string): Promise<string> =>
    await this.provider.call({
      to: this.address,
      data: V2HubCalls.mintTimes(human)
    });

  names = async (address: string): Promise<string> =>
    await this.provider.call({
      to: this.address,
      data: V2HubCalls.names(address)
    });

  // TODO: operatorPathTransfer

  personalMint = async (): Promise<ethers.TransactionReceipt> => {
    const tx = await this.provider.sendTransaction({
      to: this.address,
      data: V2HubCalls.personalMint()
    });
    const receipt = await tx.wait();
    if (!receipt || receipt.status !== 1) {
      throw new Error('personalMint failed');
    }
    this.emitEvents(receipt);
    return receipt;
  }

  registerCustomGroup = async (mint: string, treasury: string, name: string, symbol: string, cidV0Digest: Uint8Array): Promise<ethers.TransactionReceipt> => {
    const tx = await this.provider.sendTransaction({
      to: this.address,
      data: V2HubCalls.registerCustomGroup(mint, treasury, name, symbol, cidV0Digest)
    });
    const receipt = await tx.wait();
    if (!receipt || receipt.status !== 1) {
      throw new Error('registerCustomGroup failed');
    }
    this.emitEvents(receipt);
    return receipt;
  }

  registerGroup = async (mint: string, name: string, symbol: string, cidV0Digest: Uint8Array): Promise<ethers.TransactionReceipt> => {
    const tx = await this.provider.sendTransaction({
      to: this.address,
      data: V2HubCalls.registerGroup(mint, name, symbol, cidV0Digest)
    });
    const receipt = await tx.wait();
    if (!receipt || receipt.status !== 1) {
      throw new Error('registerGroup failed');
    }
    this.emitEvents(receipt);
    return receipt;
  }

  registerHuman = async (cidV0Digest: Uint8Array): Promise<ethers.TransactionReceipt> => {
    const tx = await this.provider.sendTransaction({
      to: this.address,
      data: V2HubCalls.registerHuman(cidV0Digest)
    });
    const receipt = await tx.wait();
    if (!receipt || receipt.status !== 1) {
      throw new Error('registerHuman failed');
    }
    this.emitEvents(receipt);
    return receipt;
  }

  registerOrganization = async (name: string, cidV0Digest: Uint8Array): Promise<ethers.TransactionReceipt> => {
    const tx = await this.provider.sendTransaction({
      to: this.address,
      data: V2HubCalls.registerOrganization(name, cidV0Digest)
    });
    const receipt = await tx.wait();
    if (!receipt || receipt.status !== 1) {
      throw new Error('registerOrganization failed');
    }
    this.emitEvents(receipt);
    return receipt;
  }

  safeBatchTransferFrom = async (from: string, to: string, ids: string[], values: bigint[], data: string): Promise<ethers.TransactionReceipt> => {
    const tx = await this.provider.sendTransaction({
      to: this.address,
      data: V2HubCalls.safeBatchTransferFrom(from, to, ids, values, data)
    });
    const receipt = await tx.wait();
    if (!receipt || receipt.status !== 1) {
      throw new Error('safeBatchTransferFrom failed');
    }
    this.emitEvents(receipt);
    return receipt;
  }

  safeTransferFrom = async (from: string, to: string, id: string, value: bigint, data: string): Promise<ethers.TransactionReceipt> => {
    const tx = await this.provider.sendTransaction({
      to: this.address,
      data: V2HubCalls.safeTransferFrom(from, to, id, value, data)
    });
    const receipt = await tx.wait();
    if (!receipt || receipt.status !== 1) {
      throw new Error('safeTransferFrom failed');
    }
    this.emitEvents(receipt);
    return receipt;
  }

  setApprovalForAll = async (operator: string, approved: boolean): Promise<ethers.TransactionReceipt> => {
    const tx = await this.provider.sendTransaction({
      to: this.address,
      data: V2HubCalls.setApprovalForAll(operator, approved)
    });
    const receipt = await tx.wait();
    if (!receipt || receipt.status !== 1) {
      throw new Error('setApprovalForAll failed');
    }
    this.emitEvents(receipt);
    return receipt;
  }

  setIpfsCidV0 = async (ipfsCid: Uint8Array): Promise<ethers.TransactionReceipt> => {
    const tx = await this.provider.sendTransaction({
      to: this.address,
      data: V2HubCalls.setIpfsCidV0(ipfsCid)
    });
    const receipt = await tx.wait();
    if (!receipt || receipt.status !== 1) {
      throw new Error('setIpfsCidV0 failed');
    }
    this.emitEvents(receipt);
    return receipt;
  }

  // TODO: singleSourcePathTransfer

  standardTreasury = async (): Promise<string> =>
    await this.provider.call({
      to: this.address,
      data: V2HubCalls.standardTreasury()
    });

  stop = async (): Promise<ethers.TransactionReceipt> => {
    const tx = await this.provider.sendTransaction({
      to: this.address,
      data: V2HubCalls.stop()
    });
    const receipt = await tx.wait();
    if (!receipt || receipt.status !== 1) {
      throw new Error('stop failed');
    }
    this.emitEvents(receipt);
    return receipt;
  }

  stopped = async (human: string): Promise<boolean> =>
    await this.provider.call({
      to: this.address,
      data: V2HubCalls.stopped(human)
    }) === "0x01";

  symbols = async (address: string): Promise<string> =>
    await this.provider.call({
      to: this.address,
      data: V2HubCalls.symbols(address)
    });

  tokenIDToInfERC20 = async (tokenId: string): Promise<string> =>
    await this.provider.call({
      to: this.address,
      data: V2HubCalls.tokenIDToInfERC20(tokenId)
    });

  tokenIdToCidV0Digest = async (tokenId: string): Promise<string> =>
    await this.provider.call({
      to: this.address,
      data: V2HubCalls.tokenIdToCidV0Digest(tokenId)
    });

  treasuries = async (address: string): Promise<string> =>
    await this.provider.call({
      to: this.address,
      data: V2HubCalls.treasuries(address)
    });

  trust = async (trustReceiver: string, expiry: bigint): Promise<ethers.TransactionReceipt> => {
    const tx = await this.provider.sendTransaction({
      to: this.address,
      data: V2HubCalls.trust(trustReceiver, expiry)
    });
    const receipt = await tx.wait();
    if (!receipt || receipt.status !== 1) {
      throw new Error('trust failed');
    }
    this.emitEvents(receipt);
    return receipt;
  }

  trustMarkers = async (truster: string, trustee: string): Promise<TrustMarker> => {
    const result = await this.provider.call({
      to: this.address,
      data: V2HubCalls.trustMarkers(truster, trustee)
    });
    const previous = result.slice(0, 66);
    const expiry = BigInt('0x' + result.slice(66));
    return { previous, expiry };
  }

  unwrapInflationaryERC20 = async (tokenId: string, amount: bigint): Promise<ethers.TransactionReceipt> => {
    const tx = await this.provider.sendTransaction({
      to: this.address,
      data: V2HubCalls.unwrapInflationaryERC20(tokenId, amount)
    });
    const receipt = await tx.wait();
    if (!receipt || receipt.status !== 1) {
      throw new Error('unwrapInflationaryERC20 failed');
    }
    this.emitEvents(receipt);
    return receipt;
  }

  uri = async (id: string): Promise<string> =>
    await this.provider.call({
      to: this.address,
      data: V2HubCalls.uri(id)
    });

  wrapInflationaryERC20 = async (tokenId: string, amount: bigint): Promise<ethers.TransactionReceipt> => {
    const tx = await this.provider.sendTransaction({
      to: this.address,
      data: V2HubCalls.wrapInflationaryERC20(tokenId, amount)
    });
    const receipt = await tx.wait();
    if (!receipt || receipt.status !== 1) {
      throw new Error('wrapInflationaryERC20 failed');
    }
    this.emitEvents(receipt);
    return receipt;
  }

  private emitEvents = (receipt: TransactionReceipt) => receipt.logs.forEach(log => {
    const event = this.eventDecoder.decodeEventData({
      topics: log.topics.map(a => a),
      data: log.data
    });
    this._onEvent.emit(event);
  });
}