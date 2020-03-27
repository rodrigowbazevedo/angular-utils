import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Observable, of } from 'rxjs';
import { filter, map, switchMap, distinctUntilChanged } from 'rxjs/operators';
import * as hash from 'json-hash';

import {
    Pagination,
    Filters,
    PaginationDataResponse,
    InitialPaginationMetadata,
    PaginationData,
    PaginationMetadata
} from './model';
import { PaginationActions, PaginationActionTypes } from './actions';

export interface PaginationState<T> extends EntityState<Pagination<T>> {
}

export const getFiltersHash = <T extends Filters>(filters: T): string => {
    return hash.digest(filters);
};

/* const paginationAdapter: EntityAdapter<Pagination<Filters>> = createEntityAdapter<Pagination<Filters>>({
    selectId: (pagination: Pagination<Filters>) => getFiltersHash(pagination.filters)
}); */

// const paginationInitialState: PaginationState<Filters> = paginationAdapter.getInitialState();

export const selectPagination = <T extends Filters>(filters: T) => {
    const pageHash  = getFiltersHash(filters);

    return (state: PaginationState<T>): Pagination<T> => {
        return state.entities[pageHash] || {
            filters,
            metadata: new InitialPaginationMetadata(),
            ids: []
        };
    };
};

export const paginationInitialState = <T extends Filters>() => {
    const paginationAdapter: EntityAdapter<Pagination<T>> = createEntityAdapter<Pagination<T>>({
        selectId: (pagination: Pagination<T>) => getFiltersHash(pagination.filters)
    });

    return paginationAdapter.getInitialState();
};

export const resetPagination = <T extends Filters>(filters: T) => {
    return (state: PaginationState<T>): Pagination<T> => {
        const pagination = selectPagination(filters)(state);

        return {
            ...pagination,
            metadata: {
                ...(new InitialPaginationMetadata()),
                ...pagination.metadata,
                current_page: 0
            },
        };
    };
};

export const upsertPagination = <T extends Filters>(pagination: Pagination<T>) => {
    const { filters, metadata, ids } = pagination;

    return (state: PaginationState<T>): Pagination<T> => {

        const currentPagination = selectPagination(filters)(state);

        const newMeta: PaginationMetadata = {
            ...metadata,
        };

        if (currentPagination.metadata.current_page > newMeta.current_page) {
            newMeta.current_page = currentPagination.metadata.current_page;
        }

        const newIds = new Array(newMeta.total);
        newIds.splice(0, currentPagination.ids.length, ...currentPagination.ids);
        newIds.splice((metadata.current_page - 1) * metadata.per_page, metadata.per_page, ...ids);

        return {
            filters,
            metadata: newMeta,
            ids: newIds
        };
    };
};

export function paginationReducer<T extends Filters>() {
    const paginationAdapter: EntityAdapter<Pagination<T>> = createEntityAdapter<Pagination<T>>({
        selectId: (pagination: Pagination<T>) => getFiltersHash(pagination.filters)
    });

    const initialState = paginationAdapter.getInitialState();

    return (
        state: PaginationState<T> = initialState,
        action: PaginationActions | null = null
    ): PaginationState<T> => {
        if (action === null) {
            return state;
        }

        switch (action.type) {
            case PaginationActionTypes.LoadPagination:
                return paginationAdapter.upsertOne(action.payload, state);
            case PaginationActionTypes.PaginationLoaded:
                return paginationAdapter.upsertOne(
                        upsertPagination<T>(action.payload)(state),
                        state
                    );
            case PaginationActionTypes.ResetPagination:
                return paginationAdapter.upsertOne(
                        resetPagination<T>(action.payload)(state),
                        state
                    );
            default:
                return state;
        }
    };
}

/* export function paginationReducer<T extends Filters>(
    state: PaginationState<T>,
    action: PaginationActions | null = null
): PaginationState<T> {
    if (action === null) {
        return state;
    }

    switch (action.type) {
        case PaginationActionTypes.LoadPagination:
            return paginationAdapter.upsertOne(action.payload, state);
        case PaginationActionTypes.PaginationLoaded:
            return paginationAdapter.upsertOne(
                    upsertPagination(action.payload)(state),
                    state
                );
        case PaginationActionTypes.ResetPagination:
            return paginationAdapter.upsertOne(
                    resetPagination(action.payload)(state),
                    state
                );
        default:
            return state;
    }
} */


export const getLastPageLoaded = <T extends Filters>(pagination: Pagination<T>): number => {
    return pagination.metadata.current_page;
};

export const getNextPage = <T extends Filters>(pagination: Pagination<T>): number | null => {
    if (pagination.metadata === null || pagination.metadata.total === 0) {
        return 1;
    }

    if (getLastPageLoaded(pagination) === pagination.metadata.last_page || pagination.metadata.last_page === 0) {
        return null;
    }

    return getLastPageLoaded(pagination) + 1;
};

export const toLoadPagination = <T extends Filters>(pagination: Pagination<T>): Pagination<T> | null => {
    const nextPage = getNextPage(pagination);

    if (nextPage === null) {
        return null;
    }

    return {
        ...pagination,
        metadata: {
            ...pagination.metadata,
            current_page: nextPage
        }
    } as Pagination<T>;
};

export const getPaginationLoadedItens = <T extends Filters>(pagination: Pagination<T>): number => {
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

export const getPaginationIds = <T extends Filters>(pagination: Pagination<T>): Array<string | number> => {
    return pagination.ids.slice(0, getPaginationLoadedItens(pagination)).filter(id => typeof id !== 'undefined');
};

export const paginationResponseFromPageResponse = <T extends object, U extends Filters>(
    pageResponse: PaginationDataResponse<T>,
    filters: U,
// tslint:disable-next-line: no-string-literal
    selectId = (entity: T) => entity['id']
): PaginationData<T, U> => {
    const { data, ...metadata } = pageResponse;

    return {
        pagination: {
            filters,
            metadata: metadata as PaginationMetadata,
            ids: data.map(selectId)
        },
        data
    };
};

export const isInitialPagination = <T extends Filters>() => (source: Observable<Pagination<T>>): Observable<T> => source.pipe(
    filter((pagination: Pagination<T>) => {
        if (pagination.metadata === null) {
            return true;
        }

        return pagination.metadata.current_page === 0;
    }),
    map(pagination => pagination.filters as T)
);

// tslint:disable-next-line: max-line-length
export const filterPaginationScrollPosition = <T extends Filters>(index: number) => (source: Observable<Pagination<T>>): Observable<T> => source.pipe(
    switchMap((pagination: Pagination<T>) => of({}).pipe(
        map(() => Math.ceil(index / pagination.metadata.per_page)),
        filter(page => page <= pagination.metadata.last_page),
        filter(page => page >= pagination.metadata.current_page),
        distinctUntilChanged(),
        map(() => {
            const div = index % pagination.metadata.per_page;

            return (div >= pagination.metadata.per_page * 0.3);
        }),
        distinctUntilChanged(),
        filter(limit => limit),
        map(() => pagination.filters as T),
    )),
);
