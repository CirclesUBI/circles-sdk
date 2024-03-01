import {V1HubCalls} from '@circles-sdk/abi-encoder/dist';
import {ethers, TransactionReceipt} from 'ethers';
import {Provider} from '@circles-sdk/providers/dist';
import {V1Token} from './v1Token.js';
import {
    ParsedV1HubEvent, V1HubEvent, V1HubEvents
} from '@circles-sdk/abi-decoder/dist';
import {Observable} from "../observable";

export type TokenFactory = (address: string) => V1Token;

export class V1Hub {
    readonly address: string;
    private readonly provider: Provider;
    private readonly eventDecoder: V1HubEvents = new V1HubEvents();

    public readonly events: Observable<ParsedV1HubEvent<V1HubEvent>>;
    private readonly emitEvent: (event: ParsedV1HubEvent<V1HubEvent>) => void;

    constructor(provider: Provider, address: string) {
        this.provider = provider;
        this.address = address;

        const eventsObservable= Observable.create<ParsedV1HubEvent<V1HubEvent>>();
        this.events = eventsObservable.property;
        this.emitEvent = (e) => eventsObservable.emit(e);
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
            data: V1HubCalls.hubName()
        });

    organizations = async (address: string): Promise<boolean> =>
        await this.provider.call({
            to: this.address,
            data: V1HubCalls.organizations(address)
        }) === '0x0000000000000000000000000000000000000000000000000000000000000001';

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

    userToToken = async (address: string): Promise<string> => {
        const data = await this.provider.call({
            to: this.address,
            data: V1HubCalls.userToToken(address)
        });
        return data == "0x"
            ? ethers.ZeroAddress
            : ethers.getAddress(`0x${(data).slice(-40)}`);
    }

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

    trust = async (user: string): Promise<ethers.TransactionReceipt> => {
        const tx = await this.provider.sendTransaction({
            to: this.address,
            data: V1HubCalls.trust(user)
        });
        const receipt = await tx.wait();
        if (!receipt || receipt.status !== 1) {
            throw new Error('Trust failed');
        }
        this.emitEvents(receipt);
        return receipt;
    };

    untrust = async (user: string): Promise<ethers.TransactionReceipt> => {
        const tx = await this.provider.sendTransaction({
            to: this.address,
            data: V1HubCalls.untrust(user)
        });
        const receipt = await tx.wait();
        if (!receipt || receipt.status !== 1) {
            throw new Error('Untrust failed');
        }
        this.emitEvents(receipt);
        return receipt;
    }

    private emitEvents = (receipt: TransactionReceipt) => receipt.logs.forEach(log => {
        const event = this.eventDecoder.decodeEventData({
            topics: log.topics.map(a => a),
            data: log.data
        });
        if (event) {
            this.emitEvent(event);
        }
    });
}