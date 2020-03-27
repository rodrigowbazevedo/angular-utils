import { Injectable, Inject } from '@angular/core';
import { Store, select, createFeatureSelector } from '@ngrx/store';
import { Observable, from } from 'rxjs';
import { distinctUntilChanged, debounceTime, map, shareReplay, tap, switchMap } from 'rxjs/operators';
import { storage } from 'kv-storage-polyfill';
import { isEqual } from 'lodash';

import { FeatureConfig, PersistedState } from './models';
import { StoredState } from './actions';
import { BUILD_ID } from './tokens';

@Injectable({
    providedIn: 'root'
})
export class PersistenceService {
    private featureNames: string[] = [];
    private featureObservables: {
        [k: string]: Observable<string>
    } = {};

    constructor(
        @Inject(BUILD_ID) private build: string | number = 'DEV',
        private store: Store<any>,
    ) { }

    persistFeature<T>(config: FeatureConfig<T>): Observable<string> {
        const { name } = config;

        if (this.featureNames.indexOf(name) === -1) {
            this.featureNames = [...this.featureNames, name];
            this.featureObservables = {
                ...this.featureObservables,
                [name]: this.getFeatureObservable<T>(config)
            };
        }

        return this.featureObservables[name];
    }

    private getFeatureObservable<T>(config: FeatureConfig<T>): Observable<string> {
        const { name, reducer } = config;
        const key = `state.${name}`;

        const featureSelector = createFeatureSelector<T>(name);

        return from(storage.get(key)).pipe(
            map((data: PersistedState<T> | undefined) => {
                if (data && data.build === this.build) {
                    return data;
                }

                return { feature: name };
            }),
            tap((data: PersistedState<T> | undefined) => {
                this.store.dispatch(new StoredState<T>(data));
            }),
            switchMap(() => this.store.pipe(
                select(featureSelector),
                map(reducer),
                debounceTime(config.debounce * 1000),
                distinctUntilChanged(isEqual),
            )),
            switchMap(state => from(storage.set(key, {
                feature: name,
                build: this.build,
                state,
                date: new Date()
            } as PersistedState<T>))),
            map(() => name),
            shareReplay<string>(1)
        );
    }
}

