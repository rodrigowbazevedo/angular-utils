import { HttpParams } from '@angular/common/http';
import { PaginationRequestParams, FilteredPaginationRequest } from './model';
import { Filters, Pagination } from '../pagination/model';

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

export const buildFilteredPaginationRequest = <T extends Filters>(params: PaginationRequestParams = {}) => {
  return (pagination: Pagination<T>): FilteredPaginationRequest<T> => {
    const { filters } = pagination;

    const requestParams: PaginationRequestParams = {
      ...params,
      page: pagination.metadata.current_page
    };

    if (typeof filters.perPage === 'number') {
      requestParams.perPage = filters.perPage;
    }

    if (typeof filters.orderBy === 'string') {
      requestParams.orderBy = filters.orderBy;
    }

    if (typeof filters.order === 'string') {
      requestParams.order = filters.order;
    }

    return {
      filters,
      pagination: requestParams
    };
  };
};
