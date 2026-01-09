export type ProviderScope = 'SINGLETON' | 'REQUEST';
export type Provider =
  | { provide: any; useClass: any }
  | { provide: any; useValue: any }
  | {
      provide: any;
      useFactory: (...args: any[]) => any;
      inject?: any[];
    };
