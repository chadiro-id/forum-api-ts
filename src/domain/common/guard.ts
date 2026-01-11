export class Guard {
  static checkNullish(props: object) {
    const errors: string[] = [];

    for (const [k, v] of Object.entries(props)) {
      if (v === undefined || v === null) {
        errors.push(k);
      }
    }
    return errors;
  }

  static validateText(
    value: unknown,
    options?: { min: number; max: number; pattern: RegExp },
  ) {
    const messages: string[] = [];
    if (typeof value !== 'string') {
      messages.push('data type mismatch');
      return { success: false, messages };
    }
    if (options?.min && value.length < options.min) {
      messages.push('');
    }
    if (options?.max && value.length > options.max) {
      messages.push('');
    }
    if (options?.pattern && !options.pattern.test(value)) {
      messages.push('');
    }
    return { success: messages.length === 0, messages };
  }

  static isValidDate(value: unknown) {
    if (value instanceof Date === false) return false;
    return Number.isNaN(Date.parse(value.toString())) === false;
  }
}
