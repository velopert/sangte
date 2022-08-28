import { sangte, useResetSangte, useSangteActions, useSangteValue } from 'sangte'

const counterState = sangte(0, (prev) => ({
  increase() {
    return prev + 1
  },
  decrease(amount: number) {
    return prev - amount
  },
}))

function Counter() {
  const counter = useSangteValue(counterState)
  const actions = useSangteActions(counterState)
  const reset = useResetSangte(counterState)

  return (
    <div>
      <h1>{counter}</h1>
      <button onClick={actions.increase}>+</button>
      <button onClick={() => actions.decrease(10)}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  )
}

export default Counter
