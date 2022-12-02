import { EntityAdapter } from '@ngrx/entity';
import { createAction, on, props } from '@ngrx/store';

import { createActionWithPayload, injectPayload } from '@rodrigowba/ngrx-utils';

import { DefaultResponse } from '../response/model';
import {
  Pagination,
  Filters,
  OuterPaginationActions,
  PaginationData,
  OuterPaginationState,
  PaginationActions,
  PaginationReducer,
} from './model';

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

export const outerPaginationActions = <T, F extends Filters>(module: string): OuterPaginationActions<T, F> => ({
  loadNextPage: createActionWithPayload<F>(`[${module}] Load Next Page`),
  loadPage: createActionWithPayload<Pagination<F>>(`[${module}] Load Page`),
  noPageToLoad: createActionWithPayload<F>(`[${module}] No Page To Load`),
  fetchPageData: createActionWithPayload<number>(`[${module}] Fetch Page Data`),
  pageDataFetched: createActionWithPayload<PaginationData<T, F>>(`[${module}] Page Data Fetched`),
  pageDataFetchFailed: createActionWithPayload<DefaultResponse>(`[${module}] Page Data Fetch Failed`),
  resetPagination: createActionWithPayload<F>(`[${module}] Reset Pagination`),
});

export const outerPaginationReducers = <T, F extends Filters, S extends OuterPaginationState<T, F> = OuterPaginationState<T, F>>(
  actions: OuterPaginationActions<T, F>,
  paginationActions: PaginationActions<F>,
  paginationReducer: PaginationReducer<F>,
  entityAdapter: EntityAdapter<T>,
  upsert = true
) => [
  on<S, [typeof actions.loadPage]>(
    actions.loadPage,
    (state, { payload }) => ({
      ...state,
      pagination: paginationReducer(
        state.pagination,
        injectPayload(paginationActions.paginationLoaded)(payload)
      )
    })
  ),
  on<S, [typeof actions.pageDataFetched]>(
    actions.pageDataFetched,
    (state, { payload }) => ({
      ...(() => {
        if (!upsert) {
          return state;
        }

        return entityAdapter.upsertMany(payload.data, state);
      })(),
      pagination: paginationReducer(
        state.pagination,
        injectPayload(paginationActions.paginationLoaded)(payload.pagination)
      )
    })
  ),
  on<S, [typeof actions.resetPagination]>(
    actions.resetPagination,
    (state, { payload }) => ({
      ...state,
      pagination: paginationReducer(
        state.pagination,
        injectPayload(paginationActions.resetPagination)(payload)
      )
    })
  ),
];
