export function domainErrorContract<T extends new (...args: any[]) => any>(
  ErrorClass: T,
  ...defaultParams: ConstructorParameters<T>
) {
  return {
    createInstance: (...params: ConstructorParameters<T>) => {
      return new ErrorClass(...params);
    },

    testBehavior: () => {
      describe('DomainError Behavior', () => {
        it('should have correct property', () => {
          const instance = new ErrorClass(...defaultParams);

          expect(instance).toHaveProperty('name');
          expect(instance).toHaveProperty('message');
          expect(instance).toHaveProperty('code');
        });

        it('should have own name', () => {
          const instance = new ErrorClass(...defaultParams);

          expect(instance.name).not.toBe('DomainError');
          expect(instance.name).toBe(ErrorClass.name);
        });
      });
    },
  };
}
