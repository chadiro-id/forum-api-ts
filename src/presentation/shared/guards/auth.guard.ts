import { CanActivate } from '../../../libs/my-app/common/guards/can-activate';
import { JwtTokenService } from '../../../infrastructure/security/jwt-token-service';
import { Injectable } from '../../../libs/my-app/common/injections/injections.decorator';
import { ExecutionContext } from '../../../libs/my-app/core/http/execution-context';
import { AuthenticationError } from '../../../shared/errors/authentication-error';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtTokenService: JwtTokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new AuthenticationError('Missing authentication');
    }

    request['user'] = await this.jwtTokenService.verifyAccessToken(token);
    return true;
  }

  private extractTokenFromHeader(req: any): string | undefined {
    const [type, token] = req.headers?.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
