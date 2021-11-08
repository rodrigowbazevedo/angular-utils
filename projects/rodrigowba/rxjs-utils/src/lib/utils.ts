import { Observable, firstValueFrom } from 'rxjs';

export const toPromise = <T>(observable: Observable<T>): Promise<T> => {
    return firstValueFrom(observable);
};
