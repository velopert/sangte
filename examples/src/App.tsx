import './App.css'
import Counter from './components/Counter'
import Initialize from './components/Initialize'
import Hydrate from './components/Hydrate'
import Selector from './components/Selector'
import MultiProviders from './components/MultiProviders'
import Inherit from './components/Inherit'
import GlobalState from './components/GlobalState'

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
      <div>
        <GlobalState />
      </div>
    </div>
  )
}

export default App
