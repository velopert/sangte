import { SangteProvider, useSangteActions } from 'sangte'
import { useSangteValue } from 'sangte'
import { sangte } from 'sangte'

const counterState = sangte(0, (prev) => ({
  increase() {
    return prev + 1
  },
}))

function Counter() {
  const counter = useSangteValue(counterState)
  const actions = useSangteActions(counterState)

  return (
    <div>
      <h3>{counter}</h3>
      <button onClick={actions.increase}>+1</button>
    </div>
  )
}

function Inherit() {
  return (
    <SangteProvider>
      <Counter />
      <div style={{ padding: 16, border: '1px solid black' }}>
        <SangteProvider inheritSangtes={[counterState]}>
          <Counter />
        </SangteProvider>
      </div>
    </SangteProvider>
  )
}

export default Inherit
