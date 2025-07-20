"use client";

import { useForm, FormProvider, useFormContext } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import ButtonNext from "./ButtonNext";
import { useFormPersistence } from "../../../hooks/useFormPersistence";
import { useLogin } from '../../../endpoints/administration/login';
import { Modal } from '../forms/Modal';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

    const { mutate, isPending } = useLogin();
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        console.log('Form submitted with data:', data);
        
        // Mapear los datos del formulario a los campos del endpoint
        const payload = {
            nombre_usuario: data.userOrEmail,
            password: data.password,
        };
        
        console.log('Sending payload to API:', payload);
        
        mutate(payload, {
            onSuccess: (response) => {
                console.log('Login successful:', response);
                if (response.access_token) {
                    // Solo guardar el token, los datos del usuario se extraen del JWT
                    sessionStorage.setItem('access_token', response.access_token);
                    
                    setShowSuccessModal(true);
                    setTimeout(() => {
                        setShowSuccessModal(false);
                        navigate('/menu');
                    }, 2000);
                } else {
                    setErrorMessage('Respuesta inesperada del servidor');
                    setShowErrorModal(true);
                }
            },
            onError: (error) => {
                console.error('Login error:', error);
                setErrorMessage(error.message || 'Error al iniciar sesión');
                setShowErrorModal(true);
            }
        });
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
                            text={isPending ? "Iniciando sesión..." : "Iniciar Sesión"}
                            disabled={isPending}
                        />
                    </div>
                </div>
                {showSuccessModal && (
                    <Modal>
                        <div className="flex flex-col items-center justify-center p-4">
                            <h2 className="text-xl font-bold mb-2 text-center">¡Inicio Exitoso!</h2>
                            <p className="text-center">Será redirigido al menú principal...</p>
                        </div>
                    </Modal>
                )}
                {showErrorModal && (
                    <Modal>
                        <div className="flex flex-col items-center justify-center p-4">
                            <h2 className="text-xl font-bold mb-2 text-center text-red-600">Error de inicio de sesión</h2>
                            <p className="text-center">{errorMessage}</p>
                            <button className="mt-4 px-4 py-2 bg-orange-500 text-white rounded" onClick={() => setShowErrorModal(false)}>Cerrar</button>
                        </div>
                    </Modal>
                )}
            </form>
        </FormProvider>
    );
}
