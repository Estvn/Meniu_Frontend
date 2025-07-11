"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

interface StepContextType {
    step: number;
    nextStep: () => void;
    prevStep: () => void;
    resetStep: () => void;
    handleStepTransition: (nextStepFunction: () => void) => void;
    isTransitioning: boolean;
}

const StepContext = createContext<StepContextType | undefined>(undefined);

export const useStepContext = () => {
    const context = useContext(StepContext);
    if (!context) throw new Error("An error has ocurred with context step...");
    return context;
};

export const StepProvider = ({ children }: { children: React.ReactNode }) => {
    const [step, setStep] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    
    // Cargar paso guardado al inicializar
    useEffect(() => {
        const savedStep = localStorage.getItem('form-step');
        if (savedStep) {
            try {
                const stepNumber = parseInt(savedStep, 10);
                if (stepNumber >= 0 && stepNumber <= 4) { // Validar que esté en el rango válido
                    setStep(stepNumber);
                }
            } catch (error) {
                console.warn('Error loading step from localStorage:', error);
            }
        }
    }, []);

    // Guardar paso cuando cambie
    const saveStep = (newStep: number) => {
        localStorage.setItem('form-step', newStep.toString());
        setStep(newStep);
    };
    
    const nextStep = () => saveStep(step + 1);
    const prevStep = () => saveStep(Math.max(step - 1, 0));
    const resetStep = () => {
        localStorage.removeItem('form-step');
        setStep(0);
    };

    const handleStepTransition = async (nextStepFunction: () => void) => {
        setIsTransitioning(true);
        setTimeout(() => {
            nextStepFunction();
            setIsTransitioning(false);
        }, 300);
    };

    return (
        <StepContext.Provider value={{ step, nextStep, prevStep, resetStep, handleStepTransition, isTransitioning }}>
            {children}
        </StepContext.Provider>
    );
};
