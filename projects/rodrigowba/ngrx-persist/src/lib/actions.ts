import { Action } from '@ngrx/store';
import { PersistedState } from './models';

export enum AppStateActionTypes {
    StoredState = '[App State] Stored State',
}

export class StoredState<T> implements Action {
    readonly type = AppStateActionTypes.StoredState;
    constructor(public payload: PersistedState<T>) { }
}

export type AppStateActions = StoredState<any>;
