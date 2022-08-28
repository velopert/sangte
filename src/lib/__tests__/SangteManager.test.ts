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
})
