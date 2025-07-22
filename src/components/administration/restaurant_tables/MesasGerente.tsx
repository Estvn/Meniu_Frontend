"use client";
import { HeaderNavBar } from "../navbar/HeaderNavBar";
import { SearchSection } from "./SearchSection";
import { StatsSection } from "./StatsSection";
import { TablesList } from "./TablesList";
import { ModalRegistrarMesa } from "../forms/ModalRegistrarMesa";
import { useState } from "react";
import { ModalQRMesa } from "../forms/ModalQRMesa";
import { ModalEliminarMesa } from "../forms/ModalEliminarMesa";
import { useEffect } from "react";

interface Mesa {
  id_mesa: number;
  numero_mesa: number;
  qr_code: string;
  estado_mesa: string;
}

export const MesasGerente = () => {
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showRegistrarMesa, setShowRegistrarMesa] = useState(false);
  const [qrMesa, setQrMesa] = useState<{ id: number; qr_code: string; numero_mesa?: number } | null>(null);
  const [mesaAEliminar, setMesaAEliminar] = useState<number | null>(null);
  const [actionType, setActionType] = useState<'activate' | 'deactivate'>('deactivate');
  const [filter, setFilter] = useState<'todas' | 'activa' | 'inactiva'>('todas');

  const fetchMesas = async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }
    try {
      const token = sessionStorage.getItem('access_token');
      const res = await fetch('http://localhost:3000/mesas/restaurante-mesas', {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      console.log('Respuesta de mesas:', data);
      setMesas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar mesas:', error);
    } finally {
      if (showLoading) {
        setLoading(false);
      } else {
        setRefreshing(false);
      }
    }
  };

  useEffect(() => {
    fetchMesas();
  }, []);

  const handleSearch = (query: string) => {
    // query will be 'todas', 'activa', or 'inactiva'
    if (query === 'activa' || query === 'inactiva' || query === 'todas') {
      setFilter(query);
    }
  };

  // Filtrar mesas según el filtro seleccionado
  const filteredMesas = mesas.filter((m) => {
    if (filter === 'todas') return true;
    if (filter === 'activa') return m.estado_mesa === 'Activa';
    if (filter === 'inactiva') return m.estado_mesa !== 'Activa';
    return true;
  });

  const handleOpenRegistrarMesa = () => setShowRegistrarMesa(true);
  const handleCloseRegistrarMesa = () => setShowRegistrarMesa(false);
  const handleSubmitRegistrarMesa = () => {
    setShowRegistrarMesa(false);
    // Refrescar mesas después de registrar sin mostrar loading
    fetchMesas(false);
  };

  const handleDeleteMesa = (id: number) => {
    // Determinar si la mesa está activa o inactiva para saber qué acción realizar
    const mesa = mesas.find((m) => m.id_mesa === id);
    if (mesa) {
      const isActivate = mesa.estado_mesa === 'Inactiva';
      setActionType(isActivate ? 'activate' : 'deactivate');
    }
    setMesaAEliminar(id);
  };
  const handleCloseEliminarMesa = () => {
    setMesaAEliminar(null);
  };
  const handleConfirmEliminarMesa = async () => {
    try {
      if (!mesaAEliminar) return;
      
      const newEstado = actionType === 'activate' ? 'Activa' : 'Inactiva';
      const actionText = actionType === 'activate' ? 'activada' : 'desactivada';
      
      const token = sessionStorage.getItem('access_token');
      const response = await fetch(`http://localhost:3000/mesas/actualizar-mesa-ln/${mesaAEliminar}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'accept': 'application/json',
        },
        body: JSON.stringify({
          estado_mesa: newEstado
        }),
      });
      
      if (response.ok) {
        console.log(`✅ Mesa ${actionText} correctamente`);
        // Refrescar la lista de mesas sin mostrar loading
        fetchMesas(false);
      } else {
        const errorData = await response.json();
        console.error(`❌ Error ${actionText} mesa:`, errorData);
        alert(`Error al ${actionText} la mesa. Inténtalo de nuevo.`);
      }
    } catch (error) {
      console.error('❌ Error en la petición:', error);
      alert('Error de conexión al cambiar el estado de la mesa.');
    } finally {
      setMesaAEliminar(null);
    }
  };

  const handleViewQR = (id: number, _qr_code: string, numero_mesa: number) => {
    // Generar la URL del QR con la estructura específica
    const restauranteId = getRestauranteIdFromToken();
    console.log('🔍 handleViewQR - restauranteId:', restauranteId);
    console.log('🔍 handleViewQR - numero_mesa:', numero_mesa);
    
    if (restauranteId) {
      const qrContent = `192.168.1.28:5173/cliente?id_restaurante=${restauranteId}&id_mesa=${id}&num_mesa=${numero_mesa}`;
      console.log('🔍 handleViewQR - qrContent URL:', qrContent);
      setQrMesa({ id, qr_code: qrContent, numero_mesa });
    } else {
      // Si no se puede obtener el restaurante_id, mostrar error
      console.error('❌ No se pudo obtener el ID del restaurante del token');
      alert('Error: No se pudo obtener la información del restaurante. Inténtalo de nuevo.');
    }
  };

  // Función para obtener restaurante_id del token (copiada de ModalRegistrarMesa)
  function getRestauranteIdFromToken() {
    const token = sessionStorage.getItem('access_token');
    if (!token) return null;
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const payload = JSON.parse(jsonPayload);
      return payload.restaurante_id;
    } catch {
      return null;
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <HeaderNavBar title="Mesas" subtitle="Gestión de Mesa" />
      <div className="flex-1 flex flex-col pt-16 sm:pt-18 md:pt-20">
        <SearchSection onSearch={handleSearch} />
        <StatsSection
          totalTables={filteredMesas.length}
          onRegisterNewTable={handleOpenRegistrarMesa}
        />
        {loading && mesas.length === 0 ? (
          <div className="text-center py-8">Cargando mesas...</div>
        ) : (
          <div className="relative">
            {refreshing && (
              <div className="absolute top-2 right-2 z-10">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
              </div>
            )}
            <TablesList
              tables={Array.isArray(filteredMesas) ? filteredMesas.map((m) => ({
                id: m.id_mesa.toString(),
                qr_code: m.qr_code,
                numero_mesa: m.numero_mesa,
                estado_mesa: m.estado_mesa,
              })) : []}
              onDeactivateTable={(id) => handleDeleteMesa(Number(id))}
              onViewQR={(id) => {
                const mesa = mesas.find((m) => m.id_mesa.toString() === id);
                if (mesa) handleViewQR(mesa.id_mesa, mesa.qr_code, mesa.numero_mesa);
              }}
            />
          </div>
        )}
        {showRegistrarMesa && (
          <ModalRegistrarMesa
            onClose={handleCloseRegistrarMesa}
            onCancel={handleCloseRegistrarMesa}
            onSubmit={handleSubmitRegistrarMesa}
          />
        )}
        {qrMesa && (
          <ModalQRMesa
            mesaId={qrMesa.numero_mesa?.toString() ?? qrMesa.id.toString()}
            qrValue={qrMesa.qr_code}
            onClose={() => setQrMesa(null)}
          />
        )}
        {mesaAEliminar && (
          <ModalEliminarMesa
            actionType={actionType}
            onClose={handleCloseEliminarMesa}
            onCancel={handleCloseEliminarMesa}
            onConfirm={handleConfirmEliminarMesa}
          />
        )}
      </div>
    </main>
  );
};

export default MesasGerente;
