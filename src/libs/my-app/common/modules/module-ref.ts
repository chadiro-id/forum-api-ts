import { Container } from '../../core/di/container';
import { Provider } from '../../core/di/types';

export class ModuleRef {
  private container: Container;
  private providers: Array<Provider>;

  constructor(parentContainer: Container, providers: Provider[]) {
    this.container = parentContainer.createRequestScope();
    this.providers = providers;
    this.providers.forEach((p) => this.container.register(p));
  }

  resolve<T>(token: any): T {
    return this.container.resolve(token);
  }
}
