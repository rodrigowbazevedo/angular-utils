import { Action } from '@ngrx/store';
import { PersistedState, StateWithPersistence } from './models';

export enum AppStateActionTypes {
    StoredState = '[App State] Stored State',
}

export class StoredState<T extends StateWithPersistence> implements Action {
    readonly type = AppStateActionTypes.StoredState;
    constructor(public payload: PersistedState<T>) { }
}

export type AppStateActions = StoredState<any>;
