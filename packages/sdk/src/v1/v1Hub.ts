import { V1HubCalls } from '@circles/circles-sdk-v2-abi-encoder/src/v1HubCalls';
import { ethers, TransactionReceipt } from 'ethers';
import { Provider } from '@circles/circles-sdk-v2-providers/dist/provider';
import { V1Token } from './v1Token';
import { EventEmitter } from '@circles-sdk-v2/circles-v2-test/dist/tests/test/sdk/eventEmitter';
import {
  ParsedV1HubEvent, V1HubEvent, V1HubEvents
} from '@circles/circles-sdk-v2-abi-decoder/dist/v1HubEvents';

export type TokenFactory = (address: string) => V1Token;

export class V1Hub {
  readonly address: string;
  private readonly provider: Provider;
  private readonly eventDecoder: V1HubEvents = new V1HubEvents();

  private readonly _onEvent: EventEmitter<ParsedV1HubEvent<V1HubEvent>> = new EventEmitter();
  public readonly onEvent = this._onEvent.subscribe;

  constructor(provider: Provider, address: string) {
    this.provider = provider;
    this.address = address;
  }

  getToken: TokenFactory = (address) => new V1Token(this.provider, address);

  deployedAt = async (): Promise<bigint> =>
    BigInt(await this.provider.call({
      to: this.address,
      data: V1HubCalls.deployedAt()
    }));

  divisor = async (): Promise<bigint> =>
    BigInt(await this.provider.call({
      to: this.address,
      data: V1HubCalls.divisor()
    }));

  inflation = async (): Promise<bigint> =>
    BigInt(await this.provider.call({
      to: this.address,
      data: V1HubCalls.inflation()
    }));

  initialIssuance = async (): Promise<bigint> =>
    BigInt(await this.provider.call({
      to: this.address,
      data: V1HubCalls.initialIssuance()
    }));

  limits = async (truster: string, trustee: string): Promise<bigint> =>
    BigInt(await this.provider.call({
      to: this.address,
      data: V1HubCalls.limits(truster, trustee)
    }));

  name = async (): Promise<string> =>
    await this.provider.call({
      to: this.address,
      data: V1HubCalls.name()
    });

  organizations = async (address: string): Promise<boolean> =>
    await this.provider.call({
      to: this.address,
      data: V1HubCalls.organizations(address)
    }) === '0x01';

  period = async (): Promise<bigint> =>
    BigInt(await this.provider.call({
      to: this.address,
      data: V1HubCalls.period()
    }));

  symbol = async (): Promise<string> =>
    await this.provider.call({
      to: this.address,
      data: V1HubCalls.symbol()
    });

  timeout = async (): Promise<bigint> =>
    BigInt(await this.provider.call({
      to: this.address,
      data: V1HubCalls.timeout()
    }));

  tokenToUser = async (address: string): Promise<string> =>
    await this.provider.call({
      to: this.address,
      data: V1HubCalls.tokenToUser(address)
    });

  userToToken = async (address: string): Promise<string> =>
    await this.provider.call({
      to: this.address,
      data: V1HubCalls.userToToken(address)
    });

  signup = async (): Promise<ethers.TransactionReceipt> => {
    const tx = await this.provider.sendTransaction({
      to: this.address,
      data: V1HubCalls.signup()
    });
    const receipt = await tx.wait();
    if (!receipt || receipt.status !== 1) {
      throw new Error('Signup failed');
    }
    this.emitEvents(receipt);
    return receipt;
  };

  organizationSignup = async (): Promise<ethers.TransactionReceipt> => {
    const tx = await this.provider.sendTransaction({
      to: this.address,
      data: V1HubCalls.organizationSignup()
    });
    const receipt = await tx.wait();
    if (!receipt || receipt.status !== 1) {
      throw new Error('Organization Signup failed');
    }
    this.emitEvents(receipt);
    return receipt;
  };

  transferThrough = async (
    tokenOwners: string[],
    srcs: string[],
    dests: string[],
    wads: bigint[]
  ): Promise<ethers.TransactionReceipt> => {
    const tx = await this.provider.sendTransaction({
      to: this.address,
      data: V1HubCalls.transferThrough(tokenOwners, srcs, dests, wads)
    });
    const receipt = await tx.wait();
    if (!receipt || receipt.status !== 1) {
      throw new Error('TransferThrough failed');
    }
    this.emitEvents(receipt);
    return receipt;
  };

  private emitEvents = (receipt: TransactionReceipt) => receipt.logs.forEach(log => {
    const event = this.eventDecoder.decodeEventData({
      topics: log.topics.map(a => a),
      data: log.data
    });
    this._onEvent.emit(event);
  });
}