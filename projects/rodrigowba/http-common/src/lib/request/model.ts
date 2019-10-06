
export interface FilteredRequest<T> {
    filters: T;
}

export interface PaginationRequestParams {
    page?: number;
    perPage?: number;
    orderBy?: string;
    order?: 'ASC' | `DESC`;
}

export interface FilteredPaginationRequest<T> extends FilteredRequest<T> {
    pagination: PaginationRequestParams;
}

