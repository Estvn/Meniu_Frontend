"use client";
import * as React from "react";
import { Modal } from "./Modal";
import { FormField } from "./FormField";
import { TextareaField } from "./TextareaField";
import { DropdownField } from "./DropdownField";
import { FileUploadField } from "./FileUploadField";
import { Button } from "./Button";
import { FormularioAgregarComplemento } from "./FormularioAgregarComplemento";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { obtenerCategorias } from "../../../endpoints/administration/categorias";
import { crearProducto, actualizarProducto, type ActualizarProductoRequest } from "../../../endpoints/administration/productos";
import { uploadImageToDrive, deleteImageFromDrive } from "../../../assets/scripts/googleDrive/uploadImage";
import type { Categoria } from "../../../interfaces/Category";

interface FormularioCrearAlimentoProps {
  onClose?: () => void;
  onSubmit?: (data: FoodFormData | { busqueda: string; producto: string; complemento: string }) => void;
  onCancel?: () => void;
  mode?: "create" | "edit";
  initialData?: FoodFormData;
  productId?: number;
  currentImageUrl?: string;
}

interface FoodFormData {
  name: string;
  description: string;
  price: string;
  categoria: string;
  subcategoria: string;
  photo: File | null;
}



function RHFFormField(props: Omit<React.ComponentProps<typeof FormField>, "value" | "onChange"> & { name: keyof FoodFormData; validation?: Record<string, unknown> }) {
  const { setValue, formState: { errors, touchedFields }, watch } = useFormContext<FoodFormData>();
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

function RHFTextareaField(props: Omit<React.ComponentProps<typeof TextareaField>, "value" | "onChange"> & { name: keyof FoodFormData; validation?: Record<string, unknown> }) {
  const { setValue, formState: { errors, touchedFields }, watch } = useFormContext<FoodFormData>();
  const value = watch(props.name);
  const errorMsg = errors[props.name]?.message as string | undefined;
  
  return (
    <div className="w-full">
      <TextareaField
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

function RHFDropdownField(props: Omit<React.ComponentProps<typeof DropdownField>, "value" | "onChange"> & { name: keyof FoodFormData; validation?: Record<string, unknown> }) {
  const { setValue, formState: { errors, touchedFields }, watch } = useFormContext<FoodFormData>();
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

function RHFFileUploadField(props: Omit<React.ComponentProps<typeof FileUploadField>, "onChange"> & { name: keyof FoodFormData; validation?: Record<string, unknown> }) {
  const { setValue, formState: { errors, touchedFields }, watch } = useFormContext<FoodFormData>();
  const selectedFile = watch(props.name) as File | null;
  const errorMsg = errors[props.name]?.message as string | undefined;
  
  return (
    <div className="w-full">
      <FileUploadField
        {...props}
        selectedFile={selectedFile}
        onChange={(file) => setValue(props.name, file)}
      />
      {errorMsg && touchedFields[props.name] && (
        <span className="mt-1 text-xs text-red-500">{errorMsg}</span>
      )}
    </div>
  );
}

export function FormularioCrearAlimento({
  onClose,
  onSubmit,
  onCancel,
  mode = "create",
  initialData,
  productId,
  currentImageUrl,
}: FormularioCrearAlimentoProps) {
  const [formMode, setFormMode] = React.useState<"alimento" | "complemento">("alimento");
  const [categorias, setCategorias] = React.useState<Categoria[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const methods = useForm<FoodFormData>({
    mode: "onTouched",
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      price: initialData?.price || "",
      categoria: initialData?.categoria || "",
      subcategoria: initialData?.subcategoria || "",
      photo: initialData?.photo || null,
    },
  });

  // Registrar los campos para validación
  React.useEffect(() => {
    methods.register("name", { required: "El nombre es requerido" });
    methods.register("description", { required: "La descripción es requerida" });
    methods.register("price", { 
      required: "El precio es requerido",
      validate: (v: string) => (parseFloat(v) > 0 ? true : "El precio debe ser mayor a 0")
    });
    methods.register("categoria", { required: "La categoría es requerida" });
    methods.register("subcategoria", { required: "La subcategoría es requerida" });
    // Solo hacer la foto requerida en modo creación
    if (mode === "create") {
      methods.register("photo", { required: "La fotografía es requerida" });
    } else {
      methods.register("photo", {}); // No requerida en modo edición
    }
  }, [methods, mode]);

  const categoriaSeleccionada = methods.watch("categoria");

  // Cargar categorías al montar el componente
  React.useEffect(() => {
    const cargarCategorias = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await obtenerCategorias();
        setCategorias(data);
      } catch (err) {
        setError("Error al cargar las categorías");
        console.error("Error cargando categorías:", err);
      } finally {
        setLoading(false);
      }
    };

    cargarCategorias();
  }, []);

  // Establecer valores iniciales cuando se cargan las categorías en modo edición
  React.useEffect(() => {
    if (mode === "edit" && initialData && categorias.length > 0) {
      // Asegurar que la categoría y subcategoría estén establecidas correctamente
      if (initialData.categoria) {
        methods.setValue("categoria", initialData.categoria);
      }
      if (initialData.subcategoria) {
        methods.setValue("subcategoria", initialData.subcategoria);
      }
    }
  }, [categorias, mode, initialData, methods]);

  // Limpiar subcategoría cuando cambia la categoría (solo en modo creación)
  React.useEffect(() => {
    if (categoriaSeleccionada && mode === "create") {
      methods.setValue("subcategoria", "");
    }
  }, [categoriaSeleccionada, methods, mode]);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const handleSubmit = methods.handleSubmit(async (data) => {
    console.log("Iniciando submit con datos:", data);
    console.log("Modo:", mode);
    console.log("ProductId:", productId);
    console.log("CurrentImageUrl:", currentImageUrl);
    
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // Preparar datos base para la API (imagen se agregará después)
      const productoData: ActualizarProductoRequest = {
        nombre: data.name,
        descripcion: data.description,
        precio: parseFloat(data.price),
        id_subcategoria: parseInt(data.subcategoria),
        activo: 1,
        imagen: "" // Se actualizará después
      };

      // Solo manejar imagen si se sube una nueva
      if (data.photo) {
        console.log("Nueva imagen detectada, procesando...");
        
        // Generar nombre único para la imagen
        const timestamp = Date.now();
        const fileName = `alimento_${timestamp}_${data.photo.name}`;

        try {
          console.log("Subiendo nueva imagen a Google Drive...");
          const imageUrl = await uploadImageToDrive(data.photo, fileName);
          console.log("Nueva imagen subida exitosamente:", imageUrl);
          productoData.imagen = imageUrl;

          // Si estamos en modo edición y hay una imagen anterior, eliminarla
          if (mode === "edit" && currentImageUrl && currentImageUrl !== imageUrl) {
            try {
              console.log("Eliminando imagen anterior de Drive...");
              await deleteImageFromDrive(currentImageUrl);
              console.log("Imagen anterior eliminada exitosamente");
            } catch (deleteError) {
              // Solo mostrar warning, no fallar la operación
              console.warn("No se pudo eliminar la imagen anterior (puede que ya no exista):", deleteError);
            }
          }
        } catch (error) {
          console.warn("Error al subir a Google Drive, usando URL temporal:", error);
          productoData.imagen = `https://via.placeholder.com/400x300/cccccc/666666?text=${encodeURIComponent(data.photo.name)}`;
        }
      } else if (mode === "create") {
        // Solo en modo creación es obligatoria la imagen
        throw new Error("Debe seleccionar una imagen");
      } else {
        // En modo edición sin nueva imagen, usar la imagen actual
        if (currentImageUrl) {
          productoData.imagen = currentImageUrl;
          console.log("Usando imagen actual:", currentImageUrl);
        } else {
          // Si no hay imagen actual, usar una imagen por defecto
          productoData.imagen = "https://via.placeholder.com/400x300/cccccc/666666?text=Sin+Imagen";
          console.log("No hay imagen actual, usando imagen por defecto");
        }
      }

      console.log("Enviando datos del producto:", productoData);

      let response;
      if (mode === "edit" && productId) {
        // Actualizar producto existente
        console.log("Actualizando producto con ID:", productId);
        response = await actualizarProducto(productId, productoData);
        console.log("Producto actualizado exitosamente:", response);
      } else {
        // Crear nuevo producto
        console.log("Creando nuevo producto");
        response = await crearProducto(productoData);
        console.log("Producto creado exitosamente:", response);
      }

      // Llamar al callback de éxito
      onSubmit?.(data);
      
    } catch (error) {
      console.error("Error al procesar producto:", error);
      console.log("Errores de validación:", methods.formState.errors);
      setSubmitError(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setIsSubmitting(false);
    }
  });

  const handleCancel = () => {
    onCancel?.();
  };

  const handleComplementoSubmit = (data: { busqueda: string; producto: string; complemento: string }) => {
    onSubmit?.(data);
  };

  // Obtener las opciones de categorías
  const categoriaOptions = [
    { value: "", label: "Seleccionar categoría" },
    ...categorias.map(cat => ({
      value: cat.id_categoria.toString(),
      label: cat.nombre
    }))
  ];

  // Obtener las subcategorías de la categoría seleccionada
  const categoriaActual = categorias.find(cat => cat.id_categoria.toString() === categoriaSeleccionada);
  const subcategoriaOptions = [
    { value: "", label: "Seleccionar subcategoría" },
    ...(categoriaActual?.subcategorias.map(sub => ({
      value: sub.id_subcategoria.toString(),
      label: sub.nombre
    })) || [])
  ];



  const isEditMode = mode === "edit";
  const title = isEditMode ? "Editar Alimento del Menú" : "Agregar Alimento al Menú";
  const buttonText = isEditMode ? "Actualizar" : "Agregar";

  return (
    <Modal onClose={onClose}>
      <div className="flex flex-col w-full max-w-md mx-auto">
        {/* Botones de navegación */}
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
        {formMode === "alimento" ? (
          <FormProvider {...methods}>
            <form
              className="flex relative flex-col shrink-0 gap-3.5 items-start self-stretch"
              onSubmit={handleSubmit}
            >
              <header className="flex relative flex-col items-start self-stretch">
                <h1 className="relative text-base font-bold leading-6 text-gray-900 max-sm:text-sm">
                  {title}
                </h1>
              </header>

          {loading && (
            <div className="w-full text-center py-4">
              <p className="text-gray-600">Cargando categorías...</p>
            </div>
          )}

          {error && (
            <div className="w-full text-center py-4">
              <p className="text-red-600">{error}</p>
              {error.includes("token") && (
                <p className="text-sm text-gray-600 mt-2">
                  Por favor, asegúrate de estar logueado en la aplicación.
                </p>
              )}
            </div>
          )}

          {submitError && (
            <div className="w-full text-center py-4">
              <p className="text-red-600">{submitError}</p>
            </div>
          )}

          {!loading && !error && (
            <>
              <RHFFormField
                name="name"
                label="Nombre del Alimento"
                placeholder="Nombre del Alimento"
                required
                validation={{ required: "El nombre es requerido" }}
              />
              <RHFTextareaField
                name="description"
                label="Descripción"
                placeholder="Descripción del alimento"
                required
                validation={{ required: "La descripción es requerida" }}
              />
              <div className="flex relative gap-3.5 justify-center items-start self-stretch max-sm:flex-col max-sm:gap-2.5">
                <RHFFormField
                  name="price"
                  label="Precio (Lps)"
                  placeholder="0.00"
                  type="number"
                  step="0.01"
                  containerClassName="w-[161px] max-sm:w-full"
                  required
                  validation={{
                    required: "El precio es requerido",
                    validate: (v: string) => (parseFloat(v) > 0 ? true : "El precio debe ser mayor a 0"),
                  }}
                />
                
                <RHFDropdownField
                  name="categoria"
                  label="Categoría"
                  options={categoriaOptions}
                  containerClassName="w-[161px] max-sm:w-full"
                  validation={{ required: "La categoría es requerida" }}
                />
              </div>

              <div className="w-full">
                <RHFDropdownField
                  name="subcategoria"
                  label={`Subcategoría${categoriaSeleccionada ? ` (${categoriaActual?.nombre || ''})` : ''}`}
                  options={subcategoriaOptions}
                  containerClassName="w-full"
                  validation={{ required: "La subcategoría es requerida" }}
                  disabled={!categoriaSeleccionada}
                />
                {!categoriaSeleccionada && (
                  <p className="mt-1 text-xs text-gray-500">
                    Selecciona una categoría primero para ver las subcategorías disponibles
                  </p>
                )}
              </div>
              
              <RHFFileUploadField
                name="photo"
                label="Fotografía"
                placeholder="Desplace o presione para subir una imagen"
                accept="image/*"
                validation={mode === "create" ? { required: "La fotografía es requerida" } : {}}
              />
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
              disabled={loading || isSubmitting}
            >
              {isSubmitting ? "Creando producto..." : buttonText}
            </Button>
          </div>
          
        </form>
      </FormProvider>
        ) : (
          <FormularioAgregarComplemento
            onClose={onClose}
            onSubmit={handleComplementoSubmit}
            onCancel={onCancel}
          />
        )}
      </div>
    </Modal>
  );
}

export default FormularioCrearAlimento;
