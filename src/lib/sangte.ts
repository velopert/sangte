import produce, { Draft, isDraftable } from 'immer'

type Fn = () => void
type UpdateFn<T> = (state: T) => T
export type ActionRecord<T> = Record<string, (...params: any[]) => T | Draft<T> | void>
type Action<T, A> = A extends ActionRecord<T> ? A : never
type Actions<T, A> = (prevState: Draft<T> | T) => Action<T, A>
interface SangteConfig {
  key?: string
  global?: boolean
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
  (): SangteInstance<T, A>
  config: SangteConfig
}

export type UnwrapSangteValue<T> = T extends Sangte<infer U> ? U : never

export type UnwrapSangteAction<T> = T extends Sangte<any, infer U> ? U : never

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

export function sangte<T, A>(initialState: T, config?: SangteConfig): Sangte<T, A>
export function sangte<T, A>(
  initialState: T,
  actions: Actions<T, A>,
  config?: SangteConfig
): Sangte<T, A>
export function sangte<T, A>(
  initialState: T,
  actions?: Actions<T, A> | SangteConfig,
  config?: SangteConfig
) {
  const hasActions = typeof actions === 'function'
  const sangte = function () {
    if (hasActions) {
      return createSangte(initialState, actions)
    }
    return createSangte(initialState)
  }
  if (hasActions) {
    sangte.config = config || {}
  } else {
    sangte.config = actions || {}
  }

  return sangte
}
