import { useSangteActions, useSangteSelector, useSangteValue } from '../hooks'
import { sangte } from '../lib'

const userState = sangte(
  {
    id: 1,
    username: 'velopert',
    email: 'public.velopert@gmail.com',
    isActive: false,
  },
  (prev) => ({
    toggleActive() {
      prev.isActive = !prev.isActive
    },
  })
)

function Value() {
  const { username, email } = useSangteSelector(userState, (state) => ({
    username: state.username,
    email: state.email,
  }))

  return (
    <div>
      <h1>{username}</h1>
      <p>{email}</p>
    </div>
  )
}

function Toggle() {
  const { toggleActive } = useSangteActions(userState)
  return <button onClick={toggleActive}>Toggle</button>
}

function Active() {
  const isActive = useSangteSelector(userState, (state) => state.isActive)
  return <div>{isActive ? 'active' : 'inactive'}</div>
}

function Selector() {
  return (
    <div>
      <Value />
      <Active />
      <Toggle />
    </div>
  )
}

export default Selector
