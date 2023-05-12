import { HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable, pipe } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { DefaultResponse, ErrorResponse, ErrorResponseData } from './model';

export const responseStatus = <T extends DefaultResponse>(defaultError = 'Erro inesperado') => map((response: T): T => {
  if (!response.success) {
    if ('data' in response) {
      throw {
        success: false,
        statusCode: 500,
        message: response?.message ?? defaultError,
        data: response.data
      } as ErrorResponseData<typeof response.data>;
    }

    throw {
      success: false,
      statusCode: 500,
      message: response?.message ?? defaultError,
    } as ErrorResponse;
  }

  return response;
});

export const catchResponse = (err: HttpErrorResponse, defaultError = 'Erro inesperado'): Observable<never> => {
  if (err.error instanceof Error) {
    return throwError(() => ({
      success: false,
      statusCode: 500,
      message: defaultError
    }) as ErrorResponse);
  }

  return throwError(() => ({
    success: false,
    statusCode: err.status,
    message: err.error?.message ?? defaultError,
    data: err.error?.data
  }) as ErrorResponseData<typeof err.error.data>);
};

export const pipeResponse = <T extends DefaultResponse>(defaultError = 'Erro inesperado') => pipe(
  responseStatus<T>(),
  catchError(error => catchResponse(error, defaultError))
);
