import { NgModule, ModuleWithProviders } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { NgrxI18nRootModule } from './ngrx-i18n-root.module';
import { NgrxI18nService } from './ngrx-i18n.service';
import { I18nPipe } from './pipes/i18n.pipe';
import { DEFAULT_LANGUAGE } from './tokens';

@NgModule({
    imports: [
        StoreModule
    ],
    providers: [
        NgrxI18nService
    ],
    declarations: [
        I18nPipe
    ],
    exports: [
        I18nPipe
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
}
