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

  static isValidDate(value: unknown) {
    if (value instanceof Date === false) return false;
    return Number.isNaN(Date.parse(value.toString())) === false;
  }
}
