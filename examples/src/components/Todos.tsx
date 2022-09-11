import { sangte, useSangteActions, useSangteValue } from 'sangte'

export const todosState = sangte(
  [
    {
      id: 1,
      text: 'Learn React',
      completed: true,
    },
    {
      id: 2,
      text: 'Learn Sangte',
      completed: false,
    },
    {
      id: 3,
      text: 'Learn React Router',
      completed: false,
    },
  ],
  (prev) => ({
    toggle(id: number) {
      const todo = prev.find((todo) => todo.id === id)
      if (!todo) return
      todo.completed = !todo.completed
    },
  })
)

function Todos() {
  const todos = useSangteValue(todosState)
  const actions = useSangteActions(todosState)

  return (
    <div>
      {todos.map((todo) => (
        <div
          style={{
            textDecoration: todo.completed ? 'line-through' : 'none',
          }}
          onClick={() => {
            actions.toggle(todo.id)
          }}
        >
          {todo.text}
        </div>
      ))}
    </div>
  )
}

export default Todos
