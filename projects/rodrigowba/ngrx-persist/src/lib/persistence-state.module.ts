import { NgModule, ModuleWithProviders } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { PersistenceService } from './persistence.service';
import { FEATURE_CONFIG, BUILD_ID } from './tokens';
import { FeatureConfig } from './models';
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
        config: Partial<FeatureConfig<T>>
    ): ModuleWithProviders<PersistFeatureStateModule> {
        return {
            ngModule: PersistFeatureStateModule,
            providers: [
                {
                    provide: FEATURE_CONFIG,
                    multi: true,
                    useValue: {
                        debounce: false,
                        reducer: featureEmptyReducer,
                        sync: false,
                        ...config
                    }
                },
            ]
        };
    }
}
