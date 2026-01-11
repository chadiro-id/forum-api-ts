export interface PasswordHasher {
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string, hashed: string): Promise<boolean>;
}
