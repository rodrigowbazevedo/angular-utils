import { ActionCreator, createAction, props } from '@ngrx/store';

import { Payload, ActionWithPayload, ActionCreatorWithPayloadAndInjector } from './model';

export const injectPayload = <
  U extends ActionCreator = ActionCreator
>(actionCreator: U) => <
  T extends Parameters<U>[0]['payload'] = Parameters<U>[0]['payload']
>(payload: T) => actionCreator({ payload }) as ActionWithPayload<T, typeof actionCreator.type>;

export const createActionWithPayload = <T, U extends string = string>(type: U) => {
  const actionCreator = createAction(
    type,
    props<Payload<T>>()
  );

  const injector = injectPayload(actionCreator);

  Object.defineProperty(actionCreator, 'make', {
    writable: false,
    value: injector
  });

  return actionCreator as ActionCreatorWithPayloadAndInjector<T, U>;
};

export const actionWithResponse = <T, U, F>(module: string, action: string) => ({
  trigger: createActionWithPayload<T>(`[${module}] ${action}`),
  success: createActionWithPayload<U>(`[${module}] ${action} Succeeded`),
  failed: createActionWithPayload<F>(`[${module}] ${action} Failed`),
});
