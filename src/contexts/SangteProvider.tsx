import { createContext, useContext, useEffect, useRef } from 'react'
import { Sangte } from '../lib/sangte'
import { SangteInitializer } from '../lib/SangteInitializer'
import { SangteManager } from '../lib/SangteManager'

const SangteContext = createContext<SangteManager | null>(null)

interface SangteProviderProps {
  children: React.ReactNode
  inheritSangtes?: Sangte<any>[]
  initialize?: (initializer: SangteInitializer) => void
  dehydratedState?: Record<string, any>
}

export function SangteProvider({
  children,
  inheritSangtes,
  initialize,
  dehydratedState,
}: SangteProviderProps) {
  const parent = useContext(SangteContext)
  const manager = useRef(new SangteManager()).current
  const initialized = useRef(false)

  if (!initialized.current) {
    if (!parent?.isDefault) {
      manager.parent = parent
    }
    manager.dehydratedState = dehydratedState
    if (inheritSangtes) {
      if (parent?.isDefault) {
        throw new Error(
          'Cannot inherit sangtes from default SangteManager. Please wrap your app with SangteProvider.'
        )
      }
      manager.inherit(inheritSangtes)
    }
    if (initialize) {
      initialize(manager.initializer)
      manager.initializer.initialize()
    }
    initialized.current = true
  }

  return <SangteContext.Provider value={manager}>{children}</SangteContext.Provider>
}

/**
 * Default manager used when SangteProvider is not used.
 * To
 */
const defaultManager = new SangteManager(true)

export function useSangteManager() {
  const manager = useContext(SangteContext)
  if (!manager) {
    return defaultManager
  }
  return manager
}
