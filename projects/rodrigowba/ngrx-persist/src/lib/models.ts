
export interface StateWithPersistence {
    loaded: boolean;
    fromCache: boolean;
}

export type FeatureReducer<T extends StateWithPersistence> = (state: T) => T;

export interface FeatureConfig<T extends StateWithPersistence> {
    name: string;
    reducer: FeatureReducer<T>;
    debounce: number;
}

export interface PersistedState<T extends StateWithPersistence> {
    feature: string;
    build?: string;
    state?: T;
    date?: Date;
}
