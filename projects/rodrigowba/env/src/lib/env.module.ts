import { NgModule, ModuleWithProviders } from '@angular/core';

import { EnvServiceFactory } from './env.service.factory';
import { EnvService } from './env.service';

@NgModule({})
export class EnvModule {
  static forRoot(): ModuleWithProviders<EnvModule> {
    return {
      ngModule: EnvModule,
      providers: [
        {
          provide: EnvService,
          useFactory: EnvServiceFactory,
          deps: [],
        }
      ]
    };
  }
}
