"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { useIsMobile } from "@/hooks/useIsMobile"; // Upewnij się, że masz ten hook

interface LoadingOverlayProps {
  progress: number;
  shouldExit?: boolean;
  onExitComplete?: () => void;
}

export default function LoadingOverlay({ progress, shouldExit = false, onExitComplete }: LoadingOverlayProps) {
  const isMobile = useIsMobile();
  const clamped = Math.min(100, Math.max(0, Math.round(progress * 100)));
  const isFinished = shouldExit;

  useEffect(() => {
    if (!isFinished || !onExitComplete) return;

    const timeout = setTimeout(() => {
      onExitComplete();
    }, 2000);

    return () => clearTimeout(timeout);
  }, [isFinished, onExitComplete]);

  return (
    <motion.div
      animate={{ opacity: isFinished ? 0 : 1 }}
      transition={{ delay: isFinished ? 1.5 : 0, duration: 0.5 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#070707", // Czysta, głęboka czerń bez gradientu dla lepszego efektu
        pointerEvents: isFinished ? "none" : "auto", 
      }}
    >
      <div style={{ textAlign: "center", width: isMobile ? "100%" : "420px" }}>
        
        {/* --- SEKCJA LOGO --- */}
        <motion.div 
          style={{ position: "relative", width: "100px", height: "100px", margin: "0 auto 30px" }}
          animate={
            isFinished
              ? {
                  scale: [1, 1.2, 0.9],
                  // Lot tylko na desktopie. Na mobile y: 0 (zostaje w miejscu)
                  y: isMobile ? ["0vh", "0vh", "0vh"] : ["0vh", "0vh", "-42vh"],
                  opacity: [1, 1, 0.8]
                }
              : { scale: 1, y: "0vh", opacity: 1 }
          }
          transition={{
            duration: 2,
            times: [0, 0.45, 1],
            ease: [0.25, 0.9, 0.35, 1]
          }}
        >
          {/* Logo szare pod spodem */}
          <img
            src="/logos/logoDB7.png"
            alt="Loading"
            style={{
              width: "100px",
              height: "100px",
              objectFit: "contain",
              filter: "grayscale(1)",
              opacity: 0.2, // Bardziej subtelny podkład
            }}
          />
          
          {/* Logo kolorowe odsłaniane maską (clipPath usuwa problem czarnego kwadratu) */}
          <div style={{ position: "absolute", inset: 0 }}>
            <motion.img
              src="/logos/logoDB7.png"
              alt="Loading"
              animate={{ clipPath: `inset(0 ${100 - clamped}% 0 0)` }}
              transition={{ duration: 0.2 }}
              style={{ 
                width: "100px", 
                height: "100px", 
                objectFit: "contain"
              }}
            />
          </div>
        </motion.div>

        {/* --- SEKCJA TEKSTÓW I PASKA --- */}
        <motion.div
          animate={{ 
            opacity: isFinished ? 0 : 1, 
            y: isFinished ? 10 : 0, 
            filter: isFinished ? "blur(8px)" : "blur(0px)" 
          }}
          transition={{ duration: 0.4 }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginBottom: "12px" }}>
            <p
              style={{
                margin: 0,
                color: "#e8e4df",
                fontFamily: "HelveticaCustom, sans-serif",
                letterSpacing: "2px",
                textTransform: "uppercase",
                fontSize: isMobile ? "9px" : "10px", // Nano font
              }}
            >
              Ładowanie Filmów
            </p>

            <div style={{ display: "flex", gap: "3px" }}>
              {[0, 1, 2].map((dot) => (
                <motion.span
                  key={dot}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: dot * 0.15 }}
                  style={{ width: "3px", height: "3px", borderRadius: "50%", background: "#e8e4df" }}
                />
              ))}
            </div>
          </div>

          {/* Pasek postępu - Węższy i cieńszy */}
          <div style={{ 
            height: "1px", // Jeszcze cieńszy
            width: isMobile ? "40vw" : "140px", // Węższy na obu urządzeniach
            margin: "0 auto", 
            background: "rgba(255,255,255,0.1)", 
            borderRadius: "999px", 
            overflow: "hidden" 
          }}>
            <motion.div
              animate={{ width: `${clamped}%` }}
              transition={{ duration: 0.2 }}
              style={{ height: "100%", background: "#e8e4df" }}
            />
          </div>

          <p style={{ 
            margin: "8px 0 0", 
            color: "rgba(232,228,223,0.4)", // Bardziej wyblakły procent
            fontSize: "8px", 
            letterSpacing: "1px" 
          }}>
            {clamped}%
          </p>
        </motion.div>

      </div>
    </motion.div>
  );
}