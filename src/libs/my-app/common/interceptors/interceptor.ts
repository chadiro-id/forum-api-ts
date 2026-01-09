import { ExecutionContext } from '../../core/http/execution-context';

export interface Interceptor {
  intercept(context: ExecutionContext, next: () => Promise<any>): Promise<any>;
}
