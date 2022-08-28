import { renderHook } from '@testing-library/react-hooks'
import { describe, expect, it } from 'vitest'
import { sangte } from '../../lib'
import { useSangteValue } from '../useSangteValue'

describe('useSangteValue', () => {
  it('returns value', () => {
    const state = sangte(0)
    const { result } = renderHook(() => useSangteValue(state))
    expect(result.current).toBe(0)
  })
})
