"use client";
import { motion, AnimatePresence } from "framer-motion";
import { TextReveal } from "@/hooks/useTextReveal";
import { useState } from "react";

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: (id?: string) => void;
  onPortfolioOpen: () => void;
  onContactOpen: () => void;
  onAboutOpen: () => void;
}

export default function MenuOverlay({ isOpen, onClose, onPortfolioOpen, onContactOpen, onAboutOpen }: MenuOverlayProps) {
  // Wszystkie linki na środku
  const allMenuItems = [
    { label: "STRONA GŁÓWNA", action: () => onClose() },
    { label: "O MNIE", action: onAboutOpen },
    { label: "PORTFOLIO", action: onPortfolioOpen },
    { label: "KONTAKT", action: onContactOpen },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 450,
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(25px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "#e8e4df",
          }}
        >
          {/* PRZYCISK ZAMKNIĘCIA (✕) */}
          <button 
            onClick={() => onClose()}
            style={{
              position: "absolute",
              top: "40px",
              right: "clamp(20px, 5vw, 60px)",
              background: "none",
              border: "none",
              color: "#e8e4df",
              cursor: "pointer",
              fontFamily: "HelveticaCustom",
              fontSize: "36px",
              letterSpacing: "4px",
              zIndex: 500
            }}
          >
            ✕
          </button>

          {/* GŁÓWNE MENU NA ŚRODKU */}
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "5px" }}>
            {allMenuItems.map((item, index) => (
              <MenuButton key={item.label} item={item} index={index} />
            ))}
          </div>

          {/* STOPKA Z LOGO */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 1.0, duration: 0.8 }} 
            style={{ position: "absolute", bottom: "40px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}
          >
            <p style={{ fontFamily: "HelveticaCustom", fontSize: "10px", letterSpacing: "2px", opacity: 0.5, textTransform: "uppercase" }}>
              Strona zaprojektowana przez
            </p>
            <a href="https://www.whiteslope.studio/" target="_blank" rel="noopener noreferrer">
              <motion.img 
                src="/logos/whiteslopeStudioLogo.png" 
                alt="Whiteslope Studio" 
                style={{ height: "25px", width: "auto" }} 
                whileHover={{ opacity: 0.7 }}
              />
            </a>
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Komponent przycisku — TU JEST SZYBKA ANIMACJA
function MenuButton({ item, index }: { item: any; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onClick={() => item.action()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: "none",
        border: "none",
        color: "#e8e4df",
        cursor: "pointer",
        padding: "5px 40px", 
        position: "relative",
        display: "grid",
        placeItems: "center",
        outline: "none"
      }}
    >
      {/* Helvetica (Baza) */}
      <motion.div
        animate={{ 
          opacity: isHovered ? 0 : 1,
          filter: isHovered ? "blur(3px)" : "blur(0px)",
          y: isHovered ? -5 : 0
        }}
        transition={{ duration: 0.15, ease: "easeOut" }} // Skrócony czas
        style={{
          gridArea: "1/1",
          fontFamily: "HelveticaCustom, sans-serif",
          fontSize: "clamp(35px, 7vw, 65px)",
          letterSpacing: "6px",
          whiteSpace: "nowrap",
          textTransform: "uppercase"
        }}
      >
        <TextReveal text={item.label} delay={0.2 + index * 0.1} />
      </motion.div>

      {/* Garamond (Hover) */}
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ 
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1.05 : 1, 
          filter: isHovered ? "blur(0px)" : "blur(3px)",
          y: isHovered ? 0 : 5
        }}
        transition={{ duration: 0.15, ease: "easeOut" }} // Skrócony czas
        style={{
          gridArea: "1/1",
          fontFamily: "'AppleGaramond', serif",
          fontStyle: "italic",
          fontSize: "clamp(35px, 7vw, 65px)",
          letterSpacing: "4px",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          color: "#fff2e5"
        }}
      >
        {item.label}
      </motion.div>
    </motion.button>
  );
}