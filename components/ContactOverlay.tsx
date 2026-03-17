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

export default function ContactOverlay({
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
            zIndex: 450,
            background: "rgba(5, 5, 5, 0.95)", // Przezroczystość 0.8
            backdropFilter: "blur(25px)",
            color: "#e8e4df",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* GÓRNA BELKA DESKTOP */}
          <div
            style={{
              position: "absolute",
              top: "40px",
              left: 0,
              right: 0,
              padding: "0 clamp(32px, 6vw, 80px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              zIndex: 500,
            }}
          >
            {/* Nawigacja Lewa */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "32px",
                fontFamily: "HelveticaCustom",
                fontSize: "13px",
                fontWeight: 400,
                letterSpacing: "1.2px",
                textTransform: "uppercase",
                opacity: 0.7,
              }}
            >
              <button onClick={onClose} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", padding: 0 }}>STRONA GŁÓWNA</button>
              <button onClick={onAboutOpen} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", padding: 0 }}>O MNIE</button>
              <button onClick={onPortfolioOpen} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", padding: 0 }}>PORTFOLIO</button>
            </div>

            {/* Przycisk Zamknięcia (X) – Idealnie w linii z Menu/Headerem */}
            <button
              onClick={onClose}
              style={{
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
                padding: 0,
                mixBlendMode: "difference",
              }}
            >
              <span style={{ display: "block", width: "18px", height: "1px", background: "#fff", transform: "translateY(2.5px) rotate(45deg)" }} />
              <span style={{ display: "block", width: "18px", height: "1px", background: "#fff", transform: "translateY(-2.5px) rotate(-45deg)" }} />
            </button>
          </div>

          {/* TREŚĆ GŁÓWNA */}
          <div
            style={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 10vw",
            }}
          >
            <motion.div
              style={{
                fontFamily: "HelveticaCustom, sans-serif",
                fontSize: "clamp(50px, 9vw, 96px)",
                letterSpacing: "12px",
                textTransform: "uppercase",
                lineHeight: 1,
                marginBottom: "60px",
              }}
            >
              <TextReveal text="KONTAKT" delay={0.2} />
            </motion.div>

            <motion.div
              style={{
                fontFamily: "'AppleGaramond', serif",
                fontStyle: "italic",
                fontSize: "clamp(28px, 4.5vw, 44px)",
                letterSpacing: "0.8px",
                marginBottom: "24px",
              }}
            >
              <TextReveal text="Damian Bogdanowicz" delay={0.4} />
            </motion.div>

            <motion.a
              href="mailto:damian.bogdanowicz@gmail.com"
              onClick={(e) => copyToClipboard("damian.bogdanowicz@gmail.com", e)}
              style={{
                fontFamily: "HelveticaCustom, sans-serif",
                fontSize: "clamp(18px, 2.8vw, 26px)",
                letterSpacing: "2.2px",
                textDecoration: "none",
                color: "inherit",
                opacity: 0.75,
                marginBottom: "12px",
                display: "block",
                cursor: "pointer",
              }}
              whileHover={{ opacity: 1 }}
            >
              <TextReveal text="damian.bogdanowicz@gmail.com" delay={0.6} />
            </motion.a>

            <motion.a
              href="tel:+48000000000"
              onClick={(e) => copyToClipboard("+48 000 000 000", e)}
              style={{
                fontFamily: "HelveticaCustom, sans-serif",
                fontSize: "clamp(18px, 2.8vw, 26px)",
                letterSpacing: "2.2px",
                textDecoration: "none",
                color: "inherit",
                opacity: 0.75,
                display: "block",
                cursor: "pointer",
              }}
              whileHover={{ opacity: 1 }}
            >
              <TextReveal text="+48 000 000 000" delay={0.75} />
            </motion.a>
          </div>

          {/* STOPKA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            style={{
              position: "absolute",
              bottom: "40px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <p style={{ fontFamily: "HelveticaCustom", fontSize: "10px", letterSpacing: "2px", opacity: 0.5, textTransform: "uppercase", margin: 0 }}>
              Strona zaprojektowana przez
            </p>
            <a href="https://www.whiteslope.studio/" target="_blank" rel="noopener noreferrer">
              <img src="/logos/whiteslopeStudioLogo.png" alt="Whiteslope Studio" style={{ height: "25px", width: "auto" }} />
            </a>
          </motion.div>

          {/* TOAST – Wyśrodkowany Checkmark */}
          <AnimatePresence>
            {showToast && (
              <motion.div
                initial={{ y: 20, x: "-50%", opacity: 0, filter: "blur(5px)" }}
                animate={{ y: 0, x: "-50%", opacity: 1, filter: "blur(0px)" }}
                exit={{ y: 20, x: "-50%", opacity: 0, filter: "blur(3px)" }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{
                  position: "fixed",
                  left: "50%",
                  bottom: "15vh",
                  zIndex: 1000,
                  background: "#111",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  padding: "10px 20px",
                  borderRadius: "999px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                }}
              >
                <div style={{ width: "12px", height: "10px", display: "flex", alignItems: "center" }}>
                  <svg viewBox="0 0 10 8" fill="none">
                    <path d="M1 4.5L3.5 7L9 1.5" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span style={{ fontFamily: "HelveticaCustom", fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase", color: "#f2ede6" }}>
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