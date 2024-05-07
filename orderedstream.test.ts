import {OrderedStreamWriter, StreamEvent} from './orderedstream';

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
async function writeWithLatency(streamWriter: OrderedStreamWriter, event: StreamEvent): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      streamWriter.write(event);
      resolve();
    }, randomInt(0, 100));
  })
}

describe('Ordered Stream', () => {
  it('should log each item added to the stream', async () => {
    const streamWriter = new OrderedStreamWriter();
    const consoleLogSpy = jest.spyOn(console, 'log');

    // Simulate an infinite stream of data coming from multiple threads
    const item1 = {timestamp: 1621234567000, message: 'Item 1'};
    const item2 = {timestamp: 1621234568000, message: 'Item 2'};
    const item3 = {timestamp: 1621234569000, message: 'Item 3'};

    // Write items to the stream in an ordered fashion
    await Promise.all([
      writeWithLatency(streamWriter, item1),
      writeWithLatency(streamWriter, item2),
      writeWithLatency(streamWriter, item3),
    ])

    await new Promise(resolve => setTimeout(resolve, 120))

    // Wait for a short duration to allow the stream writer to process the items
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
    await Promise.all([
      writeWithLatency(streamWriter, item2),
      writeWithLatency(streamWriter, item1),
      writeWithLatency(streamWriter, item3),
    ])

    // Wait for a short duration to allow the stream writer to process the items
    await new Promise(resolve => setTimeout(resolve, 120));

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
    await Promise.all([
      writeWithLatency(streamWriter, item2),
      writeWithLatency(streamWriter, item1),
      writeWithLatency(streamWriter, item3),
    ]);

    // Wait for a short duration to allow the stream writer to process the items
    await new Promise(resolve => setTimeout(resolve, 120));

    // Verify that the items are written to the console in the correct order based on timestamps
    expect(consoleLogSpy.mock.calls[0][0]).toBe('Item 1');
    expect(consoleLogSpy.mock.calls[1][0]).toBe('Item 2');
    expect(consoleLogSpy.mock.calls[2][0]).toBe('Item 3');

    await Promise.all([
      writeWithLatency(streamWriter, item6),
      writeWithLatency(streamWriter, item5),
      writeWithLatency(streamWriter, item4),
    ]);
    await new Promise(resolve => setTimeout(resolve, 120));

    expect(consoleLogSpy.mock.calls[3][0]).toBe('Item 4');
    expect(consoleLogSpy.mock.calls[4][0]).toBe('Item 5');
    expect(consoleLogSpy.mock.calls[5][0]).toBe('Item 6');

    consoleLogSpy.mockRestore();
  });
})
