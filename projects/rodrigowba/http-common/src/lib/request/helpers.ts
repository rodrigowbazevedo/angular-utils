import { HttpParams } from '@angular/common/http';
import { PaginationRequestParams } from './model';

export const insertPaginationParams = (params: HttpParams, pagination: PaginationRequestParams): HttpParams => {
    if (typeof pagination.page === 'number') {
        params = params.set('page', pagination.page.toString());
    }

    if (typeof pagination.perPage === 'number') {
        params = params.set('perPage', pagination.perPage.toString());
    }

    if (typeof pagination.orderBy === 'string') {
        params = params.set('orderBy', pagination.orderBy);
    }

    if (typeof pagination.order === 'string') {
        params = params.set('order', pagination.order);
    }

    return params;
};
