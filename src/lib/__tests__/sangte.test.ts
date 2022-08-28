import { sangte } from '../sangte'

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
    const create = sangte({ count: 0 }, undefined, {
      global: true,
      key: 'counter',
    })
    expect(create.config).toEqual({
      global: true,
      key: 'counter',
    })
  })
})
