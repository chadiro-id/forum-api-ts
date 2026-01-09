import { toBeRecentDate, toBeAfter } from './date.matcher';

declare global {
  namespace jest {
    interface Expect {
      toBeRecentDate(threshold: number = 10000): void;
      toBeAfter(otherDate: any): void;
    }
  }
}

expect.extend({ toBeRecentDate, toBeAfter });
