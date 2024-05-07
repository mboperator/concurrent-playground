import debounce from 'lodash.debounce';

type StreamEvent = {
  timestamp: number;
  message: string;
}
export class OrderedStreamWriter {
  events: StreamEvent[] = [];
  cursor: number = 0;
  constructor() {
    this.events = [];
  }
  write(event: StreamEvent) {
    this.events.push(event);
    this.logEvents();
  }

  logEvents = debounce(() => {
    this.events
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(this.cursor, this.events.length)
      .map(e => e.message)
      .map(console.log)
    this.cursor = this.events.length;
  }, 100, { maxWait: 1000 });
}
