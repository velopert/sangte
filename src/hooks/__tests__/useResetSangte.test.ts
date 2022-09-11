import { act, renderHook } from '@testing-library/react-hooks'
import { atom } from '../../lib'
import { useResetSangte } from '../useResetSangte'
import { useSangte } from '../useSangte'

describe('useResetSangte', () => {
  it('resets to initialState', () => {
    const state = atom(0)
    const { result } = renderHook(() => useSangte(state))
    act(() => {
      result.current[1](5)
    })
    expect(result.current[0]).toBe(5)
    const {
      result: { current: reset },
    } = renderHook(() => useResetSangte(state))
    act(() => {
      reset()
    })
    expect(result.current[0]).toBe(0)
  })
})
