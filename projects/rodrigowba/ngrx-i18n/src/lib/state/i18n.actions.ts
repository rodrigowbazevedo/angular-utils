import { Action } from '@ngrx/store';
import { TranslationGroup } from '../ngrx-i18n.model';

export enum I18nActionTypes {
    LoadTranslations = '[i18n] LoadTranlations',
    SetLanguage = '[i18n] Set Language',
    SetDefaultLanguage = '[i18n] Set Default Language',
}

export class LoadTranslations implements Action {
    readonly type = I18nActionTypes.LoadTranslations;
    constructor(public payload: TranslationGroup) {}
}

export class SetLanguage implements Action {
    readonly type = I18nActionTypes.SetLanguage;
    constructor(public payload: string) {}
}

export class SetDefaultLanguage implements Action {
    readonly type = I18nActionTypes.SetDefaultLanguage;
    constructor(public payload: string) {}
}

export type I18nActions = LoadTranslations
    | SetLanguage
    | SetDefaultLanguage
;
