export class EventEmitter<TEvent> {
  private _subscribers: ((event: TEvent) => void)[] = [];

  subscribe = (callback: (event: TEvent) => void): (() => void) => {
    this._subscribers.push(callback);
    return () => {
      this._subscribers = this._subscribers.filter(cb => cb !== callback);
    };
  };

  emit = (event: TEvent) => {
    this._subscribers.forEach(cb => cb(event));
  };
}