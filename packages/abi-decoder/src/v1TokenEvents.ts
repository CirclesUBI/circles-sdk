import { ethers, getAddress } from 'ethers';
import TokenV1 from '@circles/circles-contracts/out/Token.sol/Token.json';
import { Event, EventDecoder, ParsedEvent } from './eventDecoder';

export type TokenTransferEvent = Event & {
  from: string;
  to: string;
  value: bigint;
};

export type TokenApprovalEvent = Event & {
  owner: string;
  spender: string;
  value: bigint;
};

export type V1TokenEvent =
  | TokenTransferEvent
  | TokenApprovalEvent;

export type ParsedV1TokenEvent<T extends V1TokenEvent> = ParsedEvent<T>;

const parseTokenTransferEvent = (log: ethers.LogDescription): TokenTransferEvent => ({
  from: getAddress(log.args.from),
  to: getAddress(log.args.to),
  value: BigInt(log.args.value)
});

const parseTokenApprovalEvent = (log: ethers.LogDescription): TokenApprovalEvent => ({
  owner: getAddress(log.args.owner),
  spender: getAddress(log.args.spender),
  value: BigInt(log.args.value)
});

export class V1TokenEvents implements EventDecoder {
  private readonly contractInterface: ethers.Interface = new ethers.Interface(TokenV1.abi);

  decodeEventData<T extends V1TokenEvent>(log: {
    topics: string[],
    data: string
  }): ParsedV1TokenEvent<T> {
    const decoded = this.contractInterface.parseLog(log);

    if (!decoded) {
      throw new Error('Invalid event data');
    }

    let eventData: any;
    switch (decoded.name) {
      case 'Transfer':
        eventData = parseTokenTransferEvent(decoded);
        break;
      case 'Approval':
        eventData = parseTokenApprovalEvent(decoded);
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
