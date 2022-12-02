import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { filter, map, switchMap, distinctUntilChanged } from 'rxjs/operators';
import * as hash from 'json-hash';

import {
  Pagination,
  Filters,
  PaginationDataResponse,
  PaginationResourceResponse,
  InitialPaginationMetadata,
  PaginationData,
  PaginationMetadata,
  PaginationState,
} from './model';
import { paginationActions } from './actions';


export const getFiltersHash = <T extends Filters>(filters: T): string => {
  return hash.digest(filters);
};

export const selectPagination = <T extends Filters, U extends Pagination<T> = Pagination<T>>(filters: T) => {
  const pageHash = getFiltersHash(filters);
  const perPage = filters?.perPage || 1;

  return (state: PaginationState<T, U>): U => {
    return state.entities[pageHash] || {
      filters,
      metadata: new InitialPaginationMetadata(perPage),
      ids: []
    } as U;
  };
};

export const paginationInitialState = <T extends Filters, U extends Pagination<T> = Pagination<T>>() => {
  const paginationAdapter: EntityAdapter<U> = createEntityAdapter<U>({
    selectId: (pagination: U) => getFiltersHash(pagination.filters)
  });

  return paginationAdapter.getInitialState();
};

export const resetPagination = <T extends Filters, U extends Pagination<T> = Pagination<T>>(filters: T) => {
  const perPage = filters?.perPage || 1;

  return (state: PaginationState<T, U>): U => {
    const pagination = selectPagination<T, U>(filters)(state);

    return {
      ...pagination,
      metadata: {
        ...(new InitialPaginationMetadata(perPage)),
        ...pagination.metadata,
        current_page: 0
      },
    };
  };
};

export const upsertPagination = <T extends Filters, U extends Pagination<T> = Pagination<T>>(pagination: U) => {
  const { filters, metadata, ids } = pagination;

  return (state: PaginationState<T, U>): U => {

    const currentPagination = selectPagination<T, U>(filters)(state);

    const newMeta: PaginationMetadata = {
      ...metadata,
    };

    if (currentPagination.metadata.current_page > newMeta.current_page) {
      newMeta.current_page = currentPagination.metadata.current_page;
    }

    const newIds = new Array(newMeta.total);
    newIds.splice(0, currentPagination.ids.length, ...currentPagination.ids);

    if (ids.length > 0) {
      newIds.splice((metadata.current_page - 1) * metadata.per_page, ids.length, ...ids);
    }

    return {
      ...pagination,
      metadata: newMeta,
      ids: newIds
    };
  };
};

export function paginationStore<T extends Filters, U extends Pagination<T> = Pagination<T>>() {
  const paginationAdapter: EntityAdapter<U> = createEntityAdapter<U>({
    selectId: (pagination: U) => getFiltersHash(pagination.filters)
  });

  const initialState = paginationAdapter.getInitialState() as PaginationState<T, U>;

  const actions = paginationActions<T, U>();

  const reducer = createReducer(
    initialState,
    on(
      actions.loadPagination,
      (state, { payload }) => paginationAdapter.upsertOne(payload, state)
    ),
    on(
      actions.paginationLoaded,
      (state, { payload }) => paginationAdapter.upsertOne(
        upsertPagination<T, U>(payload)(state),
        state
      )
    ),
    on(
      actions.resetPagination,
      (state, { payload }) => paginationAdapter.upsertOne(
        resetPagination<T, U>(payload)(state),
        state
      )
    ),
  );

  return {
    reducer,
    actions,
    initialState,
  };
}

export const getLastPageLoaded = <T extends Filters, U extends Pagination<T> = Pagination<T>>(pagination: U): number => {
  return pagination.metadata.current_page;
};

