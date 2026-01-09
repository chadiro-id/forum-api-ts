import { DomainError } from '../../domain/common/domain-error';
import { ClientError } from '../../shared/errors/client-error';
import { InvariantError } from '../../shared/errors/invariant-error';
import { NotFoundError } from '../../shared/errors/not-found-error';
import { AuthenticationError } from '../../shared/errors/authentication-error';
import { AuthorizationError } from '../../shared/errors/authorization-error';
import { UsernameAlreadyExistsError } from '../../application/users/errors/username-already-exists.error';

const dir: Record<string, ClientError> = {
  UsernameAlreadyExistsError: new InvariantError('username tidak tersedia'),
  NonExistenceUserLoginError: new InvariantError('pengguna tidak ada'),
  InvalidCredentialsError: new AuthenticationError(
    'kredensial yang anda masukkan salah',
  ),
  RefreshTokenNotFoundError: new InvariantError(
    'refresh token tidak ditemukan di database',
  ),
  ThreadNotFoundError: new NotFoundError('thread tidak ditemukan'),
  CommentNotFoundError: new NotFoundError('komentar tidak ditemukan'),
  ReplyNotFoundError: new NotFoundError('balasan tidak ditemukan'),
  DeceptiveAccessError: new InvariantError('gagal mengakses sumber daya'),
  AccessRightsError: new AuthorizationError(
    'pengguna tidak memiliki hak akses',
  ),
};

type DomainErrorConstructor = new () => DomainError;
const errorMap = new Map<DomainErrorConstructor, ClientError>();
errorMap.set(UsernameAlreadyExistsError, new InvariantError(''));

export default {
  translate: (error: DomainError) => dir[error.name] || error,
};
