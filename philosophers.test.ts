import {Fork, Philosopher} from "./philosophers";

describe('Dining Philosophers Problem', () => {
  it('should allow philosophers to eat without causing a deadlock', async () => {
    const forks = [new Fork(), new Fork(), new Fork()];
    const philosophers = [
      new Philosopher({ name: 'Philosopher 1', leftFork: forks[0], rightFork: forks[1] }),
      new Philosopher({ name: 'Philosopher 2', leftFork: forks[1], rightFork: forks[2] }),
      new Philosopher({ name: 'Philosopher 3', leftFork: forks[2], rightFork: forks[0] }),
    ];

    const hangingOut = philosophers.map(philosopher => philosopher.hangOutUntilFull());

    await Promise.all(hangingOut);

    philosophers.forEach(philosopher => {
      expect(philosopher.hasEaten).toBe(true);
    });
  }, 10000);
})
