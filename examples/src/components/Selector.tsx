import { sangte, useSangteActions, useSangteValue } from 'sangte'

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
  const { username, email } = useSangteValue(userState, (state) => ({
    username: state.username,
    email: state.email,
  }))

  return (
    <div>
      <div>{username}</div>
      <div>{email}</div>
    </div>
  )
}

function Toggle() {
  const { toggleActive } = useSangteActions(userState)
  return <button onClick={toggleActive}>Toggle</button>
}

function Active() {
  const isActive = useSangteValue(userState, (state) => state.isActive)
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
