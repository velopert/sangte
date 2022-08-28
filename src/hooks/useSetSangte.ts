import { useSangteManager } from '../contexts/SangteProvider'
import { Sangte } from '../lib/sangte'
import { useSangteStore } from './useSangteStore'

export function useSetSangte<T>(sangte: Sangte<T>) {
  const store = useSangteStore(sangte)
  return store.setState
}
