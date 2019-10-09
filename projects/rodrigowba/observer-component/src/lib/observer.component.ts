import { OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export abstract class ObserverComponent implements OnDestroy {
    private subjects: Subject<any>[] = [];

    private destroy$: Subject<boolean> = new Subject<boolean>();

    observe<T>(observable: Observable<T>): Observable<T> {
        return observable.pipe(
            takeUntil(this.destroy$)
        );
    }

    unsubscribe<T>(subject: Subject<T>): Subject<T> {
        this.subjects.push(subject);

        return subject;
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();

        this.subjects.forEach(subject => subject.unsubscribe());
    }
}
