import { SangteProvider, useSangteActions } from 'sangte'
import { useSangteValue } from 'sangte'
import { sangte } from 'sangte'

const globalCounterState = sangte(
  0,
  (prev) => ({
    increase() {
      return prev + 1
    },
  }),
  {
    global: true,
  }
)

function Counter() {
  const counter = useSangteValue(globalCounterState)
  const actions = useSangteActions(globalCounterState)

  return (
    <div>
      <h3>{counter}</h3>
      <button onClick={actions.increase}>+1</button>
    </div>
  )
}

function GlobalState() {
  return (
    <SangteProvider>
      <Counter />
      <div style={{ padding: 16, border: '1px solid black' }}>
        <SangteProvider>
          <Counter />
        </SangteProvider>
      </div>
    </SangteProvider>
  )
}

export default GlobalState
