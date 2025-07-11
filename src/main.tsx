import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/css/global.css'
import './assets/css/menu.css'

import ClienteMenu from './pages/cliente/ClienteMenu.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClienteMenu />
  </StrictMode>,
)
