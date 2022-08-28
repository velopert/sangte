import { ActionRecord, Sangte, SangteInstance } from './sangte'
import { SangteInitializer } from './SangteInitializer'

export class SangteManager {
  private instanceMap = new Map<Sangte<any, any>, SangteInstance<any, any>>()
  public initializer: SangteInitializer = new SangteInitializer(this)

  constructor(public isDefault: boolean = false) {}
  public get<T, A extends ActionRecord<T>>(sangte: Sangte<T, A>): SangteInstance<T, A> {
    const manager = sangte.config.global ? this.getRootSangteManager() : this
    const instance = manager.instanceMap.get(sangte)

    if (instance) {
      return instance
    }
    const newInstance = sangte()
    if (sangte.config.key && this.dehydratedState) {
      const selected = this.dehydratedState[sangte.config.key]
      if (selected) {
        newInstance.setState(selected)
      }
    }

    manager.instanceMap.set(sangte, newInstance)
    return newInstance
  }

  public parent: SangteManager | null = null
  public dehydratedState?: Record<string, any> | null

  public getRootSangteManager(): SangteManager {
    let manager: SangteManager | undefined = this
    while (manager.parent) {
      manager = manager.parent
    }
    return manager
  }

  public inherit(sangtes: Sangte<any>[]) {
    const parent = this.parent
    if (!parent) return
    sangtes.forEach((sangte) => {
      const sangteInstance = parent.get(sangte)
      this.instanceMap.set(sangte, sangteInstance)
    })
  }
}
