import { Injectable, Inject } from '@angular/core';
import { Store, select, createFeatureSelector } from '@ngrx/store';
import { Observable, from, fromEvent, merge } from 'rxjs';
import { distinctUntilChanged, debounceTime, map, shareReplay, tap, switchMap, filter } from 'rxjs/operators';
import { StorageArea } from 'kv-storage-polyfill';
import { isEqual } from 'lodash';

import { FeatureConfig, PersistedState } from './models';
import { storedState, syncState } from './actions';
import { BUILD_ID } from './tokens';

@Injectable({
  providedIn: 'root'
})
export class PersistenceService {
  private storage: StorageArea;
  private featureNames: string[] = [];
  private featureObservables: {
    [k: string]: Observable<string>
  } = {};

  constructor(
    @Inject(BUILD_ID) private build: string | number = 'DEV',
    private store: Store<any>,
  ) {
    this.storage = new StorageArea(this.build);
  }

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

    const syncStateAction = syncState<T>();

    return fromEvent(window, 'storage').pipe(
      filter((e: StorageEvent) => e.key === key),
      map(e => e.newValue),
      distinctUntilChanged(),
      switchMap(() => from(this.storage.get(key))),
      tap((data: PersistedState<T> | undefined) => {
        if (data) {
          this.store.dispatch(syncStateAction(data));
        }
      }),
      map(() => name)
    );
  }

  private getFeatureObservable<T>(config: FeatureConfig<T>): Observable<string> {
    const { name, reducer, sync } = config;
    const key = `state.${name}`;

    const featureSelector = createFeatureSelector<T>(name);
    const storedStateAction = storedState<T>();

    return from(this.storage.get(key)).pipe(
      map((data: PersistedState<T> | undefined) => {
        if (data) {
          return data;
        }

        return { feature: name };
      }),
      tap((data: PersistedState<T> | undefined) => {
        this.store.dispatch(storedStateAction(data));
      }),
      switchMap(() => this.store.pipe(
        select(featureSelector),
        map(reducer),
        debounceTime(config.debounce * 1000),
        distinctUntilChanged(isEqual),
      )),
      switchMap(state => from(this.storage.set(key, {
        feature: name,
        state,
        date: new Date()
      } as PersistedState<T>))),
      tap(() => {
        if (sync === true) {
          window.localStorage.setItem(key, Date.now().toString());
        }
      }),
      map(() => name),
      shareReplay<string>({
        bufferSize: 1,
        refCount: true
      })
    );
  }
}

