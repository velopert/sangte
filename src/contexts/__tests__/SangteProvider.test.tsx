import { fireEvent, render, screen } from '@testing-library/react'
import { SangteProvider } from '../SangteProvider'
import { sangte } from '../../lib'
import { useSangte, useSangteValue } from '../../hooks'

describe('SangteProvider', () => {
  it('should render children', () => {
    render(
      <SangteProvider>
        <div>hello</div>
      </SangteProvider>
    )
    screen.getByText('hello')
  })
  it('should initializeState', () => {
    const state = sangte(0)
    function Child() {
      const value = useSangteValue(state)
      return <div data-testid="value">{value}</div>
    }

    render(
      <SangteProvider
        initialize={({ set }) => {
          set(state, 10)
        }}
      >
        <Child />
      </SangteProvider>
    )
    expect(screen.getByTestId('value')).toHaveTextContent('10')
  })

  it('should use closest provider', () => {
    const state = sangte(0)
    function Child({ testId }: { testId: string }) {
      const [value, setState] = useSangte(state)
      return (
        <div>
          <div data-testid={testId}>{value}</div>
          <button data-testid={`button-${testId}`} onClick={() => setState(15)}>
            Click Me
          </button>
        </div>
      )
    }

    render(
      <SangteProvider>
        <Child testId="parent" />
        <SangteProvider
          initialize={({ set }) => {
            set(state, 10)
          }}
        >
          <Child testId="child" />
        </SangteProvider>
      </SangteProvider>
    )

    expect(screen.getByTestId('parent')).toHaveTextContent('0')
    expect(screen.getByTestId('child')).toHaveTextContent('10')
    fireEvent.click(screen.getByTestId('button-child'))
    expect(screen.getByTestId('parent')).toHaveTextContent('0')
    expect(screen.getByTestId('child')).toHaveTextContent('15')
  })

  it('should inherit state', () => {
    const state = sangte(0)
    function Child({ testId }: { testId: string }) {
      const [value, setState] = useSangte(state)
      return (
        <div>
          <div data-testid={testId}>{value}</div>
          <button data-testid={`button-${testId}`} onClick={() => setState(15)}>
            Click Me
          </button>
        </div>
      )
    }

    render(
      <SangteProvider>
        <Child testId="parent" />
        <SangteProvider
          initialize={({ set }) => {
            set(state, 10)
          }}
          inheritSangtes={[state]}
        >
          <Child testId="child" />
        </SangteProvider>
      </SangteProvider>
    )

    expect(screen.getByTestId('parent')).toHaveTextContent('10')
    expect(screen.getByTestId('child')).toHaveTextContent('10')
    fireEvent.click(screen.getByTestId('button-child'))
    expect(screen.getByTestId('parent')).toHaveTextContent('15')
    expect(screen.getByTestId('child')).toHaveTextContent('15')
  })

  it('should dehydrate', () => {
    const counterState = sangte(0, { key: 'counter' })
    const textState = sangte('hello world', { key: 'text' })

    function Child() {
      const counter = useSangteValue(counterState)
      const text = useSangteValue(textState)

      return (
        <div>
          <div data-testid="counter">{counter}</div>
          <div data-testid="text">{text}</div>
        </div>
      )
    }

    render(
      <SangteProvider
        dehydratedState={{
          counter: 10,
          text: 'bye world',
        }}
      >
        <Child />
      </SangteProvider>
    )

    expect(screen.getByTestId('counter')).toHaveTextContent('10')
    expect(screen.getByTestId('text')).toHaveTextContent('bye world')
  })

  it('cannot inherit from default SangteManager', () => {
    const state = sangte(0)
    expect(() => {
      render(
        <SangteProvider inheritSangtes={[state]}>
          <div>hello</div>
        </SangteProvider>
      )
    }).toThrowError()
  })
})
