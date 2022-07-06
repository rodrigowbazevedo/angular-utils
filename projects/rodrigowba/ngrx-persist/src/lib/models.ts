
export interface StateWithPersistence {
  loaded: boolean;
  fromCache: boolean;
}

export type FeatureReducer<T> = (state: T) => T;

export interface FeatureConfig<T> {
  name: string;
  reducer: FeatureReducer<T>;
  debounce: number;
  sync?: boolean;
}

export interface PersistedState<T> {
  feature: string;
  build?: string;
  state?: T;
  date?: Date;
}

export enum SelectorTypes {
  Stored = 'stored',
  Sync = 'sync'
}

export type SelectorType = `${SelectorTypes}`;
