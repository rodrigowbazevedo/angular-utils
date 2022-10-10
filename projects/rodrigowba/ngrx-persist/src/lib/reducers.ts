import { ActionCreator } from '@ngrx/store';
import { ReducerTypes } from '@ngrx/store/src/reducer_creator';

import { storedState, syncState } from './actions';
import { StateWithPersistence, SelectorTypes, SelectorType } from './models';

export function persistStateActions<T extends StateWithPersistence, U = T>(
  featureName: string,
  selector: (state: T | U, type: SelectorType) => T = (state) => state as T
): ReducerTypes<T, readonly ActionCreator[]>[] {
  const storedStateAction = storedState<T>();
  const syncStateAction = syncState<T>();

  return [
    {
      types: [storedStateAction.type],
      reducer: (state, payload: ReturnType<typeof storedStateAction>) => {
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
      }
    },
    {
      types: [syncStateAction.type],
      reducer: (state, payload: ReturnType<typeof syncStateAction>) => {
        if (payload.feature !== featureName) {
          return state;
        }

        return selector(payload.state, SelectorTypes.Sync);
      }
    },
  ];
}
