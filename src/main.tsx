import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './assets/css/global.css'
import Login from './components/Login.tsx'
import MenuGerente from './components/administration/restaurant_food/MenuGerente.tsx';
import MesasGerente from './components/administration/restaurant_tables/MesasGerente.tsx';
import PersonalGerente from './components/administration/restaurant_staff/PersonalGerente.tsx';
import ClienteMenu from './pages/cliente/ClienteMenu.tsx';
import CartPageWrapper from './components/cliente/cart/CartPageWrapper.tsx';
import MisPedidosPageWrapper from './components/cliente/orders/MisPedidosPageWrapper.tsx';
import { isAuthenticated } from './assets/scripts/values/constValues';

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/" replace />;
    }
    return <>{children}</>;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path = "/" element = {<Login/>}></Route>
        <Route path = "/registro" element = {<Login/>}></Route>
        <Route path = "/menu" element = {<ProtectedRoute><MenuGerente/></ProtectedRoute>}></Route>
        <Route path = "/mesas" element = {<ProtectedRoute><MesasGerente/></ProtectedRoute>}></Route>
        <Route path = "/personal" element = {<ProtectedRoute><PersonalGerente/></ProtectedRoute>}></Route>
        <Route path = "/cliente" element = {<ClienteMenu/>}></Route>
        <Route path = "/carrito" element = {<CartPageWrapper/>}></Route>
        <Route path = "/mis-pedidos" element = {<MisPedidosPageWrapper/>}></Route>
      </Routes>

      
      <Toaster position="top-center"/>
    </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)

