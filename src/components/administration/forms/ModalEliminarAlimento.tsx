"use client";
import * as React from "react";
import { Modal } from "./Modal";
import { FormField } from "./FormField";
import { Button } from "./Button";
import { useForm, FormProvider, useFormContext } from "react-hook-form";

interface ModalEliminarConfirmacionProps {
  onClose?: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  title?: string;
}

interface DeleteFormData {
  confirmation: string;
}

function RHFDeleteField(props: Omit<React.ComponentProps<typeof FormField>, "value" | "onChange"> & { name: keyof DeleteFormData }) {
  const { setValue, formState: { errors, touchedFields }, watch } = useFormContext<DeleteFormData>();
  const value = watch(props.name);
  const errorMsg = errors[props.name]?.message as string | undefined;
  
  return (
    <div className="w-full">
      <div className="flex relative flex-col gap-1.5 items-start self-stretch">
        <label className="flex relative flex-col items-start self-stretch">
          <span className="relative self-stretch text-xs leading-5 text-gray-700 max-sm:text-xs">
            {props.label}
          </span>
        </label>
        <div className="flex relative flex-col items-start self-stretch px-2.5 pt-2.5 pb-2.5 bg-white rounded-md border-gray-300 border-solid border-[0.839px]">
          <input
            type="text"
            placeholder={props.placeholder}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => setValue(props.name, e.target.value, { shouldValidate: true })}
            required={props.required}
            className="relative self-stretch text-xs text-neutral-500 max-sm:text-xs bg-transparent border-none outline-none w-full"
          />
        </div>
      </div>
      {errorMsg && touchedFields[props.name] && (
        <span className="mt-1 text-xs text-red-500">{errorMsg}</span>
      )}
    </div>
  );
}

export function ModalEliminarConfirmacion({
  onClose,
  onConfirm,
  onCancel,
  title = "Eliminar elemento",
}: ModalEliminarConfirmacionProps) {
  const methods = useForm<DeleteFormData>({
    mode: "onTouched",
    defaultValues: {
      confirmation: "",
    },
  });

  // Registrar el campo para validación
  React.useEffect(() => {
    methods.register("confirmation", {
      required: "Debe escribir 'eliminar' para confirmar",
      validate: (value: string) => 
        value === "eliminar" ? true : "Debe escribir exactamente 'eliminar'"
    });
  }, [methods]);

  const handleSubmit = methods.handleSubmit((data) => {
    if (data.confirmation === "eliminar") {
      onConfirm?.();
    }
  });

  const handleCancel = () => {
    onCancel?.();
  };

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

          <div className="w-full">
            <p className="text-sm text-gray-600 mb-4">
              Escriba 'eliminar' para remover el elemento del menú
            </p>
            
            <RHFDeleteField
              name="confirmation"
              label="Confirmación"
              placeholder="eliminar"
              required
            />
          </div>

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
              Eliminar
            </Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
}

export default ModalEliminarConfirmacion; 