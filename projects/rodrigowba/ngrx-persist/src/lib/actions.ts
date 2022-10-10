import { createAction, props } from '@ngrx/store';
import { PersistedState } from './models';

export const storedState = <T>() => createAction(
  '[App State] Stored State',
  props<PersistedState<T>>()
);

export const syncState = <T>() => createAction(
  '[App State] Synced State',
  props<PersistedState<T>>()
);

