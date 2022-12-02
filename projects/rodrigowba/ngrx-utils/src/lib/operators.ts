import { ActionCreator } from '@ngrx/store';
import { merge, Observable, of, pipe } from 'rxjs';
import { groupBy, mergeMap, exhaustMap, map, startWith, shareReplay } from 'rxjs/operators';
import * as hash from 'json-hash';

import { Payload } from './model';
import { injectPayload } from './helpers';

// eslint-disable-next-line max-len
export const errorResponse = <T, U extends ActionCreator = ActionCreator>(actionCreator: U) => {
  const injector = injectPayload(actionCreator);

  return (err: T) => of(injector(err));
};

export const mapPayload = <T>() => pipe(
  map((action: Payload<T>) => action.payload),
);

export const mapPayloadData = <T>() => pipe(
  map((action: Payload<{ data: T }>) => action.payload.data),
);

export const exhaustGroup = <T, U>(
  observable: (v: T) => Observable<U>,
  selector: (v: T) => string = hash.digest,
) => pipe(
  groupBy<T, string>(selector),
  mergeMap(group => group.pipe(
    exhaustMap(observable)
  ))
);

export const booleanSwitch = <T, N>(
  trueObservable$: Observable<T>,
  falseObservable$: Observable<N>,
  defaultValue = false
) => merge(
  trueObservable$.pipe(
    map(() => true)
  ),
  falseObservable$.pipe(
    map(() => false)
  ),
).pipe(
  startWith(defaultValue),
  shareReplay({
    bufferSize: 1,
    refCount: true
  })
);
