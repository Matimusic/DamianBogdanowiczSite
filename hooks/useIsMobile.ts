"use client";
import { useState, useEffect } from "react";

export function useIsMobile(breakpoint: number = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Sprawdzamy czy okno istnieje (bezpieczeństwo pod Next.js)
    if (typeof window === "undefined") return;

    const mql = window.matchMedia(`(max-width: ${breakpoint}px)`);
    
    // Ustawienie początkowe
    setIsMobile(mql.matches);

    // Funkcja aktualizująca
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    
    // Nasłuchiwanie na zmiany
    mql.addEventListener("change", handler);
    
    return () => mql.removeEventListener("change", handler);
  }, [breakpoint]);

  return isMobile;
}