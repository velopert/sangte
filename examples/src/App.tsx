import './App.css'
import Counter from './components/Counter'
import Initialize from './components/Initialize'
import Hydrate from './components/Hydrate'
import Selector from './components/Selector'
import MultiProviders from './components/MultiProviders'
import Inherit from './components/Inherit'
import GlobalState from './components/GlobalState'
import MemoizedSelector from './components/MemoizedSelector'
import Todos from './components/Todos'
import VisibleToggle from './components/VisibleToggle'
import MemoryLeakTester from './components/MemoryLeakTester'

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
        <VisibleToggle>
          <MultiProviders />
        </VisibleToggle>
      </div>
      <div>
        <Inherit />
      </div>
      <div>
        <GlobalState />
      </div>
      <div>
        <Todos />
      </div>
      <div>
        <VisibleToggle>
          <MemoizedSelector />
        </VisibleToggle>
      </div>
      <div>
        <VisibleToggle>
          <MemoizedSelector />
        </VisibleToggle>
      </div>
      <div>
        <VisibleToggle>
          <MemoryLeakTester />
          <MemoryLeakTester />
          <MemoryLeakTester />
          <MemoryLeakTester />
          <MemoryLeakTester />
          <MemoryLeakTester />
          <MemoryLeakTester />
          <MemoryLeakTester />
          <MemoryLeakTester />
          <MemoryLeakTester />
          <MemoryLeakTester />
          <MemoryLeakTester />
          <MemoryLeakTester />
        </VisibleToggle>
      </div>
    </div>
  )
}

export default App
