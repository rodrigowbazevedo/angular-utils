import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

export const toPromise = <T>(observable: Observable<T>): Promise<T> => {
    return observable.pipe(
        take(1)
    ).toPromise();
};
