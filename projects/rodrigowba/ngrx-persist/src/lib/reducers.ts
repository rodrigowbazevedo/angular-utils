import { AppStateActions, AppStateActionTypes } from './actions';
import { StateWithPersistence } from './models';

export function persistStateMetaReducer<T extends StateWithPersistence, U>(
    featureName: string,
    selector: (state: U) => T = null
) {
    return (state: T, action: AppStateActions): T => {
        switch (action.type) {
            case AppStateActionTypes.StoredState:
                if (action.payload.feature !== featureName) {
                    return state;
                }

                if (typeof action.payload.state === 'undefined') {
                    return {
                        ...state,
                        loaded: true
                    };
                }

                if (selector !== null) {
                    return {
                        ...selector(action.payload.state as U),
                        loaded: true,
                        fromCache: true
                    };
                }

                return {
                    ...action.payload.state as T,
                    loaded: true,
                    fromCache: true
                };
            default:
                return state;
        }
    };
}
