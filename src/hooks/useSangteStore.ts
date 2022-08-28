import { useSangteManager } from '../contexts/SangteProvider'
import { ActionRecord, Sangte } from '../lib/sangte'

export function useSangteStore<T, A extends ActionRecord<T>>(sangte: Sangte<T, A>) {
  const sangteManager = useSangteManager()
  const store = sangteManager.get(sangte)
  return store
}
