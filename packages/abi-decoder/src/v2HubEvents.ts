import { ethers, getAddress } from 'ethers';
import HubV2 from '@circles/circles-contracts-v2/out/Hub.sol/Hub.json';
import { Event, EventDecoder, ParsedEvent } from './eventDecoder';

export type ApprovalForAllEvent = Event &  {
  account: string;
  operator: string;
  approved: boolean;
};

export type CidV0Event = Event & {
  avatar: string;
  cidV0Digest: string;
};

export type DemurragedTransferBatchEvent = Event & {
  operator: string;
  from: string;
  to: string;
  ids: bigint[];
  values: bigint[];
  inflationaryValues: bigint[];
};

export type DemurragedTransferSingleEvent = Event & {
  operator: string;
  from: string;
  to: string;
  id: bigint;
  value: bigint;
  inflationaryValue: bigint;
};

export type InviteHumanEvent = Event & {
  inviter: string;
  invited: string;
};

export type RegisterGroupEvent = Event & {
  group: string;
  mint: string;
  treasury: string;
  name: string;
  symbol: string;
};

export type RegisterHumanEvent = Event & {
  avatar: string;
};

export type RegisterOrganizationEvent = Event & {
  organization: string;
  name: string;
};

export type TransferBatchEvent = Event & {
  operator: string;
  from: string;
  to: string;
  ids: bigint[];
  values: bigint[];
};

export type TransferSingleEvent = Event & {
  operator: string;
  from: string;
  to: string;
  id: bigint;
  value: bigint;
};

export type TrustEvent_v2 = Event & {
  truster: string;
  trustee: string;
  expiryTime: bigint;
};

export type URIEvent = Event & {
  value: string;
  id: bigint;
};

export type V2HubEvent =
  ApprovalForAllEvent
  | CidV0Event
  | DemurragedTransferBatchEvent
  | DemurragedTransferSingleEvent
  | InviteHumanEvent
  | RegisterGroupEvent
  | RegisterHumanEvent
  | RegisterOrganizationEvent
  | TransferBatchEvent
  | TransferSingleEvent
  | TrustEvent_v2
  | URIEvent;

export type ParsedV2HubEvent<T extends V2HubEvent> = ParsedEvent<T>;

const parseApprovalForAllEvent = (log: ethers.LogDescription): ApprovalForAllEvent => ({
  account: getAddress(log.args[0]),
  operator: getAddress(log.args[1]),
  approved: log.args[2]
});

const parseCidV0Event = (log: ethers.LogDescription): CidV0Event => ({
  avatar: getAddress(log.args[0]),
  cidV0Digest: log.args[1]
});

// Example for parsing a complex event with arrays and BigNumber types
const parseDemurragedTransferBatchEvent = (log: ethers.LogDescription): DemurragedTransferBatchEvent => ({
  operator: log.args[0],
  from: log.args[1],
  to: log.args[2],
  ids: log.args[3],
  values: log.args[4],
  inflationaryValues: log.args[5]
});

const parseDemurragedTransferSingleEvent = (log: ethers.LogDescription): DemurragedTransferSingleEvent => ({
  operator: log.args[0],
  from: log.args[1],
  to: log.args[2],
  id: log.args[3],
  value: log.args[4],
  inflationaryValue: log.args[5],
});

const parseInviteHumanEvent = (log: ethers.LogDescription): InviteHumanEvent => ({
  inviter: log.args[0],
  invited: log.args[1]
});

const parseRegisterGroupEvent = (log: ethers.LogDescription): RegisterGroupEvent => ({
  group: log.args[0],
  mint: log.args[1],
  treasury: log.args[2],
  name: log.args[3],
  symbol: log.args[4]
});

const parseRegisterHumanEvent = (log: ethers.LogDescription): RegisterHumanEvent => ({
  avatar: log.args[0]
});

const parseRegisterOrganizationEvent = (log: ethers.LogDescription): RegisterOrganizationEvent => ({
  organization: log.args[0],
  name: log.args[1]
});

const parseTransferBatchEvent = (log: ethers.LogDescription): TransferBatchEvent => ({
  operator: log.args[0],
  from: log.args[1],
  to: log.args[2],
  ids: log.args[3],
  values: log.args[4]
});

const parseTransferSingleEvent = (log: ethers.LogDescription): TransferSingleEvent => ({
  operator: log.args[0],
  from: log.args[1],
  to: log.args[2],
  id: log.args[3],
  value: log.args[4]
});

const parseTrustEvent = (log: ethers.LogDescription): TrustEvent_v2 => ({
  truster: log.args[0],
  trustee: log.args[1],
  expiryTime: log.args[2]
});

const parseURIEvent = (log: ethers.LogDescription): URIEvent => ({
  value: log.args[0],
  id: log.args[1]
});

export class V2HubEvents implements EventDecoder {
  private readonly contractInterface: ethers.Interface = ethers.Interface.from(HubV2.abi);

  decodeEventData<T extends V2HubEvent>(log: {
    topics: string[],
    data: string
  }) : ParsedV2HubEvent<T> {
    const decoded = this.contractInterface.parseLog(log);

    if (!decoded) {
      throw new Error('Invalid event data');
    }

    let eventData: any;
    switch (decoded.name) {
     case 'ApprovalForAll':
       eventData = parseApprovalForAllEvent(decoded);
        break;
      case 'CidV0':
        eventData = parseCidV0Event(decoded);
        break;
      case 'DemurragedTransferBatch':
        eventData = parseDemurragedTransferBatchEvent(decoded);
        break;
      case 'DemurragedTransferSingle':
        eventData = parseDemurragedTransferSingleEvent(decoded);
        break;
      case 'InviteHuman':
        eventData = parseInviteHumanEvent(decoded);
        break;
      case 'RegisterGroup':
        eventData = parseRegisterGroupEvent(decoded);
        break;
      case 'RegisterHuman':
        eventData = parseRegisterHumanEvent(decoded);
        break;
      case 'RegisterOrganization':
        eventData = parseRegisterOrganizationEvent(decoded);
        break;
      case 'TransferBatch':
        eventData = parseTransferBatchEvent(decoded);
        break;
      case 'TransferSingle':
        eventData = parseTransferSingleEvent(decoded);
        break;
      case 'Trust':
        eventData = parseTrustEvent(decoded);
        break;
      case 'URI':
        eventData = parseURIEvent(decoded);
        break;
      default:
        throw new Error(`Invalid event name: ${decoded.name}`);
    }

    return {
      name: decoded.name,
      data: eventData
    };
  }
}