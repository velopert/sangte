import { Sangte } from './sangte'
import { SangteManager } from './SangteManager'

export class SangteInitializer {
  private sangteInitialStateMap = new Map<Sangte<any, any>, any>()

  constructor(private manager: SangteManager) {}

  public set<T>(sangte: Sangte<T, any>, initialState: T) {
    this.sangteInitialStateMap.set(sangte, initialState)
  }

  public initialize() {
    this.sangteInitialStateMap.forEach((initialState, sangte) => {
      const instance = this.manager.get(sangte)
      instance.setState(initialState)
    })
  }
}
