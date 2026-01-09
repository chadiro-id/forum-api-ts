export class Guard {
  static againstNullish(props: object) {
    const errors: string[] = [];

    for (const [k, v] of Object.entries(props)) {
      if (v === undefined || v === null) {
        errors.push(k);
      }
    }
  }
}
