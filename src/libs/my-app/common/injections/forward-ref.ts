export function forwardRef(fn: () => any) {
  return { forwardRef: fn };
}
