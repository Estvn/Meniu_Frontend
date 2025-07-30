# Vista del Cajero - Meniu Frontend

## 📋 Descripción

La vista del cajero es una interfaz completa y responsiva diseñada para gestionar pedidos, pagos y el flujo de trabajo en el restaurante. Proporciona una experiencia optimizada tanto para dispositivos móviles como de escritorio.

## 🎯 Funcionalidades Principales

### **Dashboard Principal**
- **Estadísticas en tiempo real**: Muestra pedidos realizados, en preparación, listos, entregados y pagados
- **Filtros avanzados**: Búsqueda por número de mesa y filtros por estado de pedido
- **Gestión de estados**: Progresión automática de pedidos (Preparando → Listo → Entregado → Pagado)

### **Gestión de Pedidos**
- **Vista de tarjetas responsivas**: Cada pedido se muestra en una tarjeta con información detallada
- **Expansión de items**: Los pedidos largos se pueden expandir para ver todos los items
- **Acciones contextuales**: Botones específicos según el estado actual del pedido
- **Información detallada**: Número de mesa, hora de creación, items, subtotales y total

## 🏗️ Estructura de Componentes

### **CashierDashboard.tsx**
Componente principal que orquesta toda la vista del cajero.

**Características:**
- Estado global de pedidos
- Filtrado y búsqueda
- Cálculo de estadísticas
- Gestión de cambios de estado

### **CashierNavBar.tsx**
Barra de navegación específica para el cajero.

**Características:**
- Navegación responsiva
- Menú móvil con sidebar
- Información del usuario
- Funcionalidad de logout

### **SearchSection.tsx**
Componente de búsqueda y filtros.

**Características:**
- Barra de búsqueda por número de mesa
- Filtro dropdown para estados
- Filtros rápidos en móvil
- Diseño adaptativo

### **StatsCards.tsx**
Tarjetas de estadísticas del dashboard.

**Características:**
- 5 tarjetas con métricas clave
- Iconos descriptivos
- Colores diferenciados por categoría
- Layout responsivo (1-5 columnas según pantalla)

### **OrdersList.tsx**
Lista de pedidos con tarjetas interactivas.

**Características:**
- Grid responsivo (1-3 columnas)
- Tarjetas expandibles
- Estados visuales diferenciados
- Acciones contextuales
- Vista vacía cuando no hay pedidos

## 🎨 Diseño Responsivo

### **Breakpoints**
- **Mobile**: < 640px - 1 columna, filtros horizontales
- **Tablet**: 640px - 1024px - 2 columnas, navegación optimizada
- **Desktop**: > 1024px - 3 columnas, navegación completa

### **Características Responsivas**
- **Header adaptativo**: Altura y padding ajustables
- **Grid flexible**: Columnas que se adaptan al contenido
- **Sidebar móvil**: Navegación con overlay y animaciones
- **Filtros móviles**: Chips horizontales para filtros rápidos

## 🚀 Estados de Pedidos

### **Flujo de Trabajo**
1. **Preparando** (Amarillo) - En cocina
2. **Listo** (Verde) - Listo para entregar
3. **Entregado** (Púrpura) - Entregado al cliente
4. **Pagado** (Gris) - Pago completado

### **Acciones por Estado**
- **Preparando → Listo**: "Siguiente"
- **Listo → Entregado**: "Entregar"
- **Entregado → Pagado**: "Cobrar"
- **Pagado**: "Completado" (deshabilitado)

## 📱 Experiencia Móvil

### **Optimizaciones**
- **Touch-friendly**: Botones grandes y espaciados
- **Gestos**: Swipe para navegación
- **Overlay**: Sidebar con backdrop blur
- **Filtros rápidos**: Chips horizontales scrolleables

### **Navegación Móvil**
- **Hamburger menu**: Acceso al sidebar
- **Navegación simplificada**: Solo opciones relevantes
- **Logout accesible**: En el footer del sidebar

## 🔧 Configuración

### **Ruta**
La vista está disponible en `/cajero` y está protegida por autenticación.

### **Dependencias**
- React Router DOM para navegación
- Tailwind CSS para estilos
- TypeScript para tipado
- React Query para gestión de estado (preparado para futuras integraciones)

## 🎯 Próximas Mejoras

### **Funcionalidades Planificadas**
- **Integración con API**: Conexión real con backend
- **Notificaciones**: Alertas en tiempo real
- **Impresión**: Generación de tickets
- **Reportes**: Estadísticas avanzadas
- **Múltiples cajeros**: Gestión de sesiones

### **Optimizaciones Técnicas**
- **Caching**: React Query para datos
- **Offline**: Service Worker para funcionalidad offline
- **Performance**: Lazy loading de componentes
- **Testing**: Unit tests y E2E tests

## 📝 Notas de Desarrollo

### **Datos de Ejemplo**
Actualmente usa datos mock para demostración. Los datos reales se integrarán con el backend.

### **Estados de Ejemplo**
```typescript
interface Order {
  id: number;
  mesa_numero: number;
  estado: 'preparando' | 'listo' | 'entregado' | 'pagado';
  total: number;
  items: OrderItem[];
  fecha_creacion: string;
}
```

### **Colores de Estado**
- Preparando: `bg-yellow-100 text-yellow-800`
- Listo: `bg-green-100 text-green-800`
- Entregado: `bg-purple-100 text-purple-800`
- Pagado: `bg-gray-100 text-gray-800` 