import { ethers, getAddress } from 'ethers';
import HubV1 from '@circles/circles-contracts/build/contracts/Hub.json';
import { Event, EventDecoder, ParsedEvent } from './eventDecoder.js';

export type HubTransferEvent = Event & {
  from: string;
  to: string;
  amount: bigint;
};

export type OrganizationSignupEvent = Event & {
  organization: string;
};

export type SignupEvent = Event & {
  user: string;
  token: string;
};

export type TrustEvent = Event & {
  canSendTo: string;
  user: string;
  limit: bigint;
};

export type V1HubEvent =
  HubTransferEvent
  | OrganizationSignupEvent
  | SignupEvent
  | TrustEvent;

export type ParsedV1HubEvent<T extends V1HubEvent> = ParsedEvent<T>;

const parseHubTransferEvent = (log: ethers.LogDescription): HubTransferEvent => ({
  from: getAddress(log.args[0]),
  to: getAddress(log.args[1]),
  amount: BigInt(log.args[2])
});

const parseOrganizationSignupEvent = (log: ethers.LogDescription): OrganizationSignupEvent => ({
  organization: getAddress(log.args[0])
});

const parseSignupEvent = (log: ethers.LogDescription): SignupEvent => ({
  user: getAddress(log.args[0]),
  token: getAddress(log.args[1])
});

const parseTrustEvent = (log: ethers.LogDescription): TrustEvent => ({
  canSendTo: getAddress(log.args[0]),
  user: getAddress(log.args[1]),
  limit: BigInt(log.args[2])
});

export class V1HubEvents implements EventDecoder {
  private readonly contractInterface: ethers.Interface = ethers.Interface.from(HubV1.abi);

  decodeEventData<T extends V1HubEvent>(log: {
    topics: string[],
    data: string
  }) : ParsedV1HubEvent<T>|undefined {
    const decoded = this.contractInterface.parseLog(log);

    if (!decoded) {
      console.log(`Couldn't decode event:`, log);
      return undefined;
    }

    let eventData: any;
    switch (decoded.name) {
      case 'HubTransfer':
        eventData = parseHubTransferEvent(decoded);
        break;
      case 'OrganizationSignup':
        eventData =  parseOrganizationSignupEvent(decoded);
        break;
      case 'Signup':
        eventData =  parseSignupEvent(decoded);
        break;
      case 'Trust':
        eventData =  parseTrustEvent(decoded);
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