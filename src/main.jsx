import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { installTranslateGuard } from './translate-guard'
import { seedHistory } from './router'

// Keep pages working when the visitor's browser translates them.
installTranslateGuard()
// Back from a product opened via a search result returns to its group.
seedHistory()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Keep development and embedded Admin previews free of service-worker interception.
if (import.meta.env.PROD && 'serviceWorker' in navigator && window.top === window.self && !location.pathname.startsWith('/admin') && !location.search) {
  window.addEventListener('load', () => { navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' }).catch(() => {}); });
}
