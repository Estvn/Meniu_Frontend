"use client";
import { useState, useRef, useEffect } from "react";
import { PersonalIcon } from "../icons/PersonalIcon";
import { MesasIcon } from "../icons/MesasIcon";
import { MenuIcon } from "../icons/MenuIcon";
import { PaperIcon } from "../icons/PaperIcon";
import { PaperIconWhite } from "../icons/PaperIconWhite";
import { MesasIconWhite } from "../icons/MesasIconWhite";
import { PersonalIconWhite } from "../icons/PersonalIconWhite";
import { NavigationItem } from "./NavigationItem";
import { LogoutButton } from "./LogoutButton";
import { LogoutIcon } from "../icons/LogoutIcon";
import { clearStoredAuth, getStoredUserData } from "../../../assets/scripts/values/constValues";

interface HeaderNavBarProps {
  title: string;
  subtitle: string;
}

export function HeaderNavBar({title, subtitle}: HeaderNavBarProps) {
  const location = window.location.pathname;
  const navigate = (path: string) => {
    window.location.pathname = path;
  };
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  
  // Obtener datos del usuario
  const userData = getStoredUserData();
  const userName = userData?.nombre || 'Usuario';

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
        <nav className="hidden sm:flex gap-8 items-center justify-center flex-1 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <NavigationItem
            icon={<PaperIconWhite className="w-5 h-5" />} 
            label="Menú"
            isActive={location.includes("menu")}
            onClick={() => navigate("/menu")}
          />
          <NavigationItem
            icon={<MesasIconWhite className="w-5 h-5" />} 
            label="Mesas"
            isActive={location.includes("mesas")}
            onClick={() => navigate("/mesas")}
          />
          <NavigationItem
            icon={<PersonalIconWhite className="w-5 h-5" />} 
            label="Personal"
            isActive={location.includes("personal")}
            onClick={() => navigate("/personal")}
          />
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
              <LogoutButton onClick={handleLogout} />
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
              <NavigationItem
                icon={<PaperIcon className={`w-6 h-6 ${location.includes("menu") ? "text-gray-300" : "text-gray-500"}`} />}
                label="Menú"
                isActive={location.includes("menu")}
                onClick={() => { setSidebarOpen(false); navigate("/menu"); }}
                textClass={`text-gray-900 ${location.includes("menu") ? "font-bold" : "font-normal"}`}
                itemClass={`w-full flex flex-row items-center justify-center gap-3 rounded-lg transition-colors duration-200 py-3 ${location.includes("menu") ? "bg-gray-100" : "hover:bg-gray-50"}`}
              />
              <NavigationItem
                icon={<MesasIcon className={`w-6 h-6 ${location.includes("mesas") ? "text-gray-300" : "text-gray-500"}`} />}
                label="Mesas"
                isActive={location.includes("mesas")}
                onClick={() => { setSidebarOpen(false); navigate("/mesas"); }}
                textClass={`text-gray-900 ${location.includes("mesas") ? "font-bold" : "font-normal"}`}
                itemClass={`w-full flex flex-row items-center justify-center gap-3 rounded-lg transition-colors duration-200 py-3 ${location.includes("mesas") ? "bg-gray-100" : "hover:bg-gray-50"}`}
              />
              <NavigationItem
                icon={<PersonalIcon className={`w-6 h-6 ${location.includes("personal") ? "text-gray-300" : "text-gray-500"}`} />}
                label="Personal"
                isActive={location.includes("personal")}
                onClick={() => { setSidebarOpen(false); navigate("/personal"); }}
                textClass={`text-gray-900 ${location.includes("personal") ? "font-bold" : "font-normal"}`}
                itemClass={`w-full flex flex-row items-center justify-center gap-3 rounded-lg transition-colors duration-200 py-3 ${location.includes("personal") ? "bg-gray-100" : "hover:bg-gray-50"}`}
              />
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
