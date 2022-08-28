import React from 'react'
import { sangte, SangteProvider, useSangteValue } from 'sangte'

const textState = sangte('Default text')

function Text() {
  const text = useSangteValue(textState)
  return <div>{text}</div>
}

function Initialize() {
  return (
    <SangteProvider
      initialize={({ set }) => {
        set(textState, 'Hello World!')
      }}
    >
      <Text />
    </SangteProvider>
  )
}

export default Initialize
