import { atom } from '../../lib'
import { useSangte } from '..'
import { renderHook, act } from '@testing-library/react-hooks'

describe('useSangte', () => {
  it('can be called', () => {
    const counterState = atom(0)
    const { result } = renderHook(() => useSangte(counterState))
    expect(result.current[0]).toBe(0)
    expect(typeof result.current[1]).toBe('function')
  })
  it('can update the state', () => {
    const counterState = atom(0)
    const { result } = renderHook(() => useSangte(counterState))

    act(() => {
      result.current[1](10)
    })
    expect(result.current[0]).toBe(10)
    act(() => {
      result.current[1]((prev) => prev + 1)
    })
    expect(result.current[0]).toBe(11)
  })
})
