import { renderHook, act } from '@testing-library/react-hooks'
import { sangte } from '../../lib'
import { useSangteActions } from '../useSangteActions'
import { useSangteValue } from '../useSangteValue'

describe('useSangteActions', () => {
  it('returns actions', () => {
    const state = sangte(0, (prev) => ({
      increase() {
        return prev + 1
      },
      decrease() {
        return prev - 1
      },
    }))
    const { result } = renderHook(() => useSangteActions(state))
    expect(typeof result.current.decrease).toBe('function')
  })
  it('updates value according to actions', () => {
    const state = sangte(0, (prev) => ({
      increase() {
        return prev + 1
      },
      decrease() {
        return prev - 1
      },
    }))
    const {
      result: { current: actions },
    } = renderHook(() => useSangteActions(state))
    const { result } = renderHook(() => useSangteValue(state))
    expect(result.current).toBe(0)
    act(() => {
      actions.increase()
    })
    expect(result.current).toBe(1)
  })
  it('throws error when action not defined', () => {
    const state = sangte(0)
    expect(() => {
      const {
        result: { current: actions },
        // @ts-ignore
      } = renderHook(() => useSangteActions(state))
    }).toThrowError()
  })
})
