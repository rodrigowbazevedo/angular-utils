import { on } from '@ngrx/store';
import { storedState } from './actions';
import { StateWithPersistence } from './models';

export function persistStateActions<T extends StateWithPersistence, U>(
    featureName: string,
    selector: (state: U) => T = null
) {
    return [
        on(storedState, (state: T, payload) => {
            if (payload.feature !== featureName) {
                return state;
            }

            if (typeof payload.state === 'undefined') {
                return {
                    ...state,
                    loaded: true
                };
            }

            if (selector !== null) {
                return {
                    ...selector(payload.state as U),
                    loaded: true,
                    fromCache: true
                };
            }

            return {
                ...payload.state as T,
                loaded: true,
                fromCache: true
            };
        })
    ];
}
