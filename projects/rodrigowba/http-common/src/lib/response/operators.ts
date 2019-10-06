import { HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable, pipe } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { DefaultResponse, FormValidationResponse } from './model';

export const responseStatus = <T extends DefaultResponse>() => map((response: T): T => {
    if (!response.status) {
        throw {
            status: false,
            message: response.message || 'Erro inexperado'
        } as DefaultResponse;
    }

    return response;
});

export const catchResponse = (err: HttpErrorResponse): Observable<never> => {
    if (err.error instanceof Error) {
        return throwError({
            status: false,
            message: 'Erro inexperado'
        } as DefaultResponse);
    }

    return throwError(err.error as DefaultResponse);
};

export const pipeResponse = <T extends DefaultResponse>() => pipe(
    responseStatus<T>(),
    catchError(catchResponse)
);
