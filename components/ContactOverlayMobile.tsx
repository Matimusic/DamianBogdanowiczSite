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

export default function ContactOverlayMobile({
  isOpen,
  onClose,
  onAboutOpen,
  onPortfolioOpen,
}: ContactOverlayProps) {
  const [showToast, setShowToast] = useState(false);

  const copyToClipboard = (text: string, e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(text).then(() => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 600,
            background: "rgba(5, 5, 5, 0.8)", // Przezroczystość 0.8
            backdropFilter: "blur(25px)",
            color: "#e8e4df",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* NANO NAWIGACJA (6px) - 24px od krawędzi */}
          <div style={{
            position: "absolute",
            top: "24px",
            left: "24px",
            display: "flex",
            gap: "10px",
            fontFamily: "HelveticaCustom",
            fontSize: "6px",
            letterSpacing: "2px",
            paddingTop: "12px", // Wyrównanie do osi X
            zIndex: 700
          }}>
            <button onClick={onClose} style={{ background: "none", border: "none", color: "inherit", opacity: 0.5, padding: 0 }}>STRONA GŁÓWNA</button>
            <button onClick={onAboutOpen} style={{ background: "none", border: "none", color: "inherit", opacity: 0.5, padding: 0 }}>O MNIE</button>
            <button onClick={onPortfolioOpen} style={{ background: "none", border: "none", color: "inherit", opacity: 0.5, padding: 0 }}>PORTFOLIO</button>
          </div>

          {/* PRZYCISK ZAMKNIĘCIA (X) - 24px od krawędzi */}
          <button 
            onClick={onClose}
            style={{
              position: "absolute",
              top: "24px", 
              right: "24px",
              width: "32px",
              height: "32px",
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "4px",
              zIndex: 750,
              mixBlendMode: "difference"
            }}
          >
            <span style={{ display: "block", width: "18px", height: "1px", background: "#fff", transform: "translateY(2.5px) rotate(45deg)" }} />
            <span style={{ display: "block", width: "18px", height: "1px", background: "#fff", transform: "translateY(-2.5px) rotate(-45deg)" }} />
          </button>

          {/* CONTENT ŚRODKOWY */}
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "4px", width: "100%" }}>
            <div style={{ marginBottom: "8px" }}>
              <motion.div style={{ 
                fontFamily: "HelveticaCustom, sans-serif", 
                fontSize: "4vh", 
                letterSpacing: "4px", 
                textTransform: "uppercase", 
                lineHeight: 1, 
                marginBottom: "-1.5vh"
              }}>
                <TextReveal text="KONTAKT" delay={0.2} />
              </motion.div>
            </div>

            <motion.div style={{ 
              fontFamily: "'AppleGaramond', serif", 
              fontStyle: "italic", 
              fontSize: "2.5vh", 
              letterSpacing: "1px", 
              marginBottom: "3vh" 
            }}>
              <TextReveal text="Damian Bogdanowicz" delay={0.4} />
            </motion.div>

            {/* EMAIL / TEL - Mikro 8px */}
            <motion.a
              href="mailto:damian.bogdanowicz@gmail.com" 
              onClick={(e) => copyToClipboard("damian.bogdanowicz@gmail.com", e)}
              style={{ 
                fontFamily: "HelveticaCustom, sans-serif", 
                fontSize: "2vh", 
                letterSpacing: "2px", 
                textDecoration: "none", 
                color: "inherit", 
                opacity: 0.5, 
                display: "block", 
                cursor: "pointer" 
              }}
            >
              <TextReveal text="damian.bogdanowicz@gmail.com" delay={0.6} />
            </motion.a>

            <motion.a
              href="tel:+48000000000" 
              onClick={(e) => copyToClipboard("+48 000 000 000", e)}
              style={{ 
                fontFamily: "HelveticaCustom, sans-serif", 
                fontSize: "2vh", 
                letterSpacing: "2px", 
                textDecoration: "none", 
                color: "inherit", 
                opacity: 0.5, 
                display: "block", 
                cursor: "pointer" 
              }}
            >
              <TextReveal text="+48 000 000 000" delay={0.8} />
            </motion.a>
          </div>

          {/* STOPKA - Zmniejszona (5px font) */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            style={{ 
              position: "absolute", 
              bottom: "30px", 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              gap: "6px" 
            }}
          >
            <p style={{ 
              fontFamily: "HelveticaCustom", 
              fontSize: "5px", // Jeszcze mniejszy font
              letterSpacing: "0.5px", 
              opacity: 0.4, 
              textTransform: "uppercase",
              color: "#e8e4df"
            }}>
              Strona zaprojektowana przez
            </p>
            <a href="https://www.whiteslope.studio/" target="_blank" rel="noopener noreferrer">
              <img 
                src="/logos/whiteslopeStudioLogo.png" 
                alt="Logo" 
                style={{ height: "12px", opacity: 0.8 }} // Mniejsze logo
              />
            </a>
          </motion.div>

          {/* Toast - Wyśrodkowany Checkmark */}
          <AnimatePresence>
            {showToast && (
              <motion.div
                initial={{ y: 20, x: "-50%", opacity: 0 }}
                animate={{ y: 0, x: "-50%", opacity: 1 }}
                exit={{ y: 20, x: "-50%", opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  position: "fixed",
                  left: "50%",
                  bottom: "80px",
                  zIndex: 1000,
                  background: "#111",
                  padding: "6px 14px",
                  borderRadius: "999px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                }}
              >
                <div style={{ width: "10px", height: "8px", display: "flex", alignItems: "center" }}>
                  <svg viewBox="0 0 10 8" fill="none">
                    <path d="M1 4.5L3.5 7L9 1.5" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span style={{ fontFamily: "HelveticaCustom", fontSize: "8px", letterSpacing: "1px", textTransform: "uppercase", color: "#f2ede6" }}>
                  Zapisano w schowku
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}