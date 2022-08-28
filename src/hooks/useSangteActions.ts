import { ActionRecord, Sangte } from '../lib/sangte'
import { useSangteStore } from './useSangteStore'

export function useSangteActions<T, A extends ActionRecord<T>>(sangte: Sangte<T, A>) {
  const store = useSangteStore(sangte)

  if (!store.actions) {
    throw new Error('This sangte does not have createActions')
  }

  return store.actions
}
