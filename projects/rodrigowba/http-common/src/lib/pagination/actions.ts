import { createAction, props } from '@ngrx/store';
import { Pagination, Filters } from './model';


export const paginationActions = <T extends Filters, U extends Pagination<T> = Pagination<T>>() => {
  const loadPagination = createAction(
    '[Pagination] Load Pagination',
    props<{ payload: U }>()
  );

  const paginationLoaded = createAction(
    '[Pagination] Pagination Loaded',
    props<{ payload: U }>()
  );

  const resetPagination = createAction(
    '[Pagination] Reset Pagination',
    props<{ payload: T }>()
  );

  return {
    loadPagination,
    paginationLoaded,
    resetPagination
  };
};
