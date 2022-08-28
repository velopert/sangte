import { useSangteActions } from '../hooks/useSangteActions'
import { useSangteValue } from '../hooks/useSangteValue'
import { sangte } from '../lib/sangte'

const mySangte = sangte(
  {
    value: 0,
  },
  (prevState) => ({
    increase() {
      prevState.value += 1
    },
    decrease() {
      prevState.value -= 1
    },
    setTo(value: number) {
      prevState.value = value
    },
    reset() {
      return {
        value: 0,
      }
    },
  })
)

function ActionsCounter() {
  const value = useSangteValue(mySangte)
  const actions = useSangteActions(mySangte)

  return (
    <div>
      <h3>Counter</h3>
      <p>{value.value}</p>
      <button onClick={actions.increase}>+1</button>
      <button onClick={actions.decrease}>-1</button>
      <button onClick={actions.reset}>Reset</button>
    </div>
  )
}

export default ActionsCounter
