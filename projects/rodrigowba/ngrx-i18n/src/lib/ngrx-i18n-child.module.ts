import { NgModule, Inject } from '@angular/core';

import { MODULE_NAMESPACE, MODULE_TRANSLATIONS } from './tokens';
import { I18nPipe } from './pipes/i18n.pipe';
import { Translation } from './ngrx-i18n.model';
import { NgrxI18nService } from './ngrx-i18n.service';

@NgModule({
  declarations: [
    I18nPipe
  ],
  exports: [
    I18nPipe
  ],
})
export class NgrxI18nChildModule {
  constructor(
    @Inject(MODULE_NAMESPACE) namespace: string,
    @Inject(MODULE_TRANSLATIONS) translations: Translation[],
    i18nService: NgrxI18nService
  ) {
    i18nService.loadTranslations(translations, namespace);
  }
}
