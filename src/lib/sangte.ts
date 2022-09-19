import produce, { Draft, isDraftable } from 'immer'
import { SangteManager } from './SangteManager'

type Fn = () => void
type UpdateFn<T> = (state: T) => T
export type ActionRecord<T> = Record<string, (...params: any[]) => T | Draft<T> | void>
type Action<T, A> = A extends ActionRecord<T> ? A : never
export type Actions<T, A> = (prevState: Draft<T> | T) => Action<T, A>
export interface SangteConfig {
  key?: string
  global?: boolean
  isResangte?: boolean
}

export type Getter = {
  <T>(sangte: Sangte<T>): T
}

export type SangteInstance<T, A> = {
  initialState: T
  getState: () => T
  setState: (update: UpdateFn<T> | T) => void
  subscribe: (callback: Fn) => Fn
  actions: Action<T, A> | null
  reset: () => void
}
export type Sangte<T, A = any> = {
  (manager?: SangteManager): SangteInstance<T, A>
  config: SangteConfig
}

export type UnwrapSangteValue<T> = T extends Sangte<infer U> ? U : never
export type UnwrapSangteAction<T> = T extends Sangte<any, infer U> ? U : never

type Selector<T> = (get: Getter) => T
function isSelector<T>(fn: any): fn is Selector<T> {
  return typeof fn === 'function'
}

function isUpdateFn<T>(value: any): value is UpdateFn<T> {
  return typeof value === 'function'
}

function createSangte<T, A>(initialState: T, createActions?: Actions<T, A>): SangteInstance<T, A> {
  let state = initialState
  const callbacks = new Set<Fn>()

  function getState() {
    return state
  }

  function setState(update: UpdateFn<T> | T) {
    if (isUpdateFn<T>(update)) {
      state = update(state)
    } else {
      state = update
    }
    callbacks.forEach((cb) => cb())
  }

  function subscribe(callback: Fn): Fn {
    callbacks.add(callback)
    return () => callbacks.delete(callback)
  }

  function reset() {
    setState(initialState)
  }

  const actions = (() => {
    if (!createActions) return null
    type ActionKey = keyof Action<T, A>
    const record = createActions(initialState)
    const keys = Object.keys(record) as ActionKey[]
    keys.forEach((key) => {
      record[key] = ((...params: any[]) => {
        setState((prevState) => {
          if (!isDraftable(prevState)) {
            const action = createActions(prevState)[key]
            const next = action(...params)
            return next as any
          }
          const produced = produce(prevState, (draft) => {
            const action = createActions(draft)[key]
            const result = action(...params)
            if (result !== undefined) {
              return result as Draft<T>
            }
          })
          return produced
        })
      }) as Action<T, A>[ActionKey]
    })
    return record
  })()

  return {
    initialState,
    getState,
    setState,
    subscribe,
    actions,
    reset,
  }
}

export function sangte<T>(selector: (get: Getter) => T): Sangte<T>
export function sangte<T>(initialState: T): Sangte<T>
export function sangte<T, A>(initialState: T, config?: SangteConfig): Sangte<T, A>
export function sangte<T, A>(
  initialState: T,
  actions: Actions<T, A>,
  config?: SangteConfig
): Sangte<T, A>
export function sangte<T, A>(
  selectorOrInitialState: T | ((get: Getter) => T),
  actionsOrConfig?: Actions<T, A> | SangteConfig,
  config?: SangteConfig
) {
  if (isSelector(selectorOrInitialState)) {
    return resangte(selectorOrInitialState)
  }

  const hasActions = typeof actionsOrConfig === 'function'
  const sangte = function () {
    if (hasActions) {
      return createSangte(selectorOrInitialState, actionsOrConfig)
    }
    return createSangte(selectorOrInitialState)
  }
  if (hasActions) {
    sangte.config = config || {}
  } else {
    sangte.config = actionsOrConfig || {}
  }

  return sangte
}

function createResangte<T>(
  selector: (getter: Getter) => T,
  sangteManager: SangteManager
): SangteInstance<T, any> {
  let unmounted = false
  const sangteDeps = new Set<Sangte<any, any>>()
  const subscriptions = new Set<() => void>()
  const getter: Getter = (sangte) => {
    if (!sangteDeps.has(sangte)) {
      sangteDeps.add(sangte)
    }
    return sangteManager.get(sangte).getState()
  }
  let state = selector(getter)
  const callbacks = new Set<Fn>()
  const getState = () => {
    if (unmounted) {
      unmounted = false
      state = selector(getter)
    }
    return state
  }

  const update = () => {
    state = selector(getter)
    callbacks.forEach((cb) => cb())
  }

  const subscribe = (callback: Fn) => {
    if (callbacks.size === 0) {
      sangteDeps.forEach((sangte) => {
        const unsubscribe = sangteManager.get(sangte).subscribe(update)
        subscriptions.add(unsubscribe)
      })
    }
    callbacks.add(callback)
    return () => {
      callbacks.delete(callback)
      if (callbacks.size === 0) {
        subscriptions.forEach((unsubscribe) => unsubscribe())
        subscriptions.clear()
        unmounted = true
      }
    }
  }

  const setState = () => {
    console.warn('setState is not supported in resangte')
  }

  const reset = () => {
    console.warn('reset is not supported in resangte')
  }

  return {
    initialState: state,
    actions: null,
    getState,
    subscribe,
    setState,
    reset,
  }
}

export function resangte<T>(selector: (getter: Getter) => T): Sangte<T> {
  const resangte = function (sangteManager?: SangteManager) {
    if (!sangteManager) {
      throw new Error('Cannot create resangte without a manager')
    }
    return createResangte(selector, sangteManager)
  }
  resangte.config = {
    isResangte: true,
  }

  return resangte
}
