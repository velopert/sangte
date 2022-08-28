import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/shim/with-selector'
import { Sangte } from '../lib/sangte'
import { shallowEqual } from '../lib/shallowEqual'
import { useSangteStore } from './useSangteStore'

export function useSangteSelector<T, S>(
  sangte: Sangte<T>,
  selector: (state: T) => S,
  compare: (a: S, b: S) => boolean = shallowEqual
) {
  const store = useSangteStore(sangte)
  const state = useSyncExternalStoreWithSelector(
    store.subscribe,
    store.getState,
    store.getState,
    selector,
    compare
  )
  return state
}
