
import { ofType, Actions } from '@ngrx/effects';
import { ActionCreator } from '@ngrx/store';
import { Observable } from 'rxjs';

type Constructor<T> = new(...args: any[]) => T;

export interface OfTypeInterface {
  actions$: Actions;
  ofType<U extends ActionCreator = ActionCreator>(...types: U[]): Observable<ReturnType<U>>;
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function ofTypeMixin<T extends Constructor<{}>>(Base: T = (class {} as any)): Constructor<OfTypeInterface> {
  return class extends Base implements OfTypeInterface {
    actions$: Actions;

    ofType<U extends ActionCreator = ActionCreator>(...types: U[]): Observable<ReturnType<U>> {
      return this.actions$.pipe(
        ofType(...types)
      );
    }
  };
}
