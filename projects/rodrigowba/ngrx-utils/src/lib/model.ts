import { ActionCreator, TypedAction } from '@ngrx/store/src/models';

export interface Payload<T = any> {
  payload: T;
}

export type ActionWithPayload<T, U extends string = string> = Payload<T> & TypedAction<U>;

export type ActionCreatorWithPayload<T, U extends string = string> = ActionCreator<U, (props: Payload<T>) => ActionWithPayload<T, U>>;

export type ActionCreatorWithPayloadAndInjector<T, U extends string = string> = ActionCreatorWithPayload<T, U> & {
  make: (value?: T) => ActionWithPayload<T, U>;
};
