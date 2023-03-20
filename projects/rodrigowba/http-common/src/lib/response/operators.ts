import { HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable, pipe } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { DefaultResponse, ErrorResponse } from './model';

export const responseStatus = <T extends DefaultResponse>() => map((response: T): T => {
  if (!response.success) {
    throw {
      success: false,
      statusCode: 500,
      message: response.message || 'Erro inexperado'
    } as ErrorResponse;
  }

  return response;
});

export const catchResponse = (err: HttpErrorResponse): Observable<never> => {
  if (err.error instanceof Error) {
    return throwError(() => ({
      success: false,
      statusCode: 500,
      message: 'Erro inexperado'
    }) as ErrorResponse);
  }

  return throwError(() => ({
    success: false,
    statusCode: err.status,
    message: err.error?.message ?? 'Erro inexperado'
  }) as ErrorResponse);
};

export const pipeResponse = <T extends DefaultResponse>() => pipe(
  responseStatus<T>(),
  catchError(catchResponse)
);
