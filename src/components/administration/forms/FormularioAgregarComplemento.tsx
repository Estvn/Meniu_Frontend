"use client";
import * as React from "react";
import { Modal } from "./Modal";
import { DropdownField } from "./DropdownField";
import { Button } from "./Button";
import { FormField } from "./FormField";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { FormularioCrearAlimento } from "./FormularioCrearAlimento";
import { obtenerProductosRestaurante } from "../../../endpoints/administration/productos";
import { agregarComplemento } from "../../../endpoints/administration/complementos";

interface FormularioAgregarComplementoProps {
  onClose?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

interface ComplementFormData {
  busqueda: string;
  categoria: string;
  producto: string;
  complemento: string;
}

interface Producto {
  id_producto: number;
  nombre: string;
  descripcion: string;
  precio: string;
  imagen_url: string;
  activo: number;
  subcategoria: {
    id_subcategoria: number;
    nombre: string;
    activa: number;
    categoria: {
      id_categoria: number;
      nombre: string;
      activa: number;
    };
  };
}

function RHFFormField(props: Omit<React.ComponentProps<typeof FormField>, "value" | "onChange"> & { name: keyof ComplementFormData; validation?: Record<string, unknown> }) {
  const { setValue, formState: { errors, touchedFields }, watch } = useFormContext<ComplementFormData>();
  const value = watch(props.name);
  const errorMsg = errors[props.name]?.message as string | undefined;
  
  return (
    <div className="w-full">
      <FormField
        {...props}
        value={typeof value === "string" ? value : ""}
        onChange={(v) => setValue(props.name, v, { shouldValidate: true })}
      />
      {errorMsg && touchedFields[props.name] && (
        <span className="mt-1 text-xs text-red-500">{errorMsg}</span>
      )}
    </div>
  );
}

function RHFDropdownField(props: Omit<React.ComponentProps<typeof DropdownField>, "value" | "onChange"> & { name: keyof ComplementFormData; validation?: Record<string, unknown> }) {
  const { setValue, formState: { errors, touchedFields }, watch } = useFormContext<ComplementFormData>();
  const value = watch(props.name);
  const errorMsg = errors[props.name]?.message as string | undefined;
  
  return (
    <div className="w-full">
      <DropdownField
        {...props}
        value={typeof value === "string" ? value : ""}
        onChange={(v) => setValue(props.name, v, { shouldValidate: true })}
      />
      {errorMsg && touchedFields[props.name] && (
        <span className="mt-1 text-xs text-red-500">{errorMsg}</span>
      )}
    </div>
  );
}

export function FormularioAgregarComplemento({
  onClose,
  onSubmit,
  onCancel,
}: FormularioAgregarComplementoProps) {

  const [formMode, setFormMode] = React.useState<"alimento" | "complemento">("complemento");

  // Estado para mantener los datos en memoria
  const [datosEnMemoria, setDatosEnMemoria] = React.useState<{
    productos: Producto[] | null;
    loading: boolean;
    error: string | null;
    timestamp: number;
  }>({
    productos: null,
    loading: false,
    error: null,
    timestamp: 0
  });

  const methods = useForm<ComplementFormData>({
    mode: "onTouched",
    defaultValues: {
      busqueda: "",
      categoria: "",
      producto: "",
      complemento: "",
    },
  });

  // Registrar los campos para validación
  React.useEffect(() => {
    methods.register("busqueda");
    methods.register("categoria", { required: "La categoría es requerida" });
    methods.register("producto", { required: "El producto es requerido" });
    methods.register("complemento", { required: "El complemento es requerido" });
  }, [methods]);

  const busqueda = methods.watch("busqueda");
  const categoriaSeleccionada = methods.watch("categoria");
  const productoSeleccionado = methods.watch("producto");

  // Limpiar campos cuando cambian las selecciones
  React.useEffect(() => {
    if (categoriaSeleccionada) {
      methods.setValue("producto", "");
      methods.setValue("complemento", "");
    }
  }, [categoriaSeleccionada, methods]);

  React.useEffect(() => {
    if (productoSeleccionado) {
      methods.setValue("complemento", "");
    }
  }, [productoSeleccionado, methods]);

  // Función para obtener productos solo si no están en memoria o han expirado
  const obtenerProductos = React.useCallback(async () => {
    console.log("=== INICIANDO OBTENER PRODUCTOS ===");
    const ahora = Date.now();
    const tiempoExpiracion = 5 * 60 * 1000; // 5 minutos
    
    // Si ya tenemos datos válidos en memoria, no hacer petición
    if (datosEnMemoria.productos && 
        !datosEnMemoria.loading && 
        !datosEnMemoria.error && 
        (ahora - datosEnMemoria.timestamp) < tiempoExpiracion) {
      return;
    }

    // Si ya está cargando, no hacer otra petición
    if (datosEnMemoria.loading) {
      return;
    }

    setDatosEnMemoria(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log("Llamando a obtenerProductosRestaurante...");
      const productos = await obtenerProductosRestaurante();
      console.log("Productos obtenidos del endpoint:", productos);
      
      setDatosEnMemoria({
        productos,
        loading: false,
        error: null,
        timestamp: ahora
      });

    } catch (error) {
      console.error("Error obteniendo productos:", error);
      setDatosEnMemoria({
        productos: null,
        loading: false,
        error: error instanceof Error ? error.message : "Error desconocido",
        timestamp: ahora
      });
    }
  }, []); // Removí la dependencia datosEnMemoria para evitar el loop infinito

  // Cargar productos solo cuando se necesita (cuando se muestra el formulario de complementos)
  React.useEffect(() => {
    if (formMode === "complemento") {
      obtenerProductos();
    }
  }, [formMode]); // Removí obtenerProductos de las dependencias

  // Datos de prueba temporales para verificar la lógica
  const productosPrueba: Producto[] = [
    {
      id_producto: 1,
      nombre: "Hamburguesa Clásica",
      descripcion: "Hamburguesa con carne, lechuga y tomate",
      precio: "150.00",
      imagen_url: "",
      activo: 1,
      subcategoria: {
        id_subcategoria: 1,
        nombre: "Hamburguesas",
        activa: 1,
        categoria: {
          id_categoria: 1,
          nombre: "Comida",
          activa: 1
        }
      }
    },
    {
      id_producto: 2,
      nombre: "Coca Cola",
      descripcion: "Bebida gaseosa",
      precio: "25.00",
      imagen_url: "",
      activo: 1,
      subcategoria: {
        id_subcategoria: 2,
        nombre: "Gaseosas",
        activa: 1,
        categoria: {
          id_categoria: 2,
          nombre: "Bebidas",
          activa: 1
        }
      }
    },
    {
      id_producto: 3,
      nombre: "Papas Fritas",
      descripcion: "Papas fritas crujientes",
      precio: "30.00",
      imagen_url: "",
      activo: 1,
      subcategoria: {
        id_subcategoria: 3,
        nombre: "Acompañamientos",
        activa: 1,
        categoria: {
          id_categoria: 3,
          nombre: "Complementos",
          activa: 1
        }
      }
    }
  ];

  // Usar datos de memoria o datos de prueba si no hay productos cargados
  const productosFinales = datosEnMemoria.productos && datosEnMemoria.productos.length > 0 
    ? datosEnMemoria.productos 
    : productosPrueba;

  // Obtener categorías únicas (excluyendo complementos)
  const categorias = React.useMemo(() => {
    if (!productosFinales) return [];
    
    const categoriasUnicas = new Map();
    productosFinales.forEach((producto: Producto) => {
      const categoria = producto.subcategoria.categoria;
      // Excluir categorías que contengan "complemento" en el nombre
      if (!categoria.nombre.toLowerCase().includes('complemento')) {
        categoriasUnicas.set(categoria.id_categoria, {
          id: categoria.id_categoria,
          nombre: categoria.nombre
        });
      }
    });
    
    return Array.from(categoriasUnicas.values());
  }, [productosFinales]);

  // Obtener productos de la categoría seleccionada
  const productosCategoria = React.useMemo(() => {
    if (!productosFinales || !categoriaSeleccionada) return [];
    
    return productosFinales.filter((producto: Producto) => 
      producto.subcategoria.categoria.id_categoria.toString() === categoriaSeleccionada
    );
  }, [productosFinales, categoriaSeleccionada]);

  // Obtener complementos (productos con categoría complemento)
  const complementos = React.useMemo(() => {
    if (!productosFinales) return [];
    
    return productosFinales.filter((producto: Producto) => 
      producto.subcategoria.categoria.nombre.toLowerCase().includes('complemento')
    );
  }, [productosFinales]);

  // Filtrar productos por búsqueda (nombre o categoría)
  const productosFiltrados = React.useMemo(() => {
    if (!productosFinales) return [];
    if (!busqueda) return productosCategoria;
    
    return productosCategoria.filter((producto: Producto) => 
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.subcategoria.categoria.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.subcategoria.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
  }, [productosCategoria, busqueda]);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = React.useState<{
    visible: boolean;
    data: {
      id_producto_principal: number;
      id_producto_complemento: number;
      estado: number;
    } | null;
  }>({ visible: false, data: null });

  const handleSubmit = methods.handleSubmit(async (data) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess({ visible: false, data: null });

      console.log("Datos del formulario:", data);
      
      // Obtener IDs de los productos seleccionados
      const idProductoPrincipal = parseInt(data.producto);
      const idProductoComplemento = parseInt(data.complemento);
      
      // Llamar a la API para agregar el complemento
      const response = await agregarComplemento(idProductoPrincipal, idProductoComplemento);
      
      console.log("Respuesta de la API:", response);
      
      // Mostrar mensaje de éxito con los datos de respuesta
      setSubmitSuccess({
        visible: true,
        data: {
          id_producto_principal: response.id_producto_principal,
          id_producto_complemento: response.id_producto_complemento,
          estado: response.estado
        }
      });
      
      // Limpiar el formulario después del éxito
      methods.reset();
      
      // Llamar al callback de éxito
      onSubmit?.(response);
      
    } catch (error) {
      console.error("Error al procesar complemento:", error);
      setSubmitError(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setIsSubmitting(false);
    }
  });

  const handleCancel = () => {
    onCancel?.();
  };

  // Opciones para el select de categorías
  const categoriaOptions = [
    { value: "", label: "Seleccionar categoría" },
    ...categorias.map(cat => ({
      value: cat.id.toString(),
      label: cat.nombre
    }))
  ];

  // Opciones para el select de productos
  const productoOptions = [
    { value: "", label: "Seleccionar producto" },
    ...productosFiltrados.map((producto: Producto) => ({
      value: producto.id_producto.toString(),
      label: `${producto.nombre} - Lps. ${producto.precio}`
    }))
  ];

  // Opciones para el select de complementos
  const complementoOptions = [
    { value: "", label: "Seleccionar complemento" },
    ...complementos.map((complemento: Producto) => ({
      value: complemento.id_producto.toString(),
      label: `${complemento.nombre} - Lps. ${complemento.precio}`
    }))
  ];

  return (
    <Modal onClose={onClose}>
      <div className="flex flex-col w-full max-w-md mx-auto">
        {/* Botones de navegación más pequeños */}
        <div className="flex gap-1 mb-4 mt-12 pt-2">
          <Button
            variant={formMode === "alimento" ? "primary" : "secondary"}
            onClick={() => setFormMode("alimento")}
            type="button"
            className="flex-1 text-xs py-0.5 px-2"
          >
            Agregar Alimento
          </Button>
          <Button
            variant={formMode === "complemento" ? "primary" : "secondary"}
            onClick={() => setFormMode("complemento")}
            type="button"
            className="flex-1 text-xs py-0.5 px-2"
          >
            Agregar Complemento
          </Button>
        </div>

        {/* Contenido del formulario */}
        {formMode === "complemento" ? (
          <FormProvider {...methods}>
            <form
              className="flex relative flex-col shrink-0 gap-3.5 items-start self-stretch"
              onSubmit={handleSubmit}
            >
              <header className="flex relative flex-col items-start self-stretch">
                <h1 className="relative text-base font-bold leading-6 text-gray-900 max-sm:text-sm">
                  Agregar Complemento en Alimento
                </h1>
              </header>

              {submitError && (
                <div className="w-full text-center py-4">
                  <p className="text-red-600">{submitError}</p>
                </div>
              )}



              {datosEnMemoria.loading && (
                <div className="w-full text-center py-4">
                  <p className="text-gray-600">Cargando productos...</p>
                </div>
              )}

              {datosEnMemoria.error && (
                <div className="w-full text-center py-4">
                  <p className="text-red-600">Error al cargar productos: {datosEnMemoria.error}</p>
                </div>
              )}

              {!datosEnMemoria.loading && !datosEnMemoria.error && productosFinales && productosFinales.length === 0 && (
                <div className="w-full text-center py-4">
                  <p className="text-gray-600">No hay productos disponibles</p>
                </div>
              )}

              {!datosEnMemoria.loading && !datosEnMemoria.error && productosFinales && productosFinales.length > 0 && (
                <>
                  {/* Select de Categorías */}
                  <div className="w-full">
                    <RHFDropdownField
                      name="categoria"
                      label="Categoría"
                      options={categoriaOptions}
                      containerClassName="w-full"
                      validation={{ required: "La categoría es requerida" }}
                      disabled={datosEnMemoria.loading}
                    />
                    {!categoriaSeleccionada && (
                      <p className="mt-1 text-xs text-gray-500">
                        Selecciona una categoría para ver los productos disponibles
                      </p>
                    )}
                  </div>

                  {/* Buscador de Productos */}
                  {categoriaSeleccionada && (
                    <div className="w-full">
                      <RHFFormField
                        name="busqueda"
                        label="Buscar Producto"
                        placeholder="Buscar por nombre, descripción o subcategoría..."
                        containerClassName="w-full"
                      />
                      {busqueda && productosFiltrados.length === 0 && (
                        <p className="mt-1 text-xs text-gray-500">
                          No se encontraron productos con esa búsqueda
                        </p>
                      )}
                    </div>
                  )}

                  {/* Select de Productos */}
                  {categoriaSeleccionada && (
                    <div className="w-full">
                      <RHFDropdownField
                        name="producto"
                        label="Producto"
                        options={productoOptions}
                        containerClassName="w-full"
                        validation={{ required: "El producto es requerido" }}
                        disabled={datosEnMemoria.loading}
                      />
                      {productosFiltrados.length === 0 && !busqueda && (
                        <p className="mt-1 text-xs text-gray-500">
                          No hay productos disponibles en esta categoría
                        </p>
                      )}
                    </div>
                  )}

                  {/* Select de Complementos */}
                  <div className="w-full">
                    <RHFDropdownField
                      name="complemento"
                      label="Complemento"
                      options={complementoOptions}
                      containerClassName="w-full"
                      validation={{ required: "El complemento es requerido" }}
                      disabled={!productoSeleccionado || complementos.length === 0}
                    />
                    {!productoSeleccionado && (
                      <p className="mt-1 text-xs text-gray-500">
                        Selecciona un producto primero para ver los complementos disponibles
                      </p>
                    )}
                    {complementos.length === 0 && (
                      <p className="mt-1 text-xs text-gray-500">
                        No hay complementos disponibles
                      </p>
                    )}
                  </div>
                </>
              )}
              
              <div className="flex gap-2 justify-end w-full pt-4">
                <Button
                  variant="secondary"
                  onClick={handleCancel}
                  type="button"
                  className="max-sm:w-full"
                >
                  Cancelar
                </Button>
                <Button 
                  variant="primary" 
                  type="submit" 
                  className="max-sm:w-full"
                  disabled={isSubmitting || !productoSeleccionado || !categoriaSeleccionada}
                >
                  {isSubmitting ? "Agregando complemento..." : "Agregar Complemento"}
                </Button>
              </div>
              
            </form>
          </FormProvider>
        ) : (
          // Mostrar el formulario de alimento cuando se selecciona esa opción
          <div className="w-full">
            <FormularioCrearAlimento
              onClose={onClose}
              onSubmit={(data) => {
                console.log("Datos del formulario de alimento:", data);
                onSubmit?.(data);
              }}
              onCancel={onCancel}
              mode="create"
            />
          </div>
        )}
      </div>
      
      {/* Modal de Éxito */}
      {submitSuccess.visible && submitSuccess.data && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ¡Creación Exitosa!
              </h3>
              <p className="text-gray-600 mb-4">
                La relación entre el producto y el complemento se ha creado correctamente.
              </p>
              <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm">
                <p className="text-gray-700">
                  <strong>Producto Principal:</strong> {(() => {
                    if (!submitSuccess.data) return '';
                    const prod = productosFinales.find(p => p.id_producto === submitSuccess.data!.id_producto_principal);
                    return prod ? prod.nombre : `ID: ${submitSuccess.data!.id_producto_principal}`;
                  })()}
                </p>
                <p className="text-gray-700">
                  <strong>Complemento:</strong> {(() => {
                    if (!submitSuccess.data) return '';
                    const comp = productosFinales.find(p => p.id_producto === submitSuccess.data!.id_producto_complemento);
                    return comp ? comp.nombre : `ID: ${submitSuccess.data!.id_producto_complemento}`;
                  })()}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSubmitSuccess({ visible: false, data: null });
                  onClose?.();
                }}
                className="w-full bg-gb-orange-500 text-white py-2 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50"
                style={{ opacity: 1, backgroundColor: '#f97316', visibility: 'visible' }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default FormularioAgregarComplemento;