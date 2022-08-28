import { sangte, SangteProvider, useSangteValue } from 'sangte'

const numberState = sangte(0, { key: 'number' })
const textState = sangte('hello world', { key: 'text' })

function Values() {
  const number = useSangteValue(numberState)
  const text = useSangteValue(textState)

  return (
    <div>
      <div>
        <b>number:</b> {number}
      </div>
      <div>
        <b>text:</b> {text}
      </div>
    </div>
  )
}

function Hydrate() {
  return (
    <SangteProvider
      dehydratedState={{
        number: 10,
        text: 'bye world',
      }}
    >
      <Values />
    </SangteProvider>
  )
}

export default Hydrate
