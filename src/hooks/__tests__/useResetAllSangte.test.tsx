import { fireEvent, render, screen } from '@testing-library/react'
import { act, renderHook } from '@testing-library/react-hooks'
import { SangteProvider } from '../../contexts'
import { atom } from '../../lib'
import { useResetAllSangte } from '../useResetAllSangte'
import { useSangte } from '../useSangte'

describe('useResetAllSangte', () => {
  it('resets to initialState', () => {
    const state = atom(0)
    const anotherState = atom(1)

    const { result } = renderHook(() => useSangte(state))
    const { result: result2 } = renderHook(() => useSangte(anotherState))
    act(() => {
      result.current[1](5)
      result2.current[1](6)
    })
    expect(result.current[0]).toBe(5)
    expect(result2.current[0]).toBe(6)

    const {
      result: { current: resetAll },
    } = renderHook(() => useResetAllSangte())
    act(() => {
      resetAll()
    })
    expect(result.current[0]).toBe(0)
    expect(result2.current[0]).toBe(1)
  })

  it('should reset children only', () => {
    const state = atom(0)
    function Child({ testId }: { testId: string }) {
      const [value, setState] = useSangte(state)
      const resetAll = useResetAllSangte()
      return (
        <div>
          <div data-testid={testId}>{value}</div>
          <button data-testid={`button-${testId}`} onClick={() => setState(15)}>
            Click Me
          </button>
          <button onClick={() => resetAll()} data-testid={`button-reset-${testId}`}></button>
        </div>
      )
    }

    render(
      <SangteProvider
        initialize={({ set }) => {
          set(state, 3)
        }}
      >
        <Child testId="parent" />
        <SangteProvider
          initialize={({ set }) => {
            set(state, 10)
          }}
        >
          <Child testId="child" />
          <SangteProvider
            initialize={({ set }) => {
              set(state, 5)
            }}
          >
            <Child testId="grandchild" />
          </SangteProvider>
        </SangteProvider>
      </SangteProvider>
    )

    expect(screen.getByTestId('parent')).toHaveTextContent('3')
    expect(screen.getByTestId('child')).toHaveTextContent('10')
    expect(screen.getByTestId('grandchild')).toHaveTextContent('5')
    fireEvent.click(screen.getByTestId('button-reset-child'))
    expect(screen.getByTestId('parent')).toHaveTextContent('3')
    expect(screen.getByTestId('child')).toHaveTextContent(/^0$/)
    expect(screen.getByTestId('grandchild')).toHaveTextContent(/^0$/)
  })

  it('should reset globally', () => {
    const state = atom(0)
    function Child({ testId }: { testId: string }) {
      const [value, setState] = useSangte(state)
      const resetAll = useResetAllSangte()
      return (
        <div>
          <div data-testid={testId}>{value}</div>
          <button data-testid={`button-${testId}`} onClick={() => setState(15)}>
            Click Me
          </button>
          <button onClick={() => resetAll(true)} data-testid={`button-reset-${testId}`}></button>
        </div>
      )
    }

    render(
      <SangteProvider
        initialize={({ set }) => {
          set(state, 3)
        }}
      >
        <Child testId="parent" />
        <SangteProvider
          initialize={({ set }) => {
            set(state, 10)
          }}
        >
          <Child testId="child" />
          <SangteProvider
            initialize={({ set }) => {
              set(state, 5)
            }}
          >
            <Child testId="grandchild" />
          </SangteProvider>
        </SangteProvider>
      </SangteProvider>
    )

    expect(screen.getByTestId('parent')).toHaveTextContent('3')
    expect(screen.getByTestId('child')).toHaveTextContent('10')
    expect(screen.getByTestId('grandchild')).toHaveTextContent('5')
    fireEvent.click(screen.getByTestId('button-reset-grandchild'))
    expect(screen.getByTestId('parent')).toHaveTextContent(/^0$/)
    expect(screen.getByTestId('child')).toHaveTextContent(/^0$/)
    expect(screen.getByTestId('grandchild')).toHaveTextContent(/^0$/)
  })
})
