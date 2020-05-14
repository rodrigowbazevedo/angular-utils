import { createAction, props } from '@ngrx/store';
import { PersistedState } from './models';

export const storedState = createAction(
    '[App State] Stored State',
    props<PersistedState<any>>()
);

export const syncState = createAction(
    '[App State] Synced State',
    props<PersistedState<any>>()
);

