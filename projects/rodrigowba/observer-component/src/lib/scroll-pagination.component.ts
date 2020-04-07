import { OnInit } from '@angular/core';
import { BehaviorSubject, Observable, merge, Subject } from 'rxjs';
import { distinctUntilChanged, switchMap, throttleTime } from 'rxjs/operators';

import { ObserverComponent } from './observer.component';
import { Pagination, Filters, isInitialPagination, filterPaginationScrollPosition } from '@rodrigowba/http-common';

export abstract class ScrollPaginationComponent extends ObserverComponent implements OnInit {
    private scrollIndex$: Subject<number>;

    ngOnInit() {
        this.scrollIndex$ = this.unsubscribe<number>(new BehaviorSubject(0));
    }

    changeIndex(index: number) {
        this.scrollIndex$.next(index);
    }

    selectToLoadPage<T extends Filters>(pagination$: Observable<Pagination<T>>): Observable<T> {
        return merge<T>(
            pagination$.pipe(
                isInitialPagination<T>(),
            ),
            this.scrollIndex$.pipe(
                distinctUntilChanged(),
                switchMap(index => pagination$.pipe(
                    filterPaginationScrollPosition<T>(index)
                )),
            )
        ).pipe(
            throttleTime(200)
        );
    }
}
