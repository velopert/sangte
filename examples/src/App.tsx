import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import Counter from './components/Counter'
import Initialize from './components/Initialize'
import Hydrate from './components/Hydrate'
import Selector from './components/Selector'
import MultiProviders from './components/MultiProviders'
import Inherit from './components/Inherit'

function App() {
  return (
    <div className="samples">
      <div>
        <Counter />
      </div>
      <div>
        <Initialize />
      </div>
      <div>
        <Hydrate />
      </div>
      <div>
        <Selector />
      </div>
      <div>
        <MultiProviders />
      </div>
      <div>
        <Inherit />
      </div>
    </div>
  )
}

export default App
