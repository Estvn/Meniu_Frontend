import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/css/global.css'
import GenericComponent from './components/GenericComponent.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GenericComponent />
  </StrictMode>,
)
