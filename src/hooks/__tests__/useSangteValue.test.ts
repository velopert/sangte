import { renderHook } from '@testing-library/react-hooks'
import { sangte } from '../../lib'
import { useSangteValue } from '../useSangteValue'

describe('useSangteValue', () => {
  it('returns value', () => {
    const state = sangte(0)
    const { result } = renderHook(() => useSangteValue(state))
    expect(result.current).toBe(0)
  })

  it('selects value', () => {
    const state = sangte({ count: 0 })
    const { result } = renderHook(() => useSangteValue(state, (state) => state.count))
    expect(result.current).toBe(0)
  })
  it('selects multiple fields', () => {
    const state = sangte({ count: 0, name: 'foo' })
    const { result } = renderHook(() =>
      useSangteValue(state, (state) => ({
        count: state.count,
        name: state.name,
      }))
    )
    expect(result.current).toEqual({ count: 0, name: 'foo' })
  })
})
