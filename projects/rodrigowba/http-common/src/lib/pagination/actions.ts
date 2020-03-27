import { Action } from '@ngrx/store';
import { Pagination, Filters } from './model';

export enum PaginationActionTypes {
    LoadPagination = '[Pagination] Load Pagination',
    PaginationLoaded = '[Pagination] Pagination Loaded',
    ResetPagination = '[Pagination] Reset Pagination',
}

export class LoadPagination implements Action {
    readonly type = PaginationActionTypes.LoadPagination;
    constructor(public payload: Pagination<Filters>) {}
}

export class PaginationLoaded implements Action {
    readonly type = PaginationActionTypes.PaginationLoaded;
    constructor(public payload: Pagination<Filters>) {}
}

export class ResetPagination implements Action {
    readonly type = PaginationActionTypes.ResetPagination;
    constructor(public payload: Filters) {}
}

export type PaginationActions = LoadPagination
    | PaginationLoaded
    | ResetPagination
;
