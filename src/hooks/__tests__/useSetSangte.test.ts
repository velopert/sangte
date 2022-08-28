import { act, renderHook } from '@testing-library/react-hooks'
import { sangte } from '../../lib'
import { useSangteValue } from '../useSangteValue'
import { useSetSangte } from '../useSetSangte'

describe('useSetSangte', () => {
  it('updates value', () => {
    const state = sangte(0)
    const { result } = renderHook(() => useSangteValue(state))
    expect(result.current).toBe(0)
    const {
      result: { current },
    } = renderHook(() => useSetSangte(state))
    act(() => {
      current(5)
    })
    expect(result.current).toBe(5)
  })
})
