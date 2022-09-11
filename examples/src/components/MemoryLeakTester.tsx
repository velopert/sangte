import { useEffect, useRef, useState } from 'react'
import { resangte, sangte, SangteProvider, useSangteActions, useSangteValue } from 'sangte'

const array = new Array(1000).fill(0).map((_, i) => ({ id: i, done: false }))

const itemsState = sangte(array, (prev) => ({
  work(id: number) {
    const item = prev.find((item) => item.id === id)
    if (!item) return
    item.done = true
  },
}))
const doneItemsValue = resangte((get) => get(itemsState).filter((item) => item.done))

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function Work({ onHide }: { onHide(): void }) {
  const called = useRef<boolean>(false)

  const doneItems = useSangteValue(doneItemsValue)
  const { work } = useSangteActions(itemsState)

  useEffect(() => {
    if (called.current) return
    called.current = true
    const random = Math.floor(Math.random() * 10)
    const loop = async () => {
      for (let i = 0; i < random; i++) {
        work(i)
        console.log('workign!')
        await sleep(1)
      }
      onHide()
    }
    loop()
  }, [])

  return <div>{doneItems.length} items done!</div>
}

function Wrapper() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (!visible) {
      setVisible(true)
    }
  }, [visible])

  if (!visible) return null
  return (
    <SangteProvider>
      <Work
        onHide={() => {
          setVisible(false)
        }}
      />
    </SangteProvider>
  )
}

function MemoryLeakTester() {
  return <Wrapper />
}

export default MemoryLeakTester
