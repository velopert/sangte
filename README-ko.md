# sangte

[![](https://img.shields.io/npm/v/sangte?style=flat-square)](https://www.npmjs.com/package/sangte)
[![](https://img.shields.io/bundlephobia/min/sangte?style=flat-square)](https://bundlephobia.com/package/sangte)
[![](https://img.shields.io/codecov/c/github/velopert/sangte?style=flat-square)](https://app.codecov.io/gh/velopert/sangte)

Sangte 는 리액트의 상태 관리 라이브러리입니다. 이 라이브러리는 [Redux Toolkit](https://redux-toolkit.js.org/)과 [Recoil](https://recoiljs.org/)에서 영감을 받아 만들어졌습니다.

> Sangte는 "상태"의 발음을 알파벳으로 표기한 것입니다.

## 설치

다음 명령어로 이 라이브러리를 설치하세요:

```
npm install sangte
```

yarn을 사용하신다면:

```
yarn add sangte
```

## 왜 Sangte 를 쓰나요?

- 준비해야 할 코드가 적음 (Less boilerplate)
- 원하는 상태가 업데이트 됐을 때만 리렌더링함
- 사용하기 쉬움
- 여러개의 Provider 허용
- 타입스크립트 지원

## 사용법

### 먼저, 상태를 만드세요

상태를 만드려면 `sangte` 함수를 사용해야 합니다. 이 라이브러리의 상태는 초깃값이 있어야 하며, 상태를 업데이트하는 액션을 가질 수 있습니다. 액션은 선택사항입니다.

Sangte는 내부적으로 [immer](https://immerjs.github.io/immer/)를 사용하여 상태를 업데이트합니다. 그래서 상태를 직접 변경하면서 불변성을 유지할 수 있습니다.

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

### 컴포넌트에서 상태 또는 액션을 사용하기

이 라이브러리는 상태나 액션을 여러분의 컴포넌트에서 사용 할 수 있도록 Hook 함수들을 제공합니다.

#### useSangte

`useSangte`는 `useState`와 비슷하지만, 전역적으로 작동합니다. 이 함수는 상태값과 업데이트 함수를 반환합니다.

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

만약 컴포넌트에서 상태값만 필요로 한다면 `useSangteValue` 를 사용하세요.

```tsx
import { useSangteValue } from 'sangte'

const counterState = sangte(0)

function CounterValue() {
  const counter = useSangteValue(counterState)
  return <h1>{counter}</h1>
}
```

상태에서 일부분의 값만 필요로 한다면 두번째 인자에 셀렉터 함수를 넣어서 원하는 부분만 선택할 수 있습니다. 객체 형태로 여러 필드를 선택하게 된다면 기본적으로 shallow compare를 하고 나서 리렌더링을 합니다. 비교 함수는 세번째 인자에 임의 비교 함수를 전달하여 override 할 수 있습니다.

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

만약 의존하는 값이 업데이트 되었을 때만 실행되는 memoized 셀렉터를 사용하고 싶으시다면 다음과 같이 읽기 전용 Sangte를 만들어서 사용할 수 있습니다.

```tsx
import { sangte } from 'sangte'
const todosState = sangte([
  { id: 1, text: 'Basic usage', done: true },
  { id: 21, text: 'Ready-only sangte', done: false },
])
const undoneTodosValue = sangte((get) => get(todosState).filter((todo) => !todo.done))
function UndoneTodos() {
  const undoneTodos = useSangteValue(undoneTodosValue)

  return <div>{undoneTodos.length} todos undone.</div>
}
```

#### useSetSangte

만약 컴포넌트에서 상태 업데이트 함수만을 필요로 한다면 `useSetSangte`를 사용하세요.

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

상태를 만들 때 액션을 정의했다면, `useSangteActions`를 사용하여 액션을 가져와서 호출할 수 있습니다.

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

상태를 초깃값으로 바꾸고 싶다면 `useResetSangte`를 사용하세요.

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

모든 상태를 초기화하고 싶다면 `useResetAllSangte`를 사용하세요. 이 hook은 자식 SangteProvider에도 영향을 미칩니다.

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

전역적으로 모든 상태(모든 부모 SangteProvider에 있는 상태 포함)를 초기화하고 싶다면 함수의 첫번째 인자에 `true`를 넘겨주세요.

```tsx
import { sangte, useResetAllSangte } from 'sangte'

function RestAll() {
  const resetAll = useResetAllSangte()
  return <button onClick={() => resetAll(true)}>Reset All</button>
}
```

#### useSangteCallback

콜백 함수 안에서 상태 값을 사용하고 싶지만 상태 값이 바뀔 때마다 컴포넌트가 리렌더링 되는 것을 원하지 않는다면, `useSangteCallback`을 쓰세요.

```tsx
import { sangte, useSangteCallback } from 'sangte'

const valueState = sangte('hello world!')

function ConfirmButton() {
  // 이 컴포넌트는 valueState가 변경되어도 리렌더링 되지 않습니다.
  const confirm = useSangteCallback(({ get }) => {
    const value = get(valueState)
    console.log(value) // value 값을 가지고 어떠한 작업을 하기..
  }, [])

  return <button onClick={confirm}>Confirm</button>
}
```

`useSangteCallback`에서 상태 업데이트 함수나 액션들을 사용할 수 있습니다.

```tsx
import { sangte, useSangteCallback } from 'sangte'

const counterState = sangte(0, (prev) => ({
  add(value: number) {
    return prev + value
  },
}))

function Counter() {
  // add 호출
  const add2 = useSangteCallback(({ actions }) => {
    const { add } = actions(counterState)
    add(2)
  }, [])

  // counterState 10000으로 변경
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
