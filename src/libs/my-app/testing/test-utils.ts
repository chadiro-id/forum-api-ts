import 'reflect-metadata';
import { getModuleMetadata } from '../common/modules/modules.decorator';
import { Container } from '../core/di/container';

/* eslint-disable @typescript-eslint/no-namespace */
namespace Test {
  export function createTestingModule(rootModule: any) {
    const container = new Container();

    function loadModule(module: any) {
      const { imports, providers } = getModuleMetadata(module);
      imports.forEach(loadModule);
      providers.forEach((p: any) => container.register(p));
    }

    loadModule(rootModule);
    return container;
  }
}

export default Test;
