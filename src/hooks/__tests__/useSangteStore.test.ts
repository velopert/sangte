import { renderHook } from '@testing-library/react-hooks'
import { describe, expect, it } from 'vitest'
import { sangte } from '../../lib'
import { useSangteStore } from '../useSangteStore'

describe('useSangteStore', () => {
  it('returns store', () => {
    const state = sangte(0)
    const { result } = renderHook(() => useSangteStore(state))
    expect(result.current).toHaveProperty('getState')
  })
})
