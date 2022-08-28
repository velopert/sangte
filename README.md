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

```tsx
import { sangte, useResetSangte, useSangteActions, useSangteValue } from 'sangte'

const appState = sangte(
  {
    text: '',
    count: 0,
  },
  (prev) => ({
    change(text: string) {
      prev.text = text
    },
    increase() {
      prev.count += 1
    },
    decrease() {
      return {
        ...prev,
        count: prev.count - 1,
      }
    },
  })
)

function Input() {
  const text = useSangteValue(appState, (state) => state.text)
  const { change } = useSangteActions(appState)
  return <input value={text} onChange={(e) => change(e.target.value)} />
}

function Counter() {
  const count = useSangteValue(appState, (state) => state.count)
  const actions = useSangteActions(appState)
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={actions.increase}>+1</button>
      <button onClick={actions.decrease}>-1</button>
    </div>
  )
}

function App() {
  const reset = useResetSangte(appState)

  return (
    <div>
      <Counter />
      <Input />
      <button onClick={reset}>Reset</button>
    </div>
  )
}

export default App
```
