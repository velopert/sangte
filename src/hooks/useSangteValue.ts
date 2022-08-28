import { useSyncExternalStore } from 'use-sync-external-store/shim'
import { Sangte } from '../lib/sangte'
import { useSangteStore } from './useSangteStore'

export function useSangteValue<T, S = T>(
  sangte: Sangte<T>,
  selector: (state: T) => S = (state: T) => state as any
) {
  const store = useSangteStore(sangte)
  const state = useSyncExternalStore(store.subscribe, () => selector(store.getState()))
  return state
}
