import { sangte } from '../sangte'
import { SangteManager } from '../SangteManager'

describe('sangte', () => {
  it('can be created', () => {
    const create = sangte({ count: 0 })
    const store = create()
    expect(store.getState().count).toBe(0)
  })

  it('can be updated with setState', () => {
    const create = sangte({ count: 0 })
    const store = create()
    store.setState({ count: 1 })
    expect(store.getState().count).toBe(1)
    store.setState((prev) => ({ count: prev.count + 5 }))
    expect(store.getState().count).toBe(6)
  })

  it('calls subscriptions when updated', () => {
    const create = sangte({ count: 0 })
    const store = create()
    const callback = jest.fn()
    const callback2 = jest.fn()
    store.subscribe(callback)
    store.subscribe(callback2)
    store.setState({ count: 1 })
    expect(callback).toBeCalled()
    expect(callback2).toBeCalled()
  })

  it('unsubcribes properly', () => {
    const create = sangte({ count: 0 })
    const store = create()
    const callback = jest.fn()
    const unsubcribe = store.subscribe(callback)
    store.setState({ count: 1 })
    expect(callback).toBeCalled()
    unsubcribe()
    callback.mockReset()
    store.setState({ count: 2 })
    expect(callback).not.toBeCalled()
  })

  it('calls actions properly', () => {
    const create = sangte({ count: 0 }, (prev) => ({
      increase() {
        prev.count += 1
      },
      decreaseBy(amount: number) {
        return {
          ...prev,
          count: prev.count - amount,
        }
      },
    }))
    const store = create()
    const callback = jest.fn()

    store.subscribe(callback)

    expect(store.getState().count).toBe(0)
    store.actions?.increase()
    expect(store.getState().count).toBe(1)
    store.actions?.decreaseBy(5)
    expect(store.getState().count).toBe(-4)

    expect(callback).toBeCalledTimes(2)
  })

  it('can be reset', () => {
    const create = sangte({ count: 0 })
    const store = create()
    store.setState({ count: 1 })
    expect(store.getState().count).toBe(1)
    store.reset()
    expect(store.getState().count).toBe(0)
  })

  it('should keep immutability', () => {
    const create = sangte({ count: 0 }, (prev) => ({
      increase() {
        prev.count += 1
      },
    }))
    const store = create()
    const prev = store.getState()
    store.actions?.increase()
    const next = store.getState()
    expect(prev).not.toBe(next)
  })

  it('should have config', () => {
    const create = sangte(
      { count: 0 },
      {
        global: true,
        key: 'counter',
      }
    )
    expect(create.config).toEqual({
      global: true,
      key: 'counter',
    })
  })
})

describe('resangte', () => {
  it('can be created', () => {
    const state = sangte([1, 2, 3, 4, 5])
    const manager = new SangteManager()
    manager.get(state)
    const selectedState = sangte((get) => get(state).filter((number) => number > 2))
    const store = manager.get(selectedState)
    expect(store.getState()).toEqual([3, 4, 5])
  })
  it('properly updates when dependencies change', () => {
    const state = sangte([1, 2, 3, 4, 5])
    const manager = new SangteManager()
    manager.get(state)
    const selectedState = sangte((get) => get(state).filter((number) => number > 2))
    const store = manager.get(selectedState)
    const callback = jest.fn()
    store.subscribe(callback)
    manager.get(state).setState([1, 2, 3, 4, 5, 6, 7])
    expect(callback).toBeCalledTimes(1)
    expect(store.getState()).toEqual([3, 4, 5, 6, 7])
  })
  it('properly handles unmount & remount', () => {
    const state = sangte([1, 2, 3, 4, 5])
    const manager = new SangteManager()
    manager.get(state)
    const selectedState = sangte((get) => get(state).filter((number) => number > 2))
    const store = manager.get(selectedState)
    const callback = jest.fn()
    let unsubscribe = store.subscribe(callback)
    unsubscribe()
    manager.get(state).setState([1, 2, 3, 4, 5, 6, 7])
    expect(callback).not.toBeCalled()
    // still gets updated because getState calls selector when unmounted
    expect(store.getState()).toEqual([3, 4, 5, 6, 7])
  })
  it('warns when calling setState or reset', () => {
    const state = sangte([1, 2, 3, 4, 5])
    const manager = new SangteManager()
    manager.get(state)
    const selectedState = sangte((get) => get(state).filter((number) => number > 2))
    const store = manager.get(selectedState)
    const consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation()
    store.reset()
    store.setState([1, 2, 3])
    expect(consoleWarnMock).toBeCalledTimes(2)
    consoleWarnMock.mockRestore()
  })
  it('throws error when manager is not used', () => {
    const state = sangte([1, 2, 3, 4, 5])
    const selectedState = sangte((get) => get(state).filter((number) => number > 2))
    expect(() => {
      const store = selectedState()
    }).toThrowError()
  })
})
