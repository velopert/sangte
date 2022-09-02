import { useCallback } from 'react'
import { useSangteManager } from '../contexts'

/**
 * Resets every sangte registered to the current SangteProvider.
 */
export function useResetAllSangte() {
  const sangteManager = useSangteManager()
  return useCallback((global?: boolean) => sangteManager.reset(global), [sangteManager])
}
