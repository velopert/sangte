import { useSangteManager } from '../contexts/SangteProvider'
import { Sangte } from '../lib/sangte'

export function useSangteStore<T, A>(sangte: Sangte<T, A>) {
  const sangteManager = useSangteManager()
  const store = sangteManager.get(sangte)
  return store
}
