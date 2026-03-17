"use client";
import { motion, AnimatePresence } from "framer-motion";
import { TextReveal } from "@/hooks/useTextReveal";
import { useState } from "react";

interface ContactOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onAboutOpen: () => void;
  onPortfolioOpen: () => void;
}

export default function ContactOverlay({ isOpen, onClose, onAboutOpen, onPortfolioOpen }: ContactOverlayProps) {
  const [showToast, setShowToast] = useState(false);

  // Funkcja kopiowania do schowka
  const copyToClipboard = (text: string, e: React.MouseEvent) => {
    e.preventDefault(); // Zapobiegamy natychmiastowemu otwarciu klienta mail/tel
    navigator.clipboard.writeText(text).then(() => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500); // Popup zniknie po 2.5s
    });
  };

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
            background: "rgba(0, 0, 0, 1)",
            backdropFilter: "blur(25px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "#e8e4df",
          }}
        >
          {/* PRZYCISK ZAMKNIĘCIA */}
          <button 
            onClick={onClose}
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
              letterSpacing: "4px"
            }}
          >
            ✕
          </button>

          {/* GÓRNA NAWIGACJA */}
<div style={{
  position: "absolute",
  top: "100px",
  left: "clamp(20px, 5vw, 60px)",
  display: "flex",
  gap: "30px",
  fontFamily: "HelveticaCustom",
  fontSize: "14px",
  letterSpacing: "2px"
}}>
  {/* 1. STRONA GŁÓWNA */}
  <button 
    onClick={onClose} 
    style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", opacity: 0.6, padding: 0 }}
  >
    STRONA GŁÓWNA
  </button>

  {/* 2. O MNIE */}
  <button 
    onClick={onAboutOpen} 
    style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", opacity: 0.6, padding: 0 }}
  >
    O MNIE
  </button>

  {/* 3. PORTFOLIO */}
  <button 
    onClick={onPortfolioOpen} 
    style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", opacity: 0.6, padding: 0 }}
  >
    PORTFOLIO
  </button>
</div>

          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ marginBottom: "40px" }}>
              <motion.div style={{ fontFamily: "HelveticaCustom, sans-serif", fontSize: "clamp(40px, 8vw, 80px)", letterSpacing: "15px", fontWeight: "normal", textTransform: "uppercase", lineHeight: 1 }}>
                <TextReveal text="KONTAKT" delay={0.2} />
              </motion.div>
            </div>

            <motion.div style={{ fontFamily: "'AppleGaramond', serif", fontStyle: "italic", fontSize: "clamp(24px, 4vw, 36px)", letterSpacing: "1px", marginBottom: "10px" }}>
              <TextReveal text="Damian Bogdanowicz" delay={0.4} />
            </motion.div>

            {/* EMAIL */}
            <motion.a
              href="mailto:damian.bogdanowicz@gmail.com" 
              onClick={(e) => copyToClipboard("damian.bogdanowicz@gmail.com", e)}
              style={{ fontFamily: "HelveticaCustom, sans-serif", fontSize: "clamp(16px, 2.5vw, 22px)", letterSpacing: "4px", textDecoration: "none", color: "inherit", opacity: 0.8, display: "block", marginBottom: "5px", cursor: "pointer" }}
              whileHover={{ opacity: 1 }}
            >
              <TextReveal text="damian.bogdanowicz@gmail.com" delay={0.6} />
            </motion.a>

            {/* TELEFON */}
            <motion.a
              href="tel:+48000000000" 
              onClick={(e) => copyToClipboard("+48 000 000 000", e)}
              style={{ fontFamily: "HelveticaCustom, sans-serif", fontSize: "clamp(16px, 2.5vw, 22px)", letterSpacing: "4px", textDecoration: "none", color: "inherit", opacity: 0.8, display: "block", cursor: "pointer" }}
              whileHover={{ opacity: 1 }}
            >
              <TextReveal text="+48 000 000 000" delay={0.8} />
            </motion.a>
          </div>

          {/* STOPKA Z LOGO */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.8 }} style={{ position: "absolute", bottom: "40px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
            <p style={{ fontFamily: "HelveticaCustom", fontSize: "10px", letterSpacing: "2px", opacity: 0.5, textTransform: "uppercase" }}>Strona zaprojektowana przez</p>
            <a href="https://www.whiteslope.studio/" target="_blank" rel="noopener noreferrer">
              <img src="/logos/whiteslopeStudioLogo.png" alt="Whiteslope Studio" style={{ height: "25px", width: "auto" }} />
            </a>
          </motion.div>

          {/* --- POPUP (TOAST) --- */}
          <AnimatePresence>
            {showToast && (
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                style={{
                  position: "absolute",
                  bottom: "15vh",
                  background: "#111",
                  border: "1px solid rgba(232, 228, 223, 0.1)",
                  padding: "12px 24px",
                  borderRadius: "50px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                  zIndex: 500
                }}
              >
                {/* ZIELONY CHECKMARK */}
                <div style={{
                  width: "18px",
                  height: "18px",
                  background: "#4ade80",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 4.5L3.5 7L9 1.5" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span style={{ 
                  fontFamily: "HelveticaCustom", 
                  fontSize: "12px", 
                  letterSpacing: "1px", 
                  color: "#e8e4df" 
                }}>
                  Zapisano do schowka
                </span>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      )}
    </AnimatePresence>
  );
}