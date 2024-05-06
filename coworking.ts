export class Client {
  name: string;
  constructor(params: { name: string }) {
    this.name = params.name;
  }
}

export class Whiteboard {
  writer?: Client;
  readers: Client[] = [];

  startReading(client: Client) {
    this.readers.push(client);
  }

  startWriting(client: Client) {
    if (this.writer) {
      throw new Error("Whiteboard is currently being written to")
    }
    this.writer = client;
  }
}

export class Desk {
  type: string;
  occupied: boolean;
  timer: any;
  client: Client | null;
  constructor(params: { type: string }) {
    this.type = params.type;
    this.occupied = false;
    this.client = null;
  }
  assignTo(client: Client) {
    if (this.occupied) {
      throw new Error('Desk is currently in use');
    }
    this.occupied = true;
    this.client = client;
  }

  release() {
    this.occupied = false;
  }
}

export class OccupancySensor {
  occupants: number = 0;

  increment() {
    this.occupants++;
  }

  decrement() {
    this.occupants--;
  }
}

export class MeetingRoom {
  whiteboard: Whiteboard = new Whiteboard;
  occupants: Client[] = [];
  expectedOccupants: number;
  meetingInProgress: boolean = false;
  constructor(params: { expectedOccupants: number }) {
    this.expectedOccupants = params.expectedOccupants;
  }
  waitForMeeting(client: Client): Promise<void> {
    this.occupants.push(client);
    let monitor: any;
    return new Promise(resolve => {
      monitor = setInterval(() => {
        if (this.occupants.length === this.expectedOccupants) {
          this.startMeeting();
          clearInterval(monitor);
          resolve();
        }
      }, 500)
    })
  }

  startMeeting() {
    this.meetingInProgress = true;
  }

  getMeetingInfo() {
    return { occupants: this.occupants, meetingInProgress: this.meetingInProgress }
  }
}

export class CoworkingSpace {
  desks: Desk[];
  waitlist: Client[] = [];
  whiteboards: Whiteboard[] = [];
  occupancySensor: OccupancySensor = new OccupancySensor();
  constructor(params: { desks: Desk[], whiteboards: Whiteboard[] }) {
    this.desks = params.desks;
    this.whiteboards = params.whiteboards
  }

  allowEntry(client: Client): Desk {
    const availableDesk = this.desks.find(desk => !desk.occupied);
    if (!availableDesk) {
      throw new Error('No desks available');
    }
    availableDesk.assignTo(client);
    this.occupancySensor.increment();
    return availableDesk;
  }

  sayFarewell(client: Client) {
    const desk = this.desks.find(desk => desk.client && desk.client.name === client.name);
    if (desk) {
      desk.release();
      this.occupancySensor.decrement();
    }
  }

  async waitForDesk(client: Client): Promise<Desk> {
    this.waitlist.push(client);
    let monitor: any;
    return new Promise(resolve => {
      monitor = setInterval(() => {
        const availableDesk = this.desks.find(desk => !desk.occupied);
        if (availableDesk) {
          clearInterval(monitor);
          this.waitlist = this.waitlist.filter(waitingClient => waitingClient.name !== client.name);
          this.allowEntry(client);
          resolve(availableDesk);
        }
      }, 100)
    })
  }
}
