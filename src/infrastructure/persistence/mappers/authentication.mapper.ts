import { UserId } from '../../../domain/entities/user';
import {
  Authentication,
  AuthenticationId,
} from '../../../domain/entities/authentication';

export interface AuthenticationRow {
  id: string;
  user_id: string;
  token: string;
}
export class AuthenticationMapper {
  static toDomain(row: AuthenticationRow): Authentication {
    const id = new AuthenticationId(parseInt(row.id, 10));
    const userId = new UserId(row.user_id);
    const entity = Authentication.create(userId, row.token);
    entity.assignId(id);
    return entity;
  }

  static toPersistence(entity: Authentication) {
    return {
      id: entity.id.value,
      user_id: entity.userId.value,
      token: entity.token,
    };
  }
}
