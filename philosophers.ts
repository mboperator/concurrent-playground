export class Fork {
  inUse: boolean = false;
  beingUsedBy: Philosopher | null = null;

  assignTo(philosopher: Philosopher) {
    if (this.inUse) {
      throw new Error('Fork is currently in use');
    }
    this.inUse = true;
    this.beingUsedBy = philosopher;
  }
  putDown(philosopher: Philosopher) {
    if (this.beingUsedBy !== philosopher) {
      console.info('Philosopher', philosopher.name, 'is trying to put down a fork that they are not using');
    }
    this.inUse = false;
    this.beingUsedBy = null;
  }
}

export class Philosopher {
  name: string;
  leftFork: Fork;
  rightFork: Fork;
  hasEaten: boolean = false;
  isThinking: boolean = true;
  constructor(params: { name: string, leftFork: Fork, rightFork: Fork }) {
    this.name = params.name;
    this.leftFork = params.leftFork;
    this.rightFork = params.rightFork;
  }

  think(): Promise<void> {
    if (this.leftFork.beingUsedBy === this) {
      console.info(this.name, ' is putting down his left fork')
      this.leftFork.putDown(this);
    }
    if (this.rightFork.beingUsedBy === this) {
      console.info(this.name, ' is putting down his right fork')
      this.rightFork.putDown(this);
    }

    console.info(this.name, ' is thinking')
    this.isThinking = true;

    return new Promise(resolve => {
      setTimeout(() => {
        this.isThinking = false;
        resolve();
      }, randomInt(100, 500));
    })
  }

  eat(): Promise<string> {
    console.info(this.name, ' is eating')
    return new Promise(resolve => {
      this.leftFork.assignTo(this);
      this.rightFork.assignTo(this);
      setTimeout(() => {
        this.hasEaten = true;
        this.leftFork.putDown(this);
        this.rightFork.putDown(this);
        resolve('BUURRRRRP');
      }, randomInt(100, 500));
    })
  }

  hangOutUntilFull(): Promise<any> {
    if (!this.leftFork.inUse && !this.rightFork.inUse) {
      return this.eat();
    } else {
      return this.think().then(() => this.hangOutUntilFull());
    }
  }
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
