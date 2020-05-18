import { OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Constructor } from './constructor';

export interface Observer extends OnDestroy {
    subjects: Subject<any>[];
    destroy$: Subject<boolean>;
    observe<U>(observable: Observable<U>): Observable<U>;
    unsubscribe<U>(subject: Subject<U>): Subject<U>;
}

export function observerMixin<T extends Constructor<{}>>(BaseClass: T = (class {} as any)): Constructor<Observer> & T {
    return class extends BaseClass implements Observer {
        subjects: Subject<any>[] = [];

        destroy$: Subject<boolean> = new Subject<boolean>();

        observe<U>(observable: Observable<U>): Observable<U> {
            return observable.pipe(
                takeUntil(this.destroy$)
            );
        }

        unsubscribe<U>(subject: Subject<U>): Subject<U> {
            this.subjects.push(subject);

            return subject;
        }

        ngOnDestroy() {
            this.destroy$.next(true);
            this.destroy$.unsubscribe();

            this.subjects.forEach(subject => subject.unsubscribe());
        }
    };
}

export abstract class ObserverComponent extends observerMixin() {

}
