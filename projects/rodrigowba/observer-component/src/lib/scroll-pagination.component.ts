import { BehaviorSubject, Observable, merge, Subject } from 'rxjs';
import { distinctUntilChanged, switchMap, throttleTime } from 'rxjs/operators';

import { observerMixin, Observer } from './observer.component';
import { Pagination, Filters, isInitialPagination, filterPaginationScrollPosition } from '@rodrigowba/http-common';
import { Constructor } from './constructor';

export interface ScrollPagination extends Observer {
  scrollIndex$: Subject<number>;
  margin: number;
  changeIndex(index: number): void;
  selectToLoadPage<U extends Filters>(pagination$: Observable<Pagination<U>>): Observable<U>;
}

export function scrollPaginationMixin<T extends Constructor<{}>>(BaseClass: T = (class { } as any)): Constructor<ScrollPagination> & T {
  return class extends observerMixin(BaseClass) implements ScrollPagination {
    scrollIndex$: Subject<number> = this.unsubscribe<number>(new BehaviorSubject(0));

    margin = 0.3;

    changeIndex(index: number) {
      this.scrollIndex$.next(index);
    }

    selectToLoadPage<U extends Filters>(pagination$: Observable<Pagination<U>>): Observable<U> {
      return merge(
        pagination$.pipe(
          isInitialPagination<U>(),
        ),
        this.scrollIndex$.pipe(
          distinctUntilChanged(),
          switchMap(index => pagination$.pipe(
            filterPaginationScrollPosition<U>(index, this.margin)
          )),
        )
      ).pipe(
        throttleTime(200)
      );
    }
  };
}

export abstract class ScrollPaginationComponent extends scrollPaginationMixin() {

}
