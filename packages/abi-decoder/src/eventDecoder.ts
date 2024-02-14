export type Event = {};

export type ParsedEvent<T extends Event> = {
  name: string;
  data: T;
};

export interface EventDecoder {
  decodeEventData(log: {
    topics: string[],
    data: string
  }): any;
}