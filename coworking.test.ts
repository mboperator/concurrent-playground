import {Desk, Client, CoworkingSpace, Whiteboard, MeetingRoom} from "./coworking";

describe('Concurrent Coworking', () => {
  describe('Desk - mutex', () => {
    it('should only allow one client to utilize it at a time', () => {
      const desk = new Desk({ type: 'sit-stand' });
      const garrett = new Client({ name: 'Garrett' });
      const daniel = new Client({ name: 'Daniel' });

      desk.assignTo(garrett);
      expect(() => desk.assignTo(daniel)).toThrowError('Desk is currently in use');
    })
  });

  describe('Coworking Space - semaphore', () => {
    it('should only allow a new client in if there are enough desks available', () => {
      const desk1 = new Desk({ type: 'sit-stand' });
      const desk2 = new Desk({ type: 'sit-stand' });
      const garrett = new Client({ name: 'Garrett' });
      const daniel = new Client({ name: 'Daniel' });
      const marcus = new Client({ name: 'Marcus' });

      const space = new CoworkingSpace({ desks: [desk1, desk2], whiteboards: [] });
      space.allowEntry(garrett);
      space.allowEntry(daniel);

      expect(() => space.allowEntry(marcus)).toThrowError('No desks available');
    })

    it('should allow clients to wait until there are enough desks available', () => {
      const desk1 = new Desk({ type: 'sit-stand' });
      const desk2 = new Desk({ type: 'sit-stand' });
      const garrett = new Client({ name: 'Garrett' });
      const daniel = new Client({ name: 'Daniel' });
      const marcus = new Client({ name: 'Marcus' });

      const space = new CoworkingSpace({ desks: [desk1, desk2], whiteboards: [] });
      space.allowEntry(garrett);
      space.allowEntry(daniel)
      const promise = space.waitForDesk(marcus);
      expect(space.waitlist).toContain(marcus);
      space.sayFarewell(garrett);
      expect(promise).resolves.toEqual(desk1);
    })

    describe('Occupancy Sensor - atomic operations', () => {
      it('sensor to increment and decrement when people come and go', async () => {
        const desk1 = new Desk({ type: 'sit-stand' });
        const desk2 = new Desk({ type: 'sit-stand' });
        const garrett = new Client({ name: 'Garrett' });
        const daniel = new Client({ name: 'Daniel' });
        const marcus = new Client({ name: 'Marcus' });

        const space = new CoworkingSpace({ desks: [desk1, desk2], whiteboards: [] });
        space.allowEntry(garrett);
        space.allowEntry(daniel)
        const promise = space.waitForDesk(marcus);
        expect(space.waitlist).toContain(marcus);
        expect(space.occupancySensor.occupants).toBe(2);
        space.sayFarewell(garrett);
        expect(space.occupancySensor.occupants).toBe(1);
        await promise;
        expect(promise).resolves.toEqual(desk1);
        expect(space.occupancySensor.occupants).toBe(2);
      })
    })
  });


  describe('Whiteboard - read/write lock', () => {
    it('should allow multiple clients to read a shared resource simultaneously', () => {
      const whiteboard = new Whiteboard();
      const garrett = new Client({ name: 'Garrett' });
      const daniel = new Client({ name: 'Daniel' });

      whiteboard.startReading(garrett);
      whiteboard.startReading(daniel);

      expect(whiteboard.readers).toContain(garrett);
      expect(whiteboard.readers).toContain(daniel);
    });

    it('should only allow one client to write to a shared resource at a time', () => {
      const whiteboard = new Whiteboard();
      const garrett = new Client({ name: 'Garrett' });
      const daniel = new Client({ name: 'Daniel' });

      whiteboard.startWriting(garrett);

      expect(() => whiteboard.startWriting(daniel)).toThrowError('Whiteboard is currently being written to');
    });
  })

  describe('Meeting Room - barrier', () => {
    it('should not start the meeting until all expected occupants are present', async () => {
      const room = new MeetingRoom({ expectedOccupants: 3 });
      const garrett = new Client({ name: 'Garrett' });
      const daniel = new Client({ name: 'Daniel' });
      const marcus = new Client({ name: 'Marcus' });

      let meetingInfo;
      const p1 = room.waitForMeeting(garrett)
      meetingInfo = room.getMeetingInfo()
      expect(meetingInfo.occupants.length).toBe(1);
      expect(meetingInfo.meetingInProgress).toBe(false);
      const p2 = room.waitForMeeting(daniel)
      const p3 = room.waitForMeeting(marcus)

      await Promise.all([p1, p2, p3])
      meetingInfo = room.getMeetingInfo()
      expect(meetingInfo.occupants.length).toBe(3);
      expect(meetingInfo.meetingInProgress).toBe(true);
    })
  })
});
