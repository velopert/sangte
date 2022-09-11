import { sangte } from '../sangte'
import { SangteManager } from '../SangteManager'

describe('SangteManager', () => {
  it('creates instance', () => {
    const manager = new SangteManager()
    expect(manager).toBeInstanceOf(SangteManager)
  })
  it('gets root manager', () => {
    const grandParent = new SangteManager()
    const parent = new SangteManager()
    parent.parent = grandParent
    const child = new SangteManager()
    child.parent = parent
    expect(child.getRootSangteManager()).toBe(grandParent)
  })
  it('resets all sangte', () => {
    const counterState = sangte(0)
    const textState = sangte('')
    const manager = new SangteManager()
    manager.get(counterState).setState(1)
    manager.get(textState).setState('hello')
    expect(manager.get(counterState).getState()).toBe(1)
    expect(manager.get(textState).getState()).toBe('hello')
    manager.reset()
    expect(manager.get(counterState).getState()).toBe(0)
    expect(manager.get(textState).getState()).toBe('')
  })
})
