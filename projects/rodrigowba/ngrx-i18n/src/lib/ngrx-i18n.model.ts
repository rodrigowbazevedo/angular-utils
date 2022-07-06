
export interface TranslationMap {
  [k: string]: string;
}

export interface Translation {
  language: string;
  translations: object;
}

export interface TranslationGroup {
  languages: Translation[];
  namespace?: string;
}

export const defaultNamespace = 'default';
