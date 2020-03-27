import { createAction, props } from '@ngrx/store';
import { PersistedState } from './models';

export const storedState = createAction(
    '[App State] Stored State',
    props<PersistedState<any>>()
);

