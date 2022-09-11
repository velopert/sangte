import { renderHook } from '@testing-library/react-hooks'
import { atom } from '../../lib'
import { useSangteValue } from '../useSangteValue'

describe('useSangteValue', () => {
  it('returns value', () => {
    const state = atom(0)
    const { result } = renderHook(() => useSangteValue(state))
    expect(result.current).toBe(0)
  })

  it('selects value', () => {
    const state = atom({ count: 0 })
    const { result } = renderHook(() => useSangteValue(state, (state) => state.count))
    expect(result.current).toBe(0)
  })

  it('selectes memoized value', () => {
    const numbersState = atom([0, 1, 2, 3, 4, 5])
    const filteredNumbersState = atom((get) => get(numbersState).filter((number) => number > 2))
    const { result } = renderHook(() => useSangteValue(filteredNumbersState))
    expect(result.current).toEqual([3, 4, 5])
  })

  it('selects multiple fields', () => {
    const state = atom({ count: 0, name: 'foo' })
    const { result } = renderHook(() =>
      useSangteValue(state, (state) => ({
        count: state.count,
        name: state.name,
      }))
    )
    expect(result.current).toEqual({ count: 0, name: 'foo' })
  })
})
