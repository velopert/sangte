import { Actions, Getter, resangte, sangte, Sangte, SangteConfig } from './sangte'

type Selector<T> = (get: Getter) => T
function isSelector<T>(fn: any): fn is Selector<T> {
  return typeof fn === 'function'
}

export function atom<T>(selector: (get: Getter) => T): Sangte<T>
export function atom<T, A>(initialState: T, config?: SangteConfig): Sangte<T, A>
export function atom<T, A>(
  initialState: T,
  actions: Actions<T, A>,
  config?: SangteConfig
): Sangte<T, A>
export function atom<T, A>(
  selectorOrInitialState: T | ((get: Getter) => T),
  actionsOrConfig?: Actions<T, A> | SangteConfig,
  config?: SangteConfig
) {
  if (isSelector(selectorOrInitialState)) {
    return resangte(selectorOrInitialState)
  }
  if (typeof actionsOrConfig === 'function') {
    return sangte(selectorOrInitialState, actionsOrConfig, config)
  }
  return sangte(selectorOrInitialState, actionsOrConfig)
}
