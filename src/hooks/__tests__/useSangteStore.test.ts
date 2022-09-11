import { renderHook } from '@testing-library/react-hooks'
import { atom } from '../../lib'
import { useSangteStore } from '../useSangteStore'

describe('useSangteStore', () => {
  it('returns store', () => {
    const state = atom(0)
    const { result } = renderHook(() => useSangteStore(state))
    expect(result.current).toHaveProperty('getState')
  })
})
