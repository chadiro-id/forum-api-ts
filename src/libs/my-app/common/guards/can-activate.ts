import { ExecutionContext } from '../../core/http/execution-context';

export interface CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean>;
}
