import { createContext, useCallback, useContext, useEffect, useRef } from 'react'
import { Sangte } from '../lib/sangte'
import { SangteInitializer } from '../lib/SangteInitializer'
import { SangteManager } from '../lib/SangteManager'

const SangteContext = createContext<SangteManager | null>(null)

interface SangteProviderProps {
  children: React.ReactNode
  inheritSangtes?: Sangte<any>[]
  initialize?: (params: { set: <T>(sangte: Sangte<T, any>, value: T) => void }) => void
  dehydratedState?: Record<string, any>
}

export function SangteProvider({
  children,
  inheritSangtes,
  initialize,
  dehydratedState,
}: SangteProviderProps) {
  const parent = useContext(SangteContext)
  const managerRef = useRef<SangteManager | null>(null)
  const initialized = useRef(false)

  const initializeProvider = useCallback(() => {
    if (initialized.current) return

    const manager = new SangteManager()
    managerRef.current = manager

    if (parent) {
      manager.parent = parent
      parent.children.add(manager)
    }
    manager.dehydratedState = dehydratedState
    if (inheritSangtes) {
      if (!parent) {
        throw new Error(
          'Cannot inherit sangtes from default SangteManager. Please wrap your app with SangteProvider.'
        )
      }
      manager.inherit(inheritSangtes)
    }
    if (initialize) {
      initialize({
        set: manager.initializer.set.bind(manager.initializer),
      })
      manager.initializer.initialize()
    }
    initialized.current = true
  }, [])

  initializeProvider()

  useEffect(() => {
    initializeProvider()
    return () => {
      initialized.current = false
      if (parent && managerRef.current) {
        parent.children.delete(managerRef.current)
      }
    }
  }, [initializeProvider])

  return <SangteContext.Provider value={managerRef.current}>{children}</SangteContext.Provider>
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
