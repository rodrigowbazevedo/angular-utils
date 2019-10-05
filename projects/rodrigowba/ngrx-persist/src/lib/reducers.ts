import { AppStateActions, AppStateActionTypes } from './actions';
import { StateWithPersistence } from './models';

export function persistStateMetaReducer<T extends StateWithPersistence>(featureName: string) {
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
