import { useEffect, useRef } from 'react';
import type { UseFormReturn, FieldValues } from 'react-hook-form';

interface UseFormPersistenceOptions {
  key: string;
  debounceMs?: number;
}

export function useFormPersistence<T extends FieldValues>(
  methods: UseFormReturn<T>,
  options: UseFormPersistenceOptions
) {
  const { key, debounceMs = 500 } = options;
  const timeoutRef = useRef<number | undefined>(undefined);

  // Cargar datos guardados al inicializar
  useEffect(() => {
    const savedData = localStorage.getItem(key);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        methods.reset(parsedData);
      } catch (error) {
        console.warn('Error loading form data from localStorage:', error);
      }
    }
  }, [key, methods]);

  // Guardar datos cuando cambien
  useEffect(() => {
    const subscription = methods.watch((data) => {
      // Limpiar timeout anterior
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Guardar después del debounce
      timeoutRef.current = window.setTimeout(() => {
        localStorage.setItem(key, JSON.stringify(data));
      }, debounceMs);
    });

    return () => {
      subscription.unsubscribe();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [methods, key, debounceMs]);

  // Función para limpiar datos guardados
  const clearPersistedData = () => {
    localStorage.removeItem(key);
  };

  return { clearPersistedData };
} 