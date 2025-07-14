import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import { Toaster } from 'sonner';

import './assets/css/global.css'
import Login from './components/Login.tsx'
import MenuGerente from './components/administration/restaurant_food/MenuGerente.tsx';
import MesasGerente from './components/administration/restaurant_tables/MesasGerente.tsx';
import PersonalGerente from './components/administration/restaurant_staff/PersonalGerente.tsx';
import ClienteMenu from './pages/cliente/ClienteMenu.tsx';
import CartPageWrapper from './components/cliente/cart/CartPageWrapper.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path = "/" element = {<Login/>}></Route>
        <Route path = "/registro" element = {<Login/>}></Route>
        <Route path = "/menu" element = {<MenuGerente/>}></Route>
        <Route path = "/mesas" element = {<MesasGerente/>}></Route>
        <Route path = "/personal" element = {<PersonalGerente/>}></Route>
        <Route path = "/cliente" element = {<ClienteMenu/>}></Route>
        <Route path = "/carrito" element = {<CartPageWrapper/>}></Route>
      </Routes>

      
      <Toaster position="top-center"/>
    </BrowserRouter>
  </StrictMode>,
)

