import { EntityState } from '@ngrx/entity';
import { Action, ActionReducer } from '@ngrx/store/src/models';

import { ActionCreatorWithPayloadAndInjector, ActionCreatorWithPayload } from '@rodrigowba/ngrx-utils';

import { DefaultResponse, ResponseDataList } from '../response/model';

export interface PaginationMetadata {
  current_page: number;
  from: number;
  to: number;
  total: number;
  last_page: number;
  per_page: number;
}

export interface Filters {
  perPage?: number;
  orderBy?: string;
  order?: 'ASC' | `DESC`;
}

export interface Pagination<T extends Filters> {
  filters: T;
  metadata: PaginationMetadata | null;
  ids: Array<string | number>;
}

export class InitialPaginationMetadata implements PaginationMetadata {
  // tslint:disable-next-line: variable-name
  public current_page = 0;
  // tslint:disable-next-line: variable-name
  public last_page = 1;
  public total = 0;

  public from = 0;
  public to = 1;

  // tslint:disable-next-line: variable-name
  constructor(public per_page = 1) { }
}

export interface PaginationDataResponse<T> extends ResponseDataList<T>, PaginationMetadata {
}

export interface PaginationResourceResponse<T> extends ResponseDataList<T> {
  meta: PaginationMetadata;
}

export interface PaginationData<T, U, K extends Pagination<U> = Pagination<U>> {
  pagination: K;
  data: T[];
}

export interface PaginationState<T, U extends Pagination<T> = Pagination<T>> extends EntityState<U> {
}

export interface OuterPaginationState<T, F extends Filters> extends EntityState<T> {
  pagination: PaginationState<F>;
}

export interface OuterPaginationActions<T, F extends Filters> {
  loadNextPage: ActionCreatorWithPayloadAndInjector<F>;
  loadPage: ActionCreatorWithPayloadAndInjector<Pagination<F>>;
  noPageToLoad: ActionCreatorWithPayloadAndInjector<F>;
  fetchPageData: ActionCreatorWithPayloadAndInjector<number>;
  pageDataFetched: ActionCreatorWithPayloadAndInjector<PaginationData<T, F, Pagination<F>>>;
  pageDataFetchFailed: ActionCreatorWithPayloadAndInjector<DefaultResponse>;
  resetPagination: ActionCreatorWithPayloadAndInjector<F>;
}

export interface PaginationActions<F extends Filters, U extends Pagination<F> = Pagination<F>> {
  loadPagination: ActionCreatorWithPayload<U>;
  paginationLoaded: ActionCreatorWithPayload<U>;
  resetPagination: ActionCreatorWithPayload<F>;
}

export type PaginationReducer<F extends Filters> = ActionReducer<PaginationState<F, Pagination<F>>, Action>;
