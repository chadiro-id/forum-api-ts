export function toBeRecentDate(received: any, threshold = 10000) {
  if (!(received instanceof Date)) {
    return {
      pass: false,
      message: () => `Expected ${received} to be a Date instance`,
    };
  }

  const now = Date.now();
  const receivedTime = received.getTime();
  const diff = Math.abs(now - receivedTime);
  const pass = diff < threshold;

  return {
    pass,
    message: () =>
      `Expected date to ${pass ? 'not ' : ''}be within ${threshold}ms of current time. ` +
      `Difference: ${diff}ms`,
  };
}

export function toBeAfter(received: any, otherDate: any) {
  const pass = received.getTime() > otherDate.getTime();
  return {
    pass,
    message: () =>
      `Expected ${received} to ${pass ? 'not ' : ''}be after ${otherDate}`,
  };
}

expect.extend({
  toBeRecentDate,
  toBeAfter,
});
