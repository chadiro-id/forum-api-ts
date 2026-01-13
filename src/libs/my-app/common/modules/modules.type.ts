export interface ModuleOptions {
  providers?: any[];
  controllers?: any[];
  imports?: any[];
}

export type MyAppModule = ModuleOptions | (new (...args: any[]) => any);
