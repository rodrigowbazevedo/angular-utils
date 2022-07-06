import { on } from '@ngrx/store';
import { storedState, syncState } from './actions';
import { StateWithPersistence, SelectorTypes, SelectorType } from './models';

export function persistStateActions<T extends StateWithPersistence, U>(
  featureName: string,
  selector: (state: T | U, type: SelectorType) => T = (state) => state as T
) {
  return [
    on(storedState, (state: T | U, payload) => {
      if (payload.feature !== featureName) {
        return state;
      }

      if (typeof payload.state === 'undefined') {
        return {
          ...selector(state, SelectorTypes.Stored),
          loaded: true
        };
      }

      return {
        ...selector(payload.state, SelectorTypes.Stored),
        loaded: true,
        fromCache: true
      };
    }),
    on(syncState, (state: T, payload) => {
      if (payload.feature !== featureName) {
        return state;
      }

      return selector(payload.state, SelectorTypes.Sync);
    })
  ];
}
