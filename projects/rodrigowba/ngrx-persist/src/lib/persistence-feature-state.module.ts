import { NgModule, Inject } from '@angular/core';
import { merge } from 'rxjs';

import { PersistenceService } from './persistence.service';
import { FEATURE_CONFIG } from './tokens';
import { FeatureConfig } from './models';

@NgModule({})
export class PersistFeatureStateModule {
    constructor(
        @Inject(FEATURE_CONFIG) configs: FeatureConfig<any>[],
        persistenceService: PersistenceService
    ) {
        merge(
            ...configs.map(config => persistenceService.persistFeature(config))
        ).subscribe();
    }
}
