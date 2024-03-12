import { ethers, getAddress } from 'ethers';
import { Event, EventDecoder, ParsedEvent } from './common';
import contractAbi from './V2HubAbi.json';

export type ApprovalForAllEvent = Event & {
  account: string;
  operator: string;
  approved: boolean;
};

export type CidV0Event = Event & {
  avatar: string;
  cidV0Digest: Uint8Array;
};

export type ConvertInflationEvent = Event & {
  inflationValue: bigint;
  demurrageValue: bigint;
  day: bigint;
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

export type TrustEvent = Event & {
  truster: string;
  trustee: string;
  expiryTime: bigint;
};

export type URIEvent = Event & {
  value: string;
  id: bigint;
};



export type V2HubEvent =
  ApprovalForAllEvent |
  CidV0Event |
  ConvertInflationEvent |
  DemurragedTransferBatchEvent |
  DemurragedTransferSingleEvent |
  InviteHumanEvent |
  RegisterGroupEvent |
  RegisterHumanEvent |
  RegisterOrganizationEvent |
  TransferBatchEvent |
  TransferSingleEvent |
  TrustEvent |
  URIEvent;

export type ParsedV2HubEvent<T extends V2HubEvent> = ParsedEvent<T>;

const parseApprovalForAllEvent = (log: ethers.LogDescription): ApprovalForAllEvent => ({
  account: getAddress(log.args.getValue('account')),
  operator: getAddress(log.args.getValue('operator')),
  approved: log.args.getValue('approved')
});

const parseCidV0Event = (log: ethers.LogDescription): CidV0Event => ({
  avatar: getAddress(log.args.getValue('avatar')),
  cidV0Digest: log.args.getValue('cidV0Digest')
});

const parseConvertInflationEvent = (log: ethers.LogDescription): ConvertInflationEvent => ({
  inflationValue: BigInt(log.args.getValue('inflationValue')),
  demurrageValue: BigInt(log.args.getValue('demurrageValue')),
  day: BigInt(log.args.getValue('day'))
});

const parseDemurragedTransferBatchEvent = (log: ethers.LogDescription): DemurragedTransferBatchEvent => ({
  operator: getAddress(log.args.getValue('operator')),
  from: getAddress(log.args.getValue('from')),
  to: getAddress(log.args.getValue('to')),
  ids: log.args.getValue('ids'),
  values: log.args.getValue('values'),
  inflationaryValues: log.args.getValue('inflationaryValues')
});

const parseDemurragedTransferSingleEvent = (log: ethers.LogDescription): DemurragedTransferSingleEvent => ({
  operator: getAddress(log.args.getValue('operator')),
  from: getAddress(log.args.getValue('from')),
  to: getAddress(log.args.getValue('to')),
  id: BigInt(log.args.getValue('id')),
  value: BigInt(log.args.getValue('value')),
  inflationaryValue: BigInt(log.args.getValue('inflationaryValue'))
});

const parseInviteHumanEvent = (log: ethers.LogDescription): InviteHumanEvent => ({
  inviter: getAddress(log.args.getValue('inviter')),
  invited: getAddress(log.args.getValue('invited'))
});

const parseRegisterGroupEvent = (log: ethers.LogDescription): RegisterGroupEvent => ({
  group: getAddress(log.args.getValue('group')),
  mint: getAddress(log.args.getValue('mint')),
  treasury: getAddress(log.args.getValue('treasury')),
  name: log.args.getValue('name'),
  symbol: log.args.getValue('symbol')
});

const parseRegisterHumanEvent = (log: ethers.LogDescription): RegisterHumanEvent => ({
  avatar: getAddress(log.args.getValue('avatar'))
});

const parseRegisterOrganizationEvent = (log: ethers.LogDescription): RegisterOrganizationEvent => ({
  organization: getAddress(log.args.getValue('organization')),
  name: log.args.getValue('name')
});

const parseTransferBatchEvent = (log: ethers.LogDescription): TransferBatchEvent => ({
  operator: getAddress(log.args.getValue('operator')),
  from: getAddress(log.args.getValue('from')),
  to: getAddress(log.args.getValue('to')),
  ids: log.args.getValue('ids'),
  values: log.args.getValue('values')
});

const parseTransferSingleEvent = (log: ethers.LogDescription): TransferSingleEvent => ({
  operator: getAddress(log.args.getValue('operator')),
  from: getAddress(log.args.getValue('from')),
  to: getAddress(log.args.getValue('to')),
  id: BigInt(log.args.getValue('id')),
  value: BigInt(log.args.getValue('value'))
});

const parseTrustEvent = (log: ethers.LogDescription): TrustEvent => ({
  truster: getAddress(log.args.getValue('truster')),
  trustee: getAddress(log.args.getValue('trustee')),
  expiryTime: BigInt(log.args.getValue('expiryTime'))
});

const parseURIEvent = (log: ethers.LogDescription): URIEvent => ({
  value: log.args.getValue('value'),
  id: BigInt(log.args.getValue('id'))
});



export class V2HubEvents implements EventDecoder {
  private readonly contractInterface: ethers.Interface = new ethers.Interface(contractAbi);

  decodeEventData<T extends Event>(log: {
    topics: string[],
    data: string
  }): ParsedEvent<T> {
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
      case 'ConvertInflation':
        eventData = parseConvertInflationEvent(decoded);
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
