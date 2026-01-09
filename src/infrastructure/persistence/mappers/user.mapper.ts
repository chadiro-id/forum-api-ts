import { User, UserId } from '../../../domain/entities/user';

export interface UserRow {
  id: string;
  username: string;
  password: string;
  fullname: string;
  created_at: Date;
}
export class UserMapper {
  static toDomain(row: UserRow): User {
    const id = new UserId(row.id);
    return new User(
      id,
      row.username,
      row.password,
      row.fullname,
      row.created_at,
    );
  }

  static toPersistence(entity: User) {
    return {
      id: entity.id.value,
      username: entity.username,
      password: entity.password,
      fullname: entity.fullname,
      created_at: entity.createdAt,
    };
  }
}
