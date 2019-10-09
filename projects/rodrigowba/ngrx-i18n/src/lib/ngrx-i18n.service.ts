import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { createSelectorState, selectLanguage, selectTranslation } from './state/i18n.reducers';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { SetLanguage, SetDefaultLanguage, LoadTranslations } from './state/i18n.actions';
import { Translation, defaultNamespace } from './ngrx-i18n.model';

@Injectable({
  providedIn: 'root'
})
export class NgrxI18nService {

    private language$: Observable<string>;

    constructor(
        private store: Store<any>
    ) {
        this.language$ = this.store.pipe(
            select(createSelectorState()),
            map(selectLanguage),
            shareReplay(1)
        );
    }

    selectLanguage(): Observable<string> {
        return this.language$;
    }

    selectTranslation(
        key: string,
        params: { [k: string]: string | number } = {},
        namespace: string = defaultNamespace
    ): Observable<string> {
        return this.language$.pipe(
            switchMap(() => this.store.pipe(
                select(createSelectorState()),
                map(selectTranslation(key, params, namespace))
            ))
        );
    }

    setLanguage(language: string) {
        this.store.dispatch(new SetLanguage(language));
    }

    setDefaultLanguage(language: string) {
        this.store.dispatch(new SetDefaultLanguage(language));
    }

    loadTranslations(translations: Translation[], namespace: string = defaultNamespace) {
        this.store.dispatch(new LoadTranslations({
            namespace,
            languages: translations
        }));
    }

    loadTranslation(translation: Translation, namespace: string = defaultNamespace) {
        this.loadTranslations([translation], namespace);
    }
}
