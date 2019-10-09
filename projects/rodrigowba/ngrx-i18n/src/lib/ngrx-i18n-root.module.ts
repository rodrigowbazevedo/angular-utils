import { NgModule, Inject } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { DEFAULT_LANGUAGE } from './tokens';
import * as fromI18n from './state/i18n.reducers';
import { NgrxI18nService } from './ngrx-i18n.service';

@NgModule({
  imports: [
    StoreModule.forFeature('i18n', fromI18n.i18nReducer),
  ],
})
export class NgrxI18nRootModule {
    constructor(
        @Inject(DEFAULT_LANGUAGE) language: string,
        i18nService: NgrxI18nService
    ) {
        i18nService.setDefaultLanguage(language);
    }
}
