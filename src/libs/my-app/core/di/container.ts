import {
  DI_INJECT_KEY,
  DI_INJECTABLE_KEY,
} from '../../common/injections/injections.decorator';
import { Provider } from './types';

export class Container {
  private providers = new Map<any, Provider>();
  private instances = new Map<any, any>();

  constructor(private parent?: Container) {}

  createRequestScope() {
    return new Container(this);
  }

  register(provider: Provider) {
    if (typeof provider === 'function') {
      this.providers.set(provider, { provide: provider, useClass: provider });
      return;
    }
    this.providers.set(provider.provide, provider);
  }

  resolve<T>(token: any): T {
    if (this.instances.has(token)) {
      return this.instances.get(token);
    }

    if (!this.providers.has(token) && typeof token === 'function') {
      this.register(token);
    }

    const provider =
      this.providers.get(token) || this.parent?.providers.get(token);
    if (!provider) {
      throw new Error(`[Container] No provider for token ${token.toString()}`);
    }

    if ('useClass' in provider) {
      const scope =
        Reflect.getMetadata(DI_INJECTABLE_KEY, provider.useClass || provider) ||
        'SINGLETON';

      if (scope === 'REQUEST') {
        const instance = this.instantiate(provider.useClass);
        this.instances.set(token, instance);
        return instance;
      }
    }

    if (this.parent) {
      return this.parent.resolve(token);
    }

    let instance;

    if ('useValue' in provider) {
      instance = provider.useValue;
    }

    if ('useClass' in provider) {
      instance = this.instantiate(provider.useClass);
    }

    if ('useFactory' in provider) {
      const deps = provider.inject?.map((t) => this.resolve(t)) || [];
      instance = provider.useFactory(...deps);
    }

    this.instances.set(token, instance);
    return instance;
  }

  private instantiate(target: any) {
    const paramTypes = Reflect.getMetadata('design:paramtypes', target) || [];
    const injectTokens = Reflect.getMetadata(DI_INJECT_KEY, target) || [];

    const deps = paramTypes.map((type: any, index: number) => {
      const token = injectTokens[index] || type;
      if (token?.forwardRef) {
        return this.resolve(token.forwardRef());
      }
      return this.resolve(token);
    });

    return new target(...deps);
  }
}
