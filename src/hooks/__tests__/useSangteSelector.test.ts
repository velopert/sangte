import { renderHook } from '@testing-library/react-hooks'
import { sangte } from '../../lib'
import { useSangteSelector } from '../useSangteSelector'

describe('useSangteSelector', () => {
  it('selects value', () => {
    const state = sangte({ count: 0 })
    const { result } = renderHook(() => useSangteSelector(state, (state) => state.count))
    expect(result.current).toBe(0)
  })
  it('selects multiple fields', () => {
    const state = sangte({ count: 0, name: 'foo' })
    const { result } = renderHook(() =>
      useSangteSelector(state, (state) => ({
        count: state.count,
        name: state.name,
      }))
    )
    expect(result.current).toEqual({ count: 0, name: 'foo' })
  })
})
