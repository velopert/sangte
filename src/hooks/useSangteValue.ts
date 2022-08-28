import { useSyncExternalStore } from 'use-sync-external-store/shim'
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector'
import { Sangte } from '../lib/sangte'
import { shallowEqual } from '../lib/shallowEqual'
import { useSangteStore } from './useSangteStore'

export function useSangteValue<T>(sangte: Sangte<T>): T
export function useSangteValue<T, S>(sangte: Sangte<T>, selector: (state: T) => S): S

export function useSangteValue<T, S>(
  sangte: Sangte<T>,
  selector?: (state: T) => S,
  compare?: (a: S, b: S) => boolean
) {
  const store = useSangteStore(sangte)
  if (!selector) {
    const state = useSyncExternalStore(store.subscribe, store.getState)
    return state
  }
  const state = useSyncExternalStoreWithSelector(
    store.subscribe,
    store.getState,
    store.getState,
    selector,
    compare ?? shallowEqual
  )
  return state
}
