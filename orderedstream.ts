import {debounce} from "lodash";

export type StreamEvent = {
  timestamp: number;
  message: string;
}
export class OrderedStreamWriter {
  receivedEvents: StreamEvent[] = [];
  orderedEvents: StreamEvent[] = [];
  cursor: number = 0;
  constructor() {
  }

  write(event: StreamEvent) {
    this.receivedEvents.push(event);
    this.logEvents()
  }

  logEvents = debounce(() => {
    const ordered = this.receivedEvents
      .slice(this.cursor, this.receivedEvents.length)
      .sort((a, b) => a.timestamp - b.timestamp)

    ordered.forEach(event => { console.log(event.message) });
    this.orderedEvents = this.orderedEvents.concat(ordered);
    this.cursor = this.receivedEvents.length;
  }, 100, { maxWait: 1000 })
}
