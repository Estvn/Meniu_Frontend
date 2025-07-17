import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './assets/css/global.css'
import Login from './components/Login.tsx'
import MenuGerente from './components/administration/restaurant_food/MenuGerente.tsx';
import MesasGerente from './components/administration/restaurant_tables/MesasGerente.tsx';
import PersonalGerente from './components/administration/restaurant_staff/PersonalGerente.tsx';
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
      </Routes>
    </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)

