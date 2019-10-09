import { createFeatureSelector } from '@ngrx/store';
import { DefaultProjectorFn } from '@ngrx/store/src/selector';
import { merge } from 'lodash';

import { I18nActions, I18nActionTypes } from './i18n.actions';
import { TranslationMap, TranslationGroup, defaultNamespace } from '../ngrx-i18n.model';

export interface I18nState {
    language: string;
    defaultLanguage: string;
    translations: {
        [namespace: string]: {
            [language: string]: TranslationMap;
        };
    };
}

export const initialState: I18nState = {
    language: null,
    defaultLanguage: null,
    translations: {
        [defaultNamespace]: {}
    }
};

export function i18nReducer(state = initialState, action: I18nActions): I18nState {
    switch (action.type) {
        case I18nActionTypes.SetLanguage:
            return {
                ...state,
                language: action.payload,
                defaultLanguage: state.defaultLanguage || action.payload,
            };
        case I18nActionTypes.SetDefaultLanguage:
            return {
                ...state,
                language: state.language || action.payload,
                defaultLanguage: action.payload,
            };
        case I18nActionTypes.LoadTranslations:
            return {
                ...state,
                translations: merge(
                    {
                        ...state.translations,
                    },
                    {
                        ...parseTranslationGroup(action.payload)
                    }
                )
            };
        default:
            return state;
    }
}

export const selectLanguage = (state: I18nState): string => {
    const { language, defaultLanguage } = state;

    return language || defaultLanguage;
};

export const selectTranslation = (key: string, params = {}, namespace = defaultNamespace) => {
    return (state: I18nState): string => {
        const { language, defaultLanguage, translations } = state;
        const namespaceTranslations = translations[namespace] || { [language]: {} };

        if (namespaceTranslations[language] && namespaceTranslations[language][key]) {
            return bindParams(namespaceTranslations[language][key], params);
        }

        if (namespaceTranslations[defaultLanguage] && namespaceTranslations[defaultLanguage][key]) {
            return bindParams(namespaceTranslations[defaultLanguage][key], params);
        }

        return null;
    };
};

export const createSelectorState = () => createFeatureSelector<I18nState>('i18n');

function bindParams(translation: string, params: object): string {
    let binded = translation;

    Object.keys(params).forEach(k => {
        binded = binded.replace(new RegExp(`\{\{${k}\}\}`, 'gi'), params[k]);
    });

    return binded;
}

function parseTranslationGroup(group: TranslationGroup): object {
    const namespace = group.namespace || defaultNamespace;

    const languages = {};

    group.languages.forEach(translation => {
        const { language, translations } = translation;

        languages[language] = mapTranslations(translations);
    });

    return {
        [namespace]: languages
    };
}

function mapTranslations(obj: object, parents = []): TranslationMap {
    let map = {};

    Object.keys(obj).forEach(k => {
        const data = obj[k];

        if (typeof data === 'string' || typeof data === 'number') {
            const key = [...parents, k].join('.');

            map[key] = data.toString();
        } else if (Array.isArray(data)) {
            data.forEach((value, i) => {
                if (typeof value === 'string' || typeof value === 'number') {
                    const key = [...parents, k, i].join('.');

                    map[key] = value.toString();
                    return;
                }

                map = {
                    ...map,
                    ...mapTranslations(value, [...parents, k, i])
                };
            });
        } else if (typeof data === 'object') {
            map = {
                ...map,
                ...mapTranslations(data, [...parents, k])
            };
        }
    });

    return map;
}
