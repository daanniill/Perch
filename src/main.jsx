import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { StackProvider, StackTheme } from '@stackframe/stack'
import { stackApp } from './lib/stackauth'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StackProvider app={stackApp}>
      <StackTheme>
        <App />
      </StackTheme>
    </StackProvider>
  </StrictMode>,
)
