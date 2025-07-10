"use client";
import React, { createContext, useContext, useState } from "react";

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
    
    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));
    const resetStep = () => setStep(0);

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
