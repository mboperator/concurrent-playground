import { OrderedStreamWriter } from './orderedstream';
describe('Order from Chaos', () => {
  describe('Ordered Stream', () => {
    it('should log each item added to the stream', async () => {
      const streamWriter = new OrderedStreamWriter();
      const consoleLogSpy = jest.spyOn(console, 'log');

      // Simulate an infinite stream of data coming from multiple threads
      const item1 = {timestamp: 1621234567000, message: 'Item 1'};
      const item2 = {timestamp: 1621234568000, message: 'Item 2'};
      const item3 = {timestamp: 1621234569000, message: 'Item 3'};

      // Write items to the stream in an ordered fashion
      streamWriter.write(item1);
      streamWriter.write(item2);
      streamWriter.write(item3);

      // Wait for a short duration to allow the stream writer to process the items
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify that the items are written to the console in the correct order based on timestamps
      expect(consoleLogSpy.mock.calls[0][0]).toBe('Item 1');
      expect(consoleLogSpy.mock.calls[1][0]).toBe('Item 2');
      expect(consoleLogSpy.mock.calls[2][0]).toBe('Item 3');

      consoleLogSpy.mockRestore();
    });
    it('should log each item added to the stream in order of timestamp, not when received', async () => {
      const streamWriter = new OrderedStreamWriter();
      const consoleLogSpy = jest.spyOn(console, 'log');

      // Simulate an infinite stream of data coming from multiple threads
      const item1 = {timestamp: 1621234567000, message: 'Item 1'};
      const item2 = {timestamp: 1621234568000, message: 'Item 2'};
      const item3 = {timestamp: 1621234569000, message: 'Item 3'};

      // Write items to the stream in an unordered fashion
      streamWriter.write(item2);
      streamWriter.write(item1);
      streamWriter.write(item3);

      // Wait for a short duration to allow the stream writer to process the items
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify that the items are written to the console in the correct order based on timestamps
      expect(consoleLogSpy.mock.calls[0][0]).toBe('Item 1');
      expect(consoleLogSpy.mock.calls[1][0]).toBe('Item 2');
      expect(consoleLogSpy.mock.calls[2][0]).toBe('Item 3');

      consoleLogSpy.mockRestore();
    });
    it('should log each item added to the stream in order of timestamp, not when received', async () => {
      const streamWriter = new OrderedStreamWriter();
      const consoleLogSpy = jest.spyOn(console, 'log');

      // Simulate an infinite stream of data coming from multiple threads
      const item1 = {timestamp: 1621234567000, message: 'Item 1'};
      const item2 = {timestamp: 1621234568000, message: 'Item 2'};
      const item3 = {timestamp: 1621234569000, message: 'Item 3'};
      const item4 = {timestamp: 1621234570000, message: 'Item 4'};
      const item5 = {timestamp: 1621234571000, message: 'Item 5'};
      const item6 = {timestamp: 1621234572000, message: 'Item 6'};

      // Write items to the stream in an unordered fashion
      streamWriter.write(item2);
      streamWriter.write(item1);
      streamWriter.write(item3);

      // Wait for a short duration to allow the stream writer to process the items
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify that the items are written to the console in the correct order based on timestamps
      expect(consoleLogSpy.mock.calls[0][0]).toBe('Item 1');
      expect(consoleLogSpy.mock.calls[1][0]).toBe('Item 2');
      expect(consoleLogSpy.mock.calls[2][0]).toBe('Item 3');

      streamWriter.write(item6);
      streamWriter.write(item5);
      streamWriter.write(item4);
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(consoleLogSpy.mock.calls[3][0]).toBe('Item 4');
      expect(consoleLogSpy.mock.calls[4][0]).toBe('Item 5');
      expect(consoleLogSpy.mock.calls[5][0]).toBe('Item 6');

      consoleLogSpy.mockRestore();
    });
  })
});
