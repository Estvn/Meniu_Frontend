"use client";

import { useForm, FormProvider, useFormContext } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { useStepContext } from "./StepContext"; 
import ButtonNext from "./ButtonNext";
import { useFormPersistence } from "../../../hooks/useFormPersistence";
import { usePlanes } from '../../../endpoints/administration/planes';
import { useRegistroCliente } from '../../../endpoints/administration/registro';
import { Modal } from '../forms/Modal';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface FormValues {
    firstName: string;
    lastName: string;
    email: string;
    restaurantName: string;
    address: string;
    phone: string;
    restaurantEmail?: string;
    subscriptionPlan: string;
    ownerName: string;
    cardNumber: string;
    cvv: string;
    expMonth: string;
    expYear: string;
    password: string;
    confirmPassword: string;
    acceptTerms: boolean;
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

export default function FormRegistry() {

    const methods = useForm<FormValues>({ mode: "onSubmit" });
    const { handleSubmit, trigger, formState: { errors, touchedFields }, getValues, } = methods;
    const { step, nextStep, handleStepTransition, isTransitioning, resetStep } = useStepContext();
    const steps = ["PersonalInfo", "RestaurantInfo", "Subscription", "Payment", "Password",];

    // Usar persistencia para el formulario de registro
    const { clearPersistedData } = useFormPersistence(methods, {
        key: 'registry-form-data'
    });

    const { data: planes, isLoading, error } = usePlanes();
    const { mutate } = useRegistroCliente();
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        // Mapear los datos del formulario a los campos del endpoint
        const payload = {
            cvv: data.cvv,
            mes_expiracion: data.expMonth,
            nombre_propietario_tarjeta: data.ownerName,
            email_restaurante: data.restaurantEmail,
            nombre: data.firstName,
            numero_tarjeta: data.cardNumber,
            anio_expiracion: data.expYear,
            descripcion: 'Restaurante de comida tradicional', // Valor fijo o puedes mapearlo de un campo
            id_plan: data.subscriptionPlan,
            direccion: data.address,
            nombre_restaurante: data.restaurantName,
            telefono: data.phone,
            apellidos: data.lastName,
            password: data.password,
            email: data.email,
        };
        mutate(payload, {
            onSuccess: (response) => {
                if (response.success) {
                    setShowSuccessModal(true);
                    setTimeout(() => {
                        setShowSuccessModal(false);
                        navigate('/menu');
                    }, 2000);
                } else {
                    setErrorMessage(response.message || 'Hubo un problema con el registro.');
                    setShowErrorModal(true);
                }
            },
            onError: (error) => {
                setErrorMessage(error.message || 'Hubo un problema con el registro.');
                setShowErrorModal(true);
            }
        });
        clearPersistedData();
        resetStep();
    };

    const handleNext = async () => {
        let valid = false;
        switch (step) {
            case 0:
                valid = await trigger(["firstName", "lastName", "email"], { shouldFocus: true });
            break;
            case 1:
                valid = await trigger(["restaurantName", "address", "phone"], { shouldFocus: true });
            break;
            case 2:
                valid = !!getValues("subscriptionPlan");
            break;
            case 3:
                valid = await trigger([
                    "ownerName",
                    "cardNumber",
                    "cvv",
                    "expMonth",
                    "expYear",
                ], { shouldFocus: true });
            break;
            case 4:
                valid = await trigger(["password", "confirmPassword", "acceptTerms"], { shouldFocus: true });
            break;
        }
        if (valid) {
            if (step < steps.length - 1) {
                handleStepTransition(nextStep);
            } else {
                handleSubmit(onSubmit)();
            }
        }
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-6 overflow-hidden">
                <div className={`transition-all duration-300 ease-in-out transform ${
                    isTransitioning ? 'translate-x-[-100%] opacity-0' : 'translate-x-0 opacity-100'
                }`}>
                    {step === 0 && (
                    <div className="w-full max-w-sm mx-auto space-y-4 sm:space-y-5">
                        <h2 className="mb-4 sm:mb-5 text-lg sm:text-xl font-semibold text-center sm:text-left">Datos del Gerente</h2>
                        <InputField
                        id="firstName"
                        label="Nombre"
                        validation={{ required: "Requerido" }}
                        />
                        <InputField
                        id="lastName"
                        label="Apellido"
                        validation={{ required: "Requerido" }}
                        />
                        <InputField
                        id="email"
                        label="Correo"
                        type="email"
                        validation={{ required: "Requerido" }}
                        />
                    </div>
                    )}

                    {step === 1 && (
                    <div className="w-full max-w-sm mx-auto space-y-4 sm:space-y-5">
                        <h2 className="mb-4 sm:mb-5 text-lg sm:text-xl font-semibold text-center sm:text-left">
                        Datos del Restaurante
                        </h2>
                        <InputField
                        id="restaurantName"
                        label="Nombre del Restaurante"
                        validation={{ required: "Requerido" }}
                        />
                        <InputField
                        id="address"
                        label="Dirección"
                        validation={{ required: "Requerido" }}
                        />
                        <InputField
                        id="phone"
                        label="Teléfono"
                        validation={{ required: "Requerido" }}
                        />
                        <InputField
                        id="restaurantEmail"
                        label="Correo electrónico (opcional)"
                        type="email"
                        />
                    </div>
                    )}

                    {step === 2 && (
                    <div className="w-full max-w-sm mx-auto space-y-4 sm:space-y-5">
                        <h2 className="mb-4 sm:mb-5 text-lg sm:text-xl font-semibold text-center sm:text-left">
                        Seleccione su Plan de Suscripción
                        </h2>
                        <div className="flex flex-col space-y-3">
                        {isLoading && <span>Cargando planes...</span>}
                        {error && <span className="text-red-500">Error al cargar los planes</span>}
                        {planes && planes.map((plan) => (
                            <button
                                key={plan.id_plan}
                                type="button"
                                onClick={() => methods.setValue("subscriptionPlan", String(plan.id_plan))}
                                className={`w-full py-3 px-4 text-center rounded-md text-white text-sm sm:text-base font-medium transition-all duration-200
                                    ${getValues("subscriptionPlan") === String(plan.id_plan)
                                    ? "bg-orange-500 text-white"
                                    : "bg-orange-300 bg-opacity-70 hover:bg-opacity-80"}
                                `}
                                >
                                <div className="flex flex-col items-start">
                                    <span className="font-semibold">{plan.nombre_plan}</span>
                                    <span className="text-xs">Mesas: {plan.numero_mesas} | Productos: {plan.numero_productos} | Cocineros: {plan.numero_cocineros}</span>
                                    <span className="font-bold">L. {plan.precio}</span>
                                </div>
                            </button>
                        ))}
                        </div>
                        {errors.subscriptionPlan && (
                        <span className="mt-1 text-xs text-red-500">
                            {errors.subscriptionPlan.message}
                        </span>
                        )}
                    </div>
                    )}

                    {step === 3 && (
                    <div className="w-full max-w-sm mx-auto space-y-4 sm:space-y-5">
                        <h2 className="mb-4 sm:mb-5 text-lg sm:text-xl font-semibold text-center sm:text-left">Datos de Pago</h2>
                        <InputField
                        id="ownerName"
                        label="Nombre Propietario"
                        validation={{ required: "Requerido" }}
                        />
                        <InputField
                        id="cardNumber"
                        label="Número de Tarjeta"
                        validation={{
                            required: "Requerido",
                            minLength: { value: 13, message: "Debe tener al menos 13 dígitos" },
                            pattern: { value: /^\d+$/, message: "Solo números" },
                        }}
                        />
                        <InputField
                        id="cvv"
                        label="CVV"
                        validation={{ required: "Requerido" }}
                        />
                        <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <InputField
                            id="expMonth"
                            label="Mes Exp"
                            validation={{ required: "Requerido" }}
                            />
                        </div>
                        <div className="flex-1">
                            <InputField
                            id="expYear"
                            label="Año Exp"
                            validation={{
                                required: "Requerido",
                                min: { value: 2023, message: "Debe ser 2023 o mayor" },
                                pattern: { value: /^\d{4}$/, message: "Debe ser un año válido" },
                            }}
                            />
                        </div>
                        </div>
                    </div>
                    )}

                    {step === 4 && (
                    <div className="w-full max-w-sm mx-auto space-y-4 sm:space-y-5">
                        <h2 className="mb-4 sm:mb-5 text-lg sm:text-xl font-semibold text-center sm:text-left">
                        ¡Este es el Último Paso!
                        </h2>
                        <InputField
                        id="password"
                        label="Contraseña"
                        type="password"
                        validation={{
                            required: "Requerido",
                            minLength: { value: 8, message: "8+ caracteres" },
                        }}
                        />
                        <InputField
                        id="confirmPassword"
                        label="Confirmar Contraseña"
                        type="password"
                        validation={{
                            required: "Requerido",
                            validate: (val: string) =>
                            val === getValues("password") || "No coincide",
                        }}
                        />
                        <div className="flex items-start space-x-2">
                        <input
                            id="acceptTerms"
                            type="checkbox"
                            {...methods.register("acceptTerms", {
                            required: "Debes aceptar",
                            })}
                            className="mt-1 mr-2 flex-shrink-0"
                        />
                        <label htmlFor="acceptTerms" className="text-sm text-zinc-700 leading-relaxed">
                            Acepto términos y privacidad
                        </label>
                        </div>
                        {errors.acceptTerms && touchedFields.acceptTerms && (
                        <span className="mt-1 text-xs text-red-500">
                            {errors.acceptTerms.message}
                        </span>
                        )}
                    </div>
                    )}

                    <div className="mt-6 flex justify-center sm:justify-end w-full max-w-sm mx-auto">
                        <ButtonNext
                            text={step < steps.length - 1 ? "Siguiente" : "Registrarse"}
                            onClick={handleNext}
                        />
                    </div>
                </div>
                {showSuccessModal && (
                    <Modal>
                        <div className="flex flex-col items-center justify-center p-4">
                            <h2 className="text-xl font-bold mb-2 text-center">¡Su Registro ha Sido Exitoso!</h2>
                            <p className="text-center">Será redirigido al menú principal...</p>
                        </div>
                    </Modal>
                )}
                {showErrorModal && (
                    <Modal>
                        <div className="flex flex-col items-center justify-center p-4">
                            <h2 className="text-xl font-bold mb-2 text-center text-red-600">Hubo un problema</h2>
                            <p className="text-center">{errorMessage}</p>
                            <button className="mt-4 px-4 py-2 bg-orange-500 text-white rounded" onClick={() => setShowErrorModal(false)}>Cerrar</button>
                        </div>
                    </Modal>
                )}
            </form>
        </FormProvider>
    );
}
