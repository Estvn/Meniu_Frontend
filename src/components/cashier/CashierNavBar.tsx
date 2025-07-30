"use client";
import { useState, useRef, useEffect } from "react";
import { PersonalIcon } from "../administration/icons/PersonalIcon";
import { LogoutIcon } from "../administration/icons/LogoutIcon";
import { MenuIcon } from "../administration/icons/MenuIcon";
import { getStoredUserData, clearStoredAuth } from "../../assets/scripts/values/constValues";

interface CashierNavBarProps {
  title: string;
  subtitle: string;
}

export function CashierNavBar({ title, subtitle }: CashierNavBarProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  
  // Obtener datos del usuario
  const userData = getStoredUserData();
  const userName = userData?.nombre || 'Cajero';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen]);

  // Cierre sidebar mobile al hacer click fuera
  useEffect(() => {
    if (!sidebarOpen) return;
    function handleSidebarClick(event: MouseEvent) {
      const sidebar = document.getElementById("mobile-sidebar-overlay");
      if (sidebar && event.target instanceof Node && sidebar === event.target) {
        setSidebarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleSidebarClick);
    return () => document.removeEventListener("mousedown", handleSidebarClick);
  }, [sidebarOpen]);

  // Manejar animación de entrada/salida de sidebar
  useEffect(() => {
    if (sidebarOpen) {
      setSidebarVisible(true);
    } else {
      // Esperar a que termine la animación antes de ocultar el overlay
      const timeout = setTimeout(() => setSidebarVisible(false), 250);
      return () => clearTimeout(timeout);
    }
  }, [sidebarOpen]);

  const handleLogout = () => {
    // Limpiar datos de autenticación del sessionStorage
    clearStoredAuth();
    // Redirigir al login
    window.location.href = '/';
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center px-4 sm:px-6 lg:px-8 py-3 sm:py-4 shadow-sm bg-orange-500 h-16 sm:h-18 md:h-20">
        {/* Mobile Hamburger Menu Button */}
        <button
          className="mr-5 flex sm:hidden items-center justify-center mr-2 p-0 bg-transparent border-none shadow-none focus:outline-none"
          aria-label="Abrir menú"
          type="button"
          onClick={() => setSidebarOpen(true)}
        >
          <MenuIcon className="w-6 h-6 text-white" />
        </button>
        {/* Title and Subtitle */}
        <div className="flex flex-1 items-center">
          <div className="flex flex-col justify-center">
            <h1 className="text-base sm:text-lg md:text-xl font-bold leading-tight text-white">
              {title}
            </h1>
            <p className="text-xs sm:text-sm md:text-base leading-tight text-white text-opacity-90">
              {subtitle}
            </p>
          </div>
        </div>
        {/* Navigation */}
        <nav className="hidden sm:flex items-center space-x-4">
          {/* Navigation removed */}
        </nav>
        {/* User Icon and Dropdown (ahora a la derecha) */}
        <div className="hidden sm:flex relative items-center ml-4" ref={userMenuRef}>
          <button
            className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-400 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-white"
            onClick={() => setUserMenuOpen((open) => !open)}
            aria-label="Usuario"
          >
            <PersonalIcon className="w-6 h-6 text-white" />
          </button>
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
              <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                {userName}
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <LogoutIcon className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      </header>
      {/* Mobile Sidebar Overlay con transición */}
      {sidebarVisible && (
        <div
          id="mobile-sidebar-overlay"
          className={`fixed inset-0 z-50 flex sm:hidden backdrop-blur-sm transition-all duration-300 ${sidebarOpen ? 'bg-black/10' : 'bg-transparent'}`}
          style={{transition: 'background 0.3s'}}
        >
          <aside
            className={`relative w-64 max-w-[80vw] h-full bg-white shadow-2xl z-60 transform transition-transform duration-300 flex flex-col justify-between ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>

            <nav className="flex flex-col gap-2 p-6 flex-1 items-center">
              {/* Navigation removed */}
            </nav>
            <footer className="p-6 border-t border-gray-200 flex flex-col items-center mt-auto">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-500 hover:text-red-600 font-medium transition-colors duration-200 justify-center"
              >
                <LogoutIcon className="w-5 h-5" />
                <span>Cerrar Sesión</span>
              </button>
            </footer>

          </aside>
        </div>
      )}
    </>
  );
} 