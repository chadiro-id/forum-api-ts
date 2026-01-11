import * as bcrypt from 'bcrypt';
import { PasswordHasher } from '../../application/common/interfaces/password-hasher.interface';
import { Injectable } from '../../libs/my-app/common/injections/injections.decorator';

@Injectable()
export class BcryptPasswordHasher implements PasswordHasher {
  private readonly saltRounds = 10;

  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  comparePassword(password: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(password, hashed);
  }
}
