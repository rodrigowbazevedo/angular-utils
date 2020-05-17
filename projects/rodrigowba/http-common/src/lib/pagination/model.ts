import { ResponseDataList } from '../response';

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
    constructor(public per_page = 1) {}
}

export interface PaginationDataResponse<T> extends ResponseDataList<T>, PaginationMetadata {
}

export interface PaginationResourceResponse<T> extends ResponseDataList<T> {
    meta: PaginationMetadata;
}

export interface PaginationData<T, U> {
    pagination: Pagination<U>;
    data: T[];
}
