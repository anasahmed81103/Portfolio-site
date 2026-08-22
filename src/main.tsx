/**
 * App entry (Vite + React).
 *
 * `createRoot` mounts the React tree into `#root` in index.html.
 * `StrictMode` double-invokes some effects in development so we catch unsafe
 * side effects — that is why reveal sounds use playTransitionOnce().
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app/app.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
