import { NgModule, ModuleWithProviders, Inject } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { PersistenceService } from './persistence.service';
import { FEATURE_CONFIG, BUILD_ID } from './tokens';
import { FeatureReducer, StateWithPersistence } from './models';
import { PersistFeatureStateModule } from './persistence-feature-state.module';

export function featureEmptyReducer<T>(state: T) {
    return state;
}

@NgModule({
    declarations: [],
    imports: [
        StoreModule,
    ]
})
export class PersistStateModule {
    static forRoot(buildId: string = 'DEV'): ModuleWithProviders<PersistStateModule> {
        return {
            ngModule: PersistStateModule,
            providers: [
                PersistenceService,
                {
                    provide: BUILD_ID,
                    useValue: buildId
                },
            ]
        };
    }

    static forFeature<T>(
        featureName: string,
        debounce = 5,
        reducer: FeatureReducer<T> = featureEmptyReducer
    ): ModuleWithProviders<PersistFeatureStateModule<T>> {
        return {
            ngModule: PersistFeatureStateModule,
            providers: [
                {
                    provide: FEATURE_CONFIG,
                    multi: true,
                    useValue: {
                        name: featureName,
                        reducer,
                        debounce
                    }
                },
            ]
        };
    }
}
