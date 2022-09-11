import { act, renderHook } from '@testing-library/react-hooks'
import { atom } from '../../lib'
import { useSangteCallback } from '../useSangteCallback'
import { useSangteValue } from '../useSangteValue'

describe('useSangteCallback', () => {
  it('get value', () => {
    const state = atom(5)

    let value
    const { result } = renderHook(() =>
      useSangteCallback(({ get }) => {
        value = get(state)
      }, [])
    )
    act(() => {
      result.current()
    })
    expect(value).toBe(5)
  })

  it('set value', () => {
    const state = atom(0)

    const { result: sangteValue } = renderHook(() => useSangteValue(state))
    expect(sangteValue.current).toBe(0)

    const { result } = renderHook(() =>
      useSangteCallback(({ set }) => {
        set(state, 100)
      }, [])
    )
    act(() => {
      result.current()
    })
    expect(sangteValue.current).toBe(100)
  })

  it('update value with action', () => {
    const state = atom(0, (prev) => ({
      increase() {
        return prev + 1
      },
    }))

    const { result: sangteValue } = renderHook(() => useSangteValue(state))
    expect(sangteValue.current).toBe(0)

    const { result } = renderHook(() =>
      useSangteCallback(({ actions }) => {
        const { increase } = actions(state)
        increase()
      }, [])
    )
    act(() => {
      result.current()
    })
    expect(sangteValue.current).toBe(1)
  })

  it('throws error when action not defined ', () => {
    const state = atom(0)

    const { result } = renderHook(() =>
      useSangteCallback(({ actions }) => {
        // @ts-ignore
        actions(state)
      }, [])
    )

    expect(() => {
      act(() => {
        result.current()
      })
    }).toThrowError()
  })
})
