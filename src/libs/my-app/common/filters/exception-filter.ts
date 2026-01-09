import { ExecutionContext } from '../../core/http/execution-context';

export interface ExceptionFilter {
  catch(exception: Error, context: ExecutionContext): any;
}
