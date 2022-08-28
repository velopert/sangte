import { act, renderHook } from '@testing-library/react-hooks'
import { describe, expect, it } from 'vitest'
import { sangte } from '../../lib'
import { useResetSangte } from '../useResetSangte'
import { useSangte } from '../useSangte'

describe('useResetSangte', () => {
  it('resets to initialState', () => {
    const state = sangte(0)
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
