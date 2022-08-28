import { useSangteActions } from '../hooks/useSangteActions'
import { useSangteValue } from '../hooks/useSangteValue'
import { sangte } from '../lib/sangte'

const mySangte = sangte(1, (prevState) => ({
  increase() {
    prevState + 1
  },
  decrease() {
    prevState - 1
  },
}))

function ImmerSample() {
  const value = useSangteValue(mySangte)
  const actions = useSangteActions(mySangte)

  return (
    <div>
      <h3>Counter</h3>
      <p>{value}</p>
      <button onClick={actions.increase}>+1</button>
      <button onClick={actions.decrease}>-1</button>
    </div>
  )
}

export default ImmerSample
