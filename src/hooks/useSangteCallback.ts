import { DependencyList, useCallback } from 'react'
import { useSangteManager } from '../contexts/SangteProvider'
import { ActionRecord, Sangte } from '../lib/sangte'

interface SanteCallbackParams {
  get: <T>(sangte: Sangte<T>) => T
  set: <T>(sangte: Sangte<T>, value: T) => void
  actions: <T, A extends ActionRecord<T>>(sangte: Sangte<T, A>) => A
}

export function useSangteCallback(
  callback: (params: SanteCallbackParams) => void,
  deps: DependencyList
) {
  const sangteManager = useSangteManager()

  return useCallback(() => {
    callback({
      get: (sangte) => sangteManager.get(sangte).getState(),
      set: (sangte, value) => sangteManager.get(sangte).setState(value),
      actions: <T, A extends ActionRecord<T>>(sangte: Sangte<T, A>) => {
        const actions = sangteManager.get(sangte).actions
        if (!actions) throw new Error('This sangte does not have createActions')

        return actions
      },
    })
  }, [...deps, sangteManager])
}
