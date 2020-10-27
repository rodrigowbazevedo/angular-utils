import { createAction, props } from '@ngrx/store';
import { Pagination, Filters } from './model';


export const paginationActions = <T extends Filters, U extends Pagination<T> = Pagination<T>>() => {
    const loadPaginationAction = createAction(
        '[Pagination] Load Pagination',
        props<{ payload: U }>()
    );

    const paginationLoadedAction = createAction(
        '[Pagination] Pagination Loaded',
        props<{ payload: U }>()
    );

    const resetPaginationAction = createAction(
        '[Pagination] Reset Pagination',
        props<{ payload: T }>()
    );

    return {
        loadPaginationAction,
        paginationLoadedAction,
        resetPaginationAction
    };
};
