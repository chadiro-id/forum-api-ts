import { DomainEntity, EntityId } from './domain-entity';

class TestId extends EntityId {
  readonly name = 'TestId';
}
class TestIdNumber extends EntityId<number> {
  readonly name = 'TestIdNumber';
}

class TestEntity extends DomainEntity<TestId> {
  constructor(
    id: TestId,
    public name: string = 'Test Entity',
  ) {
    super(id);
  }
}

describe('EntityId', () => {
  describe('constructor', () => {
    it('should initialize with the given value', () => {
      const testId = new TestId('test-id');
      expect(testId.value).toBe('test-id');
    });

    it('should have null value when the given value is null', () => {
      const id = new TestId(null);

      expect(id.value).toBeNull();
    });

    it('should work with number value', () => {
      const id = new TestIdNumber(1);

      expect(id.value).toBe(1);
    });
  });

  describe('equals', () => {
    it('should return true when compare with same values', () => {
      const idA = new TestId('test-id');
      const idB = new TestId('test-id');

      expect(idA.equals(idB)).toBe(true);
    });

    it('should return false when compare with different values', () => {
      const idA = new TestId('test-id-a');
      const idB = new TestId('test-id-b');

      expect(idA.equals(idB)).toBe(false);
    });

    it('should return false when compare with non EntityId instance', () => {
      const id = new TestId('test-id');
      const nonEntityId = {
        name: 'TestEntityId',
        value: 'test-id',
      } as unknown as TestId;

      expect(id.equals(nonEntityId)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return string value', () => {
      const id = new TestId('test-id');
      expect(id.toString()).toBe('test-id');
    });
  });
});

describe('DomainEntity', () => {
  describe('constructor', () => {
    it('should initialize with the given id', () => {
      const id = new TestId('id-test');
      const entity = new TestEntity(id);

      expect(entity.id).toBe(id);
    });
  });

  describe('equals', () => {
    it('should return true when compare with same ids', () => {
      const id = new TestId('id-test');
      const entityA = new TestEntity(id, 'Test Entity A');
      const entityB = new TestEntity(id, 'Test Entity B');

      expect(entityA.equals(entityB)).toBe(true);
    });

    it('should return false when compare with different ids', () => {
      const idA = new TestId('id-test-a');
      const idB = new TestId('id-test-b');

      const entityA = new TestEntity(idA, 'Test Entity A');
      const entityB = new TestEntity(idB, 'Test Entity B');

      expect(entityA.equals(entityB)).toBe(false);
    });

    it('should return false when compare with nullish', () => {
      const id = new TestId('id-test');
      const entity = new TestEntity(id);

      expect(entity.equals(null)).toBe(false);
      expect(entity.equals(undefined)).toBe(false);
    });

    it('should return false when compare with non DomainEntity', () => {
      const id = new TestId('id-test');
      const entity = new TestEntity(id);

      const nonEntity = {
        id,
        name: 'Test Entity',
      } as unknown as DomainEntity<TestId>;

      expect(entity.equals(nonEntity)).toBe(false);
    });
  });
});
