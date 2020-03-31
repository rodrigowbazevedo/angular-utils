import { on } from '@ngrx/store';
import { storedState } from './actions';
import { StateWithPersistence } from './models';

export function persistStateActions<T extends StateWithPersistence, U>(
    featureName: string,
    selector: (state: T | U) => T = (state) => state as T
) {
    return [
        on(storedState, (state: T | U, payload) => {
            if (payload.feature !== featureName) {
                return state;
            }

            if (typeof payload.state === 'undefined') {
                return {
                    ...selector(state),
                    loaded: true
                };
            }

            return {
                ...selector(payload.state),
                loaded: true,
                fromCache: true
            };
        })
    ];
}
