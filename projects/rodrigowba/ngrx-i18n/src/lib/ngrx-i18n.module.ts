import { NgModule, ModuleWithProviders } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { NgrxI18nRootModule } from './ngrx-i18n-root.module';
import { NgrxI18nChildModule } from './ngrx-i18n-child.module';
import { NgrxI18nService } from './ngrx-i18n.service';
import { DEFAULT_LANGUAGE, MODULE_NAMESPACE, MODULE_TRANSLATIONS } from './tokens';
import { Translation, defaultNamespace } from './ngrx-i18n.model';

@NgModule({
  imports: [
    StoreModule
  ],
  providers: [
    NgrxI18nService
  ],
})
export class NgrxI18nModule {
  static forRoot(defaultLanguage = 'en'): ModuleWithProviders<NgrxI18nRootModule> {
    return {
      ngModule: NgrxI18nRootModule,
      providers: [
        NgrxI18nService,
        {
          provide: DEFAULT_LANGUAGE,
          useValue: defaultLanguage
        },
      ]
    };
  }

  static forChild(translations: Translation[] = [], namespace = defaultNamespace): ModuleWithProviders<NgrxI18nChildModule> {
    return {
      ngModule: NgrxI18nChildModule,
      providers: [
        NgrxI18nService,
        {
          provide: MODULE_TRANSLATIONS,
          useValue: translations,
        },
        {
          provide: MODULE_NAMESPACE,
          useValue: namespace,
        },
      ]
    };
  }
}
