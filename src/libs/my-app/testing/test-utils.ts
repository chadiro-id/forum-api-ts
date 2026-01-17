import 'reflect-metadata';
import { getModuleMetadata } from '../common/modules/modules.decorator';
import { Container } from '../core/di/container';
import { ModuleOptions, MyAppModule } from '../common/modules/modules.type';
import { Provider } from '../core/di/types';

/* eslint-disable @typescript-eslint/no-namespace */
namespace Test {
  export function createTestingModule(rootModule: MyAppModule) {
    const container = new Container();

    function loadModule(module: any) {
      let options: ModuleOptions;
      if (typeof module === 'function') {
        options = getModuleMetadata(module);
      } else {
        options = module;
      }
      options.imports?.forEach(loadModule);
      options.providers?.forEach((p) => container.register(p as Provider));
    }

    loadModule(rootModule);
    return container;
  }
}

export default Test;
