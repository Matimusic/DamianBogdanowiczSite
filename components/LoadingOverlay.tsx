"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";

interface LoadingOverlayProps {
  progress: number;
  shouldExit?: boolean;
  onExitComplete?: () => void;
}

export default function LoadingOverlay({ progress, shouldExit = false, onExitComplete }: LoadingOverlayProps) {
  const clamped = Math.min(100, Math.max(0, Math.round(progress * 100)));
  const isFinished = shouldExit;

  useEffect(() => {
    if (!isFinished || !onExitComplete) return;

    // Po odpaleniu animacji końcowej czekamy 2 sekundy zanim zakomunikujemy 
    // rodzicowi (onExitComplete), że komponent może zostać usunięty z drzewa.
    const timeout = setTimeout(() => {
      onExitComplete();
    }, 2000);

    return () => clearTimeout(timeout);
  }, [isFinished, onExitComplete]);

  return (
    <motion.div
      // Główne tło nakładki zanika w ostatnich 0.5s animacji (od 1.5s do 2.0s).
      animate={{ opacity: isFinished ? 0 : 1 }}
      transition={{ delay: isFinished ? 1.5 : 0, duration: 0.5 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle at 30% 20%, #141414 0%, #070707 60%, #000 100%)",
        pointerEvents: isFinished ? "none" : "auto", 
      }}
    >
      <div style={{ textAlign: "center", width: "min(420px, 85vw)" }}>
        
        {/* --- SEKCJA LOGO Z ANIMACJĄ KOŃCOWĄ --- */}
        <motion.div 
          style={{ position: "relative", width: "120px", height: "120px", margin: "0 auto 20px" }}
          animate={
            isFinished
              ? {
                  // Krok 1: Normalny, Krok 2: Powiększenie, Krok 3: Zmniejszenie
                  scale: [1, 1.45, 0.8],
                  // Krok 1 i 2: Stoi w miejscu. Krok 3: Leci w górę.
                  // "-45vh" to dokładnie połowa ekranu pomniejszona o zapas 5%, czyli ląduje na wysokości 95%.
                  y: ["0vh", "0vh", "-42vh"],
                  // Logo pozostaje ZAWSZE widoczne podczas lotu
                  opacity: [1, 1, 1]
                }
              : { scale: 1, y: "0vh", opacity: 1 }
          }
          transition={{
            duration: 2, // Czas zgodny z opóźnieniem w useEffect
            times: [0, 0.45, 1], // Powiększanie zajmuje pierwsze 45% czasu
            ease: [0.25, 0.9, 0.35, 1]
          }}
        >
          <img
            src="/logos/logoDB7.png"
            alt="Loading logo"
            style={{
              width: "120px",
              height: "120px",
              objectFit: "contain",
              filter: "grayscale(1) brightness(0.7)",
              opacity: 0.75,
            }}
          />
          <div style={{ position: "absolute", inset: 0 }}>
            <img
              src="/logos/logoDB7.png"
              alt="Loading logo color"
              style={{ width: "120px", height: "120px", objectFit: "contain" }}
            />
          </div>
          {/* Ruchoma maska odsłaniająca logo w trakcie ładowania */}
          <motion.div
            animate={{ left: `${clamped}%` }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              right: 0,
              background: "#070707",
            }}
          />
        </motion.div>

        {/* --- SEKCJA TEKSTÓW I PASKA POSTĘPU --- */}
        <motion.div
          // Elementy znikają i rozmywają się na samym początku wchodzenia w fazę isFinished.
          animate={{ 
            opacity: isFinished ? 0 : 1, 
            y: isFinished ? 20 : 0, 
            filter: isFinished ? "blur(10px)" : "blur(0px)" 
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "16px" }}>
            <p
              style={{
                margin: 0,
                color: "#e8e4df",
                fontFamily: "Instrument Sans, sans-serif",
                letterSpacing: "3px",
                textTransform: "uppercase",
                fontSize: "14px",
              }}
            >
              Ładowanie Filmów
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: "4px" }}>
              {[0, 1, 2].map((dot) => (
                <motion.span
                  key={dot}
                  animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 0.65, repeat: Infinity, delay: dot * 0.11, ease: "easeInOut" }}
                  style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#e8e4df", display: "inline-block" }}
                />
              ))}
            </div>
          </div>

          <div style={{ height: "2px", width: "min(240px, 62vw)", margin: "0 auto", background: "rgba(255,255,255,0.2)", borderRadius: "999px", overflow: "hidden" }}>
            <motion.div
              animate={{ width: `${clamped}%` }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              style={{ height: "100%", background: "#e8e4df" }}
            />
          </div>
          <p style={{ margin: "10px 0 0", color: "rgba(232,228,223,0.75)", fontSize: "12px", letterSpacing: "2px" }}>{clamped}%</p>
        </motion.div>

      </div>
    </motion.div>
  );
}