import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
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

export interface PaginationState extends EntityState<Pagination> {
}

export const getFiltersHash = <T extends Filters>(filters: T): string => {
    return hash.digest(filters);
};

const paginationAdapter: EntityAdapter<Pagination> = createEntityAdapter<Pagination>({
    selectId: (pagination: Pagination) => getFiltersHash(pagination.filters)
});

const paginationInitialState: PaginationState = paginationAdapter.getInitialState();

export const selectPagination = <T extends Filters>(filters: T) => {
    const pageHash  = getFiltersHash(filters);

    return (state: PaginationState): Pagination => {
        return state.entities[pageHash] || {
            filters,
            metadata: new InitialPaginationMetadata(),
            ids: []
        };
    };
};

export const resetPagination = <T extends Filters>(filters: T) => {
    return (state: PaginationState): Pagination => {
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

export const upsertPagination = (pagination: Pagination) => {
    const { filters, metadata, ids } = pagination;

    return (state: PaginationState): Pagination => {

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

export function paginationReducer(
    state: PaginationState = paginationInitialState,
    action: PaginationActions | null = null
): PaginationState {
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
}


export const getLastPageLoaded = (pagination: Pagination): number => {
    return pagination.metadata.current_page;
};

export const getNextPage = (pagination: Pagination): number | null => {
    if (pagination.metadata === null || pagination.metadata.total === 0) {
        return 1;
    }

    if (getLastPageLoaded(pagination) === pagination.metadata.last_page || pagination.metadata.last_page === 0) {
        return null;
    }

    return getLastPageLoaded(pagination) + 1;
};

export const toLoadPagination = (pagination: Pagination): Pagination | null => {
    const nextPage = getNextPage(pagination);

    if (nextPage === null) {
        return null;
    }

    return {
        ...pagination,
        meta: {
            ...pagination.metadata,
            page: nextPage
        }
    } as Pagination;
};

export const getPaginationLoadedItens = (pagination: Pagination): number => {
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

export const getPaginationIds = (pagination: Pagination): Array<string | number> => {
    return pagination.ids.slice(0, getPaginationLoadedItens(pagination)).filter(id => typeof id !== 'undefined');
};

export const paginationResponseFromPageResponse = <T extends object, O extends Filters>(
    pageResponse: PaginationDataResponse<T>,
    filters: O,
// tslint:disable-next-line: no-string-literal
    selectId = (entity: T) => entity['id']
): PaginationData<T> => {
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
