export function userRepositoryContract<T extends new (...args: any[]) => any>(
  RepoClass: T,
  ...params: ConstructorParameters<T>
) {
  return {
    createInstance: () => {
      return new RepoClass(...params);
    },

    testBehavior: () => {
      describe('UserRepository Behavior', () => {
        it('should implement method correctly', () => {
          const instance = new RepoClass(...params);

          expect(instance['add']).toBeDefined();
        });
      });
    },
  };
}
