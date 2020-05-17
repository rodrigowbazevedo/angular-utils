import { Injectable, Inject } from '@angular/core';
import { Store, select, createFeatureSelector } from '@ngrx/store';
import { Observable, from, fromEvent, merge } from 'rxjs';
import { distinctUntilChanged, debounceTime, map, shareReplay, tap, switchMap, filter } from 'rxjs/operators';
import { storage } from 'kv-storage-polyfill';
import { isEqual } from 'lodash';

import { FeatureConfig, PersistedState } from './models';
import { storedState, syncState } from './actions';
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
        const { name, sync } = config;

        if (this.featureNames.indexOf(name) === -1) {
            this.featureNames = [...this.featureNames, name];

            const observables = [
                this.getFeatureObservable<T>(config)
            ];

            if (sync === true) {
                observables.push(this.getSyncObservable<T>(config));
            }

            this.featureObservables = {
                ...this.featureObservables,
                [name]: merge(...observables)
            };
        }

        return this.featureObservables[name];
    }

    private getSyncObservable<T>(config: FeatureConfig<T>): Observable<string> {
        const { name } = config;
        const key = `state.${name}`;

        return fromEvent(window, 'storage').pipe(
            filter((e: StorageEvent) => e.key === key),
            map(e => e.newValue),
            distinctUntilChanged(),
            switchMap(() => from(storage.get(key))),
            tap((data: PersistedState<T> | undefined) => {
                if (data && data.build === this.build) {
                    this.store.dispatch(syncState(data));
                }
            }),
            map(() => name)
        );
    }

    private getFeatureObservable<T>(config: FeatureConfig<T>): Observable<string> {
        const { name, reducer, sync } = config;
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
                this.store.dispatch(storedState(data));
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
            tap(() => {
                if (sync === true) {
                    window.localStorage.setItem(key, Date.now().toString());
                }
            }),
            map(() => name),
            shareReplay<string>(1)
        );
    }
}

