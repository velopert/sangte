# sangte

[![](https://img.shields.io/npm/v/sangte?style=flat-square)](https://www.npmjs.com/package/sangte)
[![](https://img.shields.io/bundlephobia/min/sangte?style=flat-square)](https://bundlephobia.com/package/sangte)
[![](https://img.shields.io/codecov/c/github/velopert/sangte?style=flat-square)](https://app.codecov.io/gh/velopert/sangte)

[English](./README.md) | [한국어](./README-ko.md)

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

`useSangte` works like `useState` from React, but it works globally. It returns the state and a setter function to update the state.

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

If you want to select a part of the state, you can pass selector function as second argument. If you select multiple fields, the component will rerender after shallow comparison. You can override the comparison function by passing a custom equality function to third argument.

```tsx
import { sangte, useSangteValue } from 'sangte'

const userState = sangte({ id: 1, name: 'John', email: 'john@email.com' })

function User() {
  const { name, email } = useSangteValue(userState, (state) => ({
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

#### useSetSangte

If you only need the updater function of the state, you can use `useSetSangte`.

```tsx
import { sangte, useSetSangte } from 'sangte'

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
  decreaseBy(amount: number) {
    return prev - amount
  },
}))

function CounterButtons() {
  const { increase, decreaseBy } = useSangteActions(counterState)
  return (
    <div>
      <button onClick={increase}>Increase</button>
      <button onClick={() => decreaseBy(10)}>Decrease</button>
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

#### useResetAllSangte

If you want to reset all the states to their default values, you can use `useResetAllSangte`. This hook also resets sangte inside the nested providers.

```tsx
import { sangte, useResetAllSangte } from 'sangte'

const counterState = sangte(0)
const textState = sangte('text')

function Counter() {
  const [counter, setCounter] = useSangte(counterState)
  const [text, setText] = useSangte(textState)
  const resetAll = useResetAllSangte()

  return (
    <div>
      <h1>
        {counter} | {text}
      </h1>
      <button onClick={() => setCounter((prev) => prev + 1)}>Increment</button>
      <button onClick={() => setText('Hello World'}>Update Text</button>
      <button onClick={resetAll}>Reset</button>
    </div>
  )
}
```

If you want to reset the states globally (including all parent providers), you can pass `true` as first argument.

```tsx
import { sangte, useResetAllSangte } from 'sangte'

function RestAll() {
  const resetAll = useResetAllSangte()
  return <button onClick={() => resetAll(true)}>Reset All</button>
}
```

#### useSangteCallback

If you want to use the state in a callback but you do not want to rerender the component as the state changes, you can use `useSangteCallback`.

```tsx
import { sangte, useSangteCallback } from 'sangte'

const valueState = sangte('hello world!')

function ConfirmButton() {
  // this component won't rerender even when valueState changes
  const confirm = useSangteCallback(({ get }) => {
    const value = get(valueState)
    console.log(value) // do something with value..
  }, [])

  return <button onClick={confirm}>Confirm</button>
}
```

You can also use the setter function or actions with `useSangteCallback`.

```tsx
import { sangte, useSangteCallback } from 'sangte'

const counterState = sangte(0, (prev) => ({
  add(value: number) {
    return prev + value
  },
}))

function Counter() {
  // calls add action
  const add2 = useSangteCallback(({ actions }) => {
    const { add } = actions(counterState)
    add(2)
  }, [])

  // sets counterState to 10000
  const set10000 = useSangteCallback(({ set }) => {
    set(counterState, 10000)
  }, [])

  return (
    <div>
      <button onClick={add2}>add 2</button>
      <button onClick={logCount}>logCount</button>
      <button onClick={set10000}>set 10000</button>
    </div>
  )
}
```

## Recipe

### Using multiple providers

### Inheriting state from parent provider

### Server side rendering

> Docs are still in progress. If you have any questions, please open an issue.