export const getNextPage = <T extends Filters, U extends Pagination<T> = Pagination<T>>(pagination: U): number | null => {
  if (pagination.metadata === null || pagination.metadata.total === 0) {
    return 1;
  }

  if (getLastPageLoaded<T, U>(pagination) === pagination.metadata.last_page || pagination.metadata.last_page === 0) {
    return null;
  }

  return getLastPageLoaded<T, U>(pagination) + 1;
};

export const toLoadPagination = <T extends Filters, U extends Pagination<T> = Pagination<T>>(pagination: U): U | null => {
  const nextPage = getNextPage<T, U>(pagination);

  if (nextPage === null) {
    return null;
  }

  return {
    ...pagination,
    ids: [],
    metadata: {
      ...pagination.metadata,
      current_page: nextPage
    }
  };
};

export const getPaginationLoadedItens = <T extends Filters, U extends Pagination<T> = Pagination<T>>(pagination: U): number => {
  const { metadata } = pagination;

  if (metadata === null) {
    return 0;
  }

  if (metadata.current_page === metadata.last_page) {
    return metadata.total;
  }

  if (metadata.current_page === 0) {
    return metadata.per_page;
  }

  return metadata.per_page * metadata.current_page;
};

export const getPaginationIds = <T extends Filters, U extends Pagination<T> = Pagination<T>>(pagination: U): Array<string | number> => {
  return pagination.ids.slice(0, getPaginationLoadedItens(pagination)).filter(
    id => typeof id !== 'undefined' && id !== null
  );
};

export const paginationResponseFromPageResponse = <
  K extends object,
  T extends Filters,
  U extends Pagination<T> = Pagination<T>,
  Z extends PaginationDataResponse<K> = PaginationDataResponse<K>
>(
  pageResponse: Z,
  filters: T,
  // tslint:disable-next-line: no-string-literal
  selectId = (entity: K) => entity['id'],
  reducePagination = (pagination: Pagination<T>, response: Z): U => ({ ...pagination }) as U
): PaginationData<K, T, U> => {
  const { data, ...metadata } = pageResponse;

  return {
    pagination: reducePagination({
      filters,
      metadata: metadata as PaginationMetadata,
      ids: data.map(selectId)
    }, pageResponse),
    data
  };
};

export const paginationResponseFromResourceResponse = <
  K extends object,
  T extends Filters,
  U extends Pagination<T> = Pagination<T>,
  Z extends PaginationResourceResponse<K> = PaginationResourceResponse<K>
>(
  pageResponse: Z,
  filters: T,
  // tslint:disable-next-line: no-string-literal
  selectId = (entity: K) => entity['id'],
  reducePagination = (pagination: Pagination<T>, response: Z): U => ({ ...pagination }) as U
): PaginationData<K, T, U> => {
  const { data, meta } = pageResponse;

  return {
    pagination: reducePagination({
      filters,
      metadata: meta,
      ids: data.map(selectId)
    }, pageResponse),
    data
  };
};

export const isInitialPagination = <T extends Filters, U extends Pagination<T> = Pagination<T>>() => (
  source: Observable<U>
): Observable<T> => source.pipe(
  filter((pagination: U) => {
    if (pagination.metadata === null) {
      return true;
    }

    return pagination.metadata.current_page === 0;
  }),
  map(pagination => pagination.filters)
);

export const filterPaginationScrollPosition = <T extends Filters, U extends Pagination<T> = Pagination<T>>(
  index: number,
  margin = 0.3
) => (
  source: Observable<U>
): Observable<T> => source.pipe(
  switchMap((pagination: U) => of({}).pipe(
    map(() => Math.ceil(index / pagination.metadata.per_page)),
    filter(page => page <= pagination.metadata.last_page),
    filter(page => page >= pagination.metadata.current_page),
    distinctUntilChanged(),
    map(() => {
      const div = index % pagination.metadata.per_page;

      return (div >= pagination.metadata.per_page * margin);
    }),
    distinctUntilChanged(),
    filter(limit => limit),
    map(() => pagination.filters),
  )),
);
