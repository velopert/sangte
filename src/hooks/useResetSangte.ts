import { Sangte } from '../lib/sangte'
import { useSangteStore } from './useSangteStore'

export function useResetSangte<T>(sangte: Sangte<T>) {
  const store = useSangteStore(sangte)
  return store.reset
}
