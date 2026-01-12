import { User, UserId } from '@main/domain/users/user';
import { RegisteredUserReport } from './registered-user.report';

describe('RegisteredUserReport', () => {
  it('should initialize with valid data', () => {
    const report = new RegisteredUserReport('user-001', 'johndoe', 'John Doe');
    expect(report.id).toEqual('user-001');
    expect(report.username).toEqual('johndoe');
    expect(report.fullname).toEqual('John Doe');

    expect(Object.keys(report)).toHaveLength(3);
  });

  describe('fromEntity', () => {
    it('should initialize data from entity', () => {
      const entity = User.create(
        new UserId('user-001'),
        'johndoe',
        'p455w0rd',
        'John Doe',
      );
      const report = RegisteredUserReport.fromEntity(entity);
      expect(report).toStrictEqual(
        new RegisteredUserReport(
          entity.id.value,
          entity.username,
          entity.fullname,
        ),
      );
    });
  });
});
