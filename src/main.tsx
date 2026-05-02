import { initializeTheme } from '@store'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@styles/globals.css'
import { App } from './App'

// Initialize theme before rendering
initializeTheme()

const rootElement = document.getElementById('root')

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}
