# sangte

![](https://img.shields.io/npm/v/sangte?style=flat-square) ![](https://img.shields.io/bundlephobia/min/sangte?style=flat-square)

Sangte is a state management library for React. This library is inspired by [Redux Toolkit](https://redux-toolkit.js.org/) and [Recoil](https://recoiljs.org/).

> Sangte means "state" in Korean.

## Installation

To install the library, run the following command:

```
npm install sangte
```

Or if you're using yarn:

```
yarn add sangte
```

## Why sangte?

- Less boilerplate
- Rerender only when the state you're using is updated
- Easy to use
- Allows multiple providers
- TypeScript support

## Usage

### First create a state

To create a state you need to use the `sangte` function. A state of sangte should have a default value, and actions to update the state. Actions are optional.

Sangte uses [immer](https://immerjs.github.io/immer/) internally to update the state. So you can mutate the state directly while keeping the immutability.

```ts
import { sangte } from 'sangte'

const counterState = sangte(0)
const textState = sangte('text')
const userState = sangte({ id: 1, name: 'John', email: 'john@email.com' }, (prev) => ({
  setName(name: string) {
    prev.name = name
  },
  setEmail(email: string) {
    return {
      ...prev,
      email,
    }
  },
}))

interface Todo {
  id: number
  text: string
  done: boolean
}

const todosState = sangte<Todo[]>([], (prev) => ({
  add(todo: Todo) {
    return prev.push(todo)
  },
  remove(id: number) {
    return prev.filter((todo) => todo.id !== id)
  },
  toggle(id: number) {
    const todo = prev.find((todo) => todo.id === id)
    todo.done = !todo.done
  },
}))
```

### Use the state or actions from your components

The library provides hooks to utilize the state or actions from your components.

#### useSangte

`useSangte` works like `useState` from React. It returns the state and a setter function to update the state.

```tsx
import { sangte, useSangte } from 'sangte'

const counterState = sangte(0)

function Counter() {
  const [counter, setCounter] = useSangte(counterState)
  return (
    <div>
      <h1>{counter}</h1>
      <button onClick={() => setCounter((prev) => prev + 1)}>Increment</button>
      <button onClick={() => setCounter(0)}>Reset</button>
    </div>
  )
}

export default Counter
```

#### useSangteValue

If you only need the value of the state, you can use `useSangteValue`.

```tsx
import { useSangteValue } from 'sangte'

const counterState = sangte(0)

function CounterValue() {
  const counter = useSangteValue(counterState)
  return <h1>{counter}</h1>
}
```

#### useSetSangte

If you only need the updater function of the state, you can use `useSetSangte`.

```tsx
import { sangte, useSangteValue } from 'sangte'

const counterState = sangte(0)

function CounterButtons() {
  const setCounter = useSetSangte(counterState)
  return (
    <div>
      <button onClick={() => setCounter((prev) => prev + 1)}>Increment</button>
    </div>
  )
}
```

#### useSangteActions

If you have defined actions for the state, you can use `useSangteActions` to get the actions.

```tsx
import { sangte, useSangteActions } from 'sangte'

const counterState = sangte(0, (prev) => ({
  increase() {
    return prev + 1
  },
  decrease() {
    return prev - 1
  },
}))

function CounterButtons() {
  const { increment, decrement } = useSangteActions(counterState)
  return (
    <div>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  )
}
```

#### useSangteSelector

If you want to select a part of the state, you can use `useSangteSelector`. If you select multiple fields, the component will rerender after shallow comparison. You can override the comparison function by passing a custom equality function to third argument.

```tsx
import { sangte, useSangteSelector } from 'sangte'

const userState = sangte({ id: 1, name: 'John', email: 'john@email.com' })

function User() {
  const { name, email } = useSangteSelector(userState, (state) => ({
    name: state.name,
    email: state.email,
  }))
  return (
    <div>
      <h1>{name}</h1>
      <h2>{email}</h2>
    </div>
  )
}
```

#### useResetSangte

If you want to reset the state to its default value, you can use `useResetSangte`.

```tsx
import { sangte, useResetSangte } from 'sangte'

const counterState = sangte(0)

function Counter() {
  const [counter, setCounter] = useSangte(counterState)
  const resetCounter = useResetSangte(counterState)
  return (
    <div>
      <h1>{counter}</h1>
      <button onClick={() => setCounter((prev) => prev + 1)}>Increment</button>
      <button onClick={resetCounter}>Reset</button>
    </div>
  )
}
```
