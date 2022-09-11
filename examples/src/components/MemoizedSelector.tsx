import { useState } from 'react'
import { resangte, sangte, useSangteActions, useSangteValue } from 'sangte'
import { todosState } from './Todos'

const uncompletedTodosValue = resangte((get) => {
  console.log('filtering..')
  return get(todosState).filter((todo) => !todo.completed)
})

function MemoizedSelector() {
  const uncompletedTodos = useSangteValue(uncompletedTodosValue)
  const actions = useSangteActions(todosState)
  const [value, setValue] = useState(0)
  return (
    <div>
      {uncompletedTodos.map((todo) => (
        <div
          onClick={() => {
            actions.toggle(todo.id)
          }}
        >
          {todo.text}
        </div>
      ))}
      <div>{value}</div>
      <button
        onClick={() => {
          setValue(value + 1)
        }}
      >
        +1
      </button>
    </div>
  )
}

export default MemoizedSelector
