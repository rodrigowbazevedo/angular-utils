
import { ofType, Actions } from '@ngrx/effects';
import { ActionCreator } from '@ngrx/store';
import { Observable } from 'rxjs';

type Constructor<T> = new(...args: any[]) => T;

type UnionTouple<T extends readonly any[]> = T[number];

export interface OfTypeInterface {
  actions$: Actions;
  ofType<U extends readonly ActionCreator[]>(...types: U): Observable<ReturnType<UnionTouple<U>>>;
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function ofTypeMixin<T extends Constructor<{}>>(Base: T = (class {} as any)): Constructor<OfTypeInterface> {
  return class extends Base implements OfTypeInterface {
    actions$: Actions;

    ofType<U extends readonly ActionCreator[]>(...types: U): Observable<ReturnType<UnionTouple<U>>> {
      return this.actions$.pipe(
        ofType(...types)
      );
    }
  };
}
