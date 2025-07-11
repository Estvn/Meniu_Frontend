"use client";

import { useForm, FormProvider, useFormContext } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import ButtonNext from "./ButtonNext";
import { useFormPersistence } from "../../../hooks/useFormPersistence";

interface FormValues {
    userOrEmail: string;
    password: string;
}

interface InputFieldProps {
    id: keyof FormValues;
    label: string;
    type?: string;
    validation?: Record<string, unknown>;
}

function InputField({ id, label, type = "text", validation = {} }: InputFieldProps) {
    
    const { register, formState: { errors, touchedFields } } = useFormContext<FormValues>();
    const errorMsg = errors[id]?.message || (errors[id] && "Requerido");
    const inputClass =
        "w-full h-10 px-3 py-2 bg-white border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base";
    const labelClass = "block mb-1 text-left text-sm font-medium text-zinc-700";
    const errorClass = "mt-1 text-xs text-red-500";

    return (
        <div>
            <label htmlFor={String(id)} className={labelClass}> {label} </label>
            <input
                id={String(id)}
                type={type}
                {...register(id, validation)}
                className={inputClass}
            />
            {errorMsg && touchedFields[id] && <span className={errorClass}>{String(errorMsg)}</span>}
        </div>
    );
}

export default function FormLogin() {

    const methods = useForm<FormValues>({ mode: "onSubmit" });
    const { handleSubmit } = methods;
    
    // Usar persistencia para el formulario de login
    const { clearPersistedData } = useFormPersistence(methods, {
        key: 'login-form-data'
    });

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        console.log("Form Data:", data);
        // Limpiar datos guardados después del envío exitoso
        clearPersistedData();
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-6 overflow-hidden">
                

                
                    <div className="w-full max-w-sm mx-auto space-y-4 sm:space-y-5">
                        <h2 className="mb-4 sm:mb-5 text-lg sm:text-xl font-semibold text-center sm:text-left">
                        Iniciar Sesión
                        </h2>
                    <InputField
                        id="userOrEmail"
                        label="Usuario o Correo"
                        validation={{ 
                            required: "Requerido",
                            validate: {
                                validFormat: (value: string) => {
                                    // Permitir nombres de usuario (sin @) o correos electrónicos válidos
                                    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
                                    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
                                    
                                    if (value.includes('@')) {
                                        return emailRegex.test(value) || "Correo electrónico inválido";
                                    } else {
                                        return usernameRegex.test(value) || "Usuario debe tener entre 3 y 20 caracteres alfanuméricos";
                                    }
                                }
                            }
                        }}
                    />
                    
                    <InputField
                        id="password"
                        label="Contraseña"
                        type="password"
                        validation={{
                            required: "Requerido",
                            minLength: { value: 6, message: "Mínimo 6 caracteres" },
                        }}
                    />

                    <div className="mt-6 flex justify-center sm:justify-end w-full max-w-sm mx-auto">
                        <ButtonNext
                            text="Iniciar Sesión"
                        />
                    </div>
                </div>
            </form>
        </FormProvider>
    );
}
