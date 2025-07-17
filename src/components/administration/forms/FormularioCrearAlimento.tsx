"use client";
import * as React from "react";
import { Modal } from "./Modal";
import { FormField } from "./FormField";
import { TextareaField } from "./TextareaField";
import { DropdownField } from "./DropdownField";
import { FileUploadField } from "./FileUploadField";
import { Button } from "./Button";
import { useForm, FormProvider, useFormContext } from "react-hook-form";

interface FormularioCrearAlimentoProps {
  onClose?: () => void;
  onSubmit?: (data: FoodFormData) => void;
  onCancel?: () => void;
  mode?: "create" | "edit";
  initialData?: FoodFormData;
}

interface FoodFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  photo: File | null;
}

function RHFFormField(props: Omit<React.ComponentProps<typeof FormField>, "value" | "onChange"> & { name: keyof FoodFormData; validation?: Record<string, unknown> }) {
  const { register, formState: { errors, touchedFields }, watch } = useFormContext<FoodFormData>();
  const value = watch(props.name);
  const errorMsg = errors[props.name]?.message as string | undefined;
  const field = register(props.name, props.validation);
  return (
    <div className="w-full">
      <FormField
        {...props}
        value={typeof value === "string" ? value : ""}
        onChange={(v) => field.onChange({ target: { value: v } })}
      />
      {errorMsg && touchedFields[props.name] && (
        <span className="mt-1 text-xs text-red-500">{errorMsg}</span>
      )}
    </div>
  );
}

function RHFTextareaField(props: Omit<React.ComponentProps<typeof TextareaField>, "value" | "onChange"> & { name: keyof FoodFormData; validation?: Record<string, unknown> }) {
  const { register, formState: { errors, touchedFields }, watch } = useFormContext<FoodFormData>();
  const value = watch(props.name);
  const errorMsg = errors[props.name]?.message as string | undefined;
  const field = register(props.name, props.validation);
  return (
    <div className="w-full">
      <TextareaField
        {...props}
        value={typeof value === "string" ? value : ""}
        onChange={(v) => field.onChange({ target: { value: v } })}
      />
      {errorMsg && touchedFields[props.name] && (
        <span className="mt-1 text-xs text-red-500">{errorMsg}</span>
      )}
    </div>
  );
}

function RHFDropdownField(props: Omit<React.ComponentProps<typeof DropdownField>, "value" | "onChange"> & { name: keyof FoodFormData; validation?: Record<string, unknown> }) {
  const { register, formState: { errors, touchedFields }, watch } = useFormContext<FoodFormData>();
  const value = watch(props.name);
  const errorMsg = errors[props.name]?.message as string | undefined;
  const field = register(props.name, props.validation);
  return (
    <div className="w-full">
      <DropdownField
        {...props}
        value={typeof value === "string" ? value : ""}
        onChange={(v) => field.onChange({ target: { value: v } })}
      />
      {errorMsg && touchedFields[props.name] && (
        <span className="mt-1 text-xs text-red-500">{errorMsg}</span>
      )}
    </div>
  );
}

function RHFFileUploadField(props: Omit<React.ComponentProps<typeof FileUploadField>, "onChange"> & { name: keyof FoodFormData; validation?: Record<string, unknown> }) {
  const { setValue, formState: { errors, touchedFields } } = useFormContext<FoodFormData>();
  const errorMsg = errors[props.name]?.message as string | undefined;
  return (
    <div className="w-full">
      <FileUploadField
        {...props}
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
}: FormularioCrearAlimentoProps) {
  const methods = useForm<FoodFormData>({
    mode: "onTouched",
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      price: initialData?.price || "",
      category: initialData?.category || "",
      photo: initialData?.photo || null,
    },
  });

  const handleSubmit = methods.handleSubmit((data) => {
    onSubmit?.(data);
  });

  const handleCancel = () => {
    onCancel?.();
  };

  const categoryOptions = [
    { value: "", label: "Seleccionar categoría" },
    { value: "appetizer", label: "Aperitivos" },
    { value: "main", label: "Platos principales" },
    { value: "dessert", label: "Postres" },
    { value: "beverage", label: "Bebidas" },
  ];

  const isEditMode = mode === "edit";
  const title = isEditMode ? "Editar Alimento del Menú" : "Agregar Alimento al Menú";
  const buttonText = isEditMode ? "Actualizar" : "Agregar";

  return (
    <Modal onClose={onClose}>
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
              name="category"
              label="Categoría"
              options={categoryOptions}
              containerClassName="w-[161px] max-sm:w-full"
              validation={{ required: "La categoría es requerida" }}
            />
          </div>
          
          <RHFFileUploadField
            name="photo"
            label="Fotografía"
            placeholder="Desplace o presione para subir una imagen"
            accept="image/*"
            validation={{ required: "La fotografía es requerida" }}
          />
          
          <div className="flex gap-2 justify-end w-full pt-4">
            <Button
              variant="secondary"
              onClick={handleCancel}
              type="button"
              className="max-sm:w-full"
            >
              Cancelar
            </Button>
            <Button variant="primary" type="submit" className="max-sm:w-full">
              {buttonText}
            </Button>
          </div>
          
        </form>
      </FormProvider>
    </Modal>
  );
}

export default FormularioCrearAlimento;
