import { useEffect, useState, useCallback } from "react";

/**
 * Formatea los segundos en mm:ss
 */
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

/**
 * Hook que calcula una cuenta regresiva basada en un tiempo de creación
 * y un límite total en segundos.
 *
 * @param createdAt - Fecha de inicio (por ejemplo, cuando se hizo un pedido).
 * @param totalAllowedSeconds - Cuántos segundos dura la cuenta regresiva.
 * @returns El tiempo restante en formato mm:ss
 */
export function useCountdown(createdAt: Date, totalAllowedSeconds: number): string {
  const [timeLeft, setTimeLeft] = useState<number>(totalAllowedSeconds);

  const calculateTimeLeft = useCallback(() => {
    const now = new Date();
    const elapsedSeconds = Math.floor((now.getTime() - createdAt.getTime()) / 1000);
    const remaining = totalAllowedSeconds - elapsedSeconds;
    return remaining > 0 ? remaining : 0;
  }, [createdAt, totalAllowedSeconds]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [calculateTimeLeft]);

  return formatTime(timeLeft);
}
