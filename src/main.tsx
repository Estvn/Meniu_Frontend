import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter, Routes, Route} from "react-router-dom";

import './assets/css/global.css'
import Login from './components/Login.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path = "/" element = {<Login/>}></Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

