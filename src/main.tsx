import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { SangteProvider } from './contexts/SangteProvider'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SangteProvider>
      <App />
    </SangteProvider>
  </React.StrictMode>
)
