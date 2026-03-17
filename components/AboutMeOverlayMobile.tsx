"use client";
import { motion } from "framer-motion";
import { TextReveal } from "@/hooks/useTextReveal";

interface AboutMeOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onPortfolioOpen: () => void;
  onContactOpen: () => void;
}

export default function AboutMeOverlayMobile({ 
  onClose, 
  onPortfolioOpen, 
  onContactOpen 
}: AboutMeOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 600,
        background: "#050505",
        color: "#e8e4df",
        overflowY: "auto",
        // Padding góra 80px, żeby treść nie wchodziła pod nano-menu
        padding: "80px 24px 40px", 
      }}
    >
      {/* PRZYCISK ZAMKNIĘCIA - Kopia 1:1 z Portfolio/Menu */}
      <button 
        onClick={onClose}
        style={{
          position: "fixed",
          top: "24px", 
          right: "24px",
          width: "32px",
          height: "32px",
          background: "none",
          border: "none",
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

      {/* MINI NAWIGACJA - Kopia 1:1 z Portfolio (6px) */}
      <div style={{ 
        position: "absolute",
        top: "24px",
        left: "24px",
        display: "flex", 
        gap: "12px", 
        fontFamily: "HelveticaCustom",
        fontSize: "6px",
        letterSpacing: "2px",
        paddingTop: "12px", // Wyrównanie do osi X
        zIndex: 700
      }}>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "inherit", opacity: 0.5, padding: 0 }}>STRONA GŁÓWNA</button>
        <button onClick={onPortfolioOpen} style={{ background: "none", border: "none", color: "inherit", opacity: 0.5, padding: 0 }}>PORTFOLIO</button>
        <button onClick={onContactOpen} style={{ background: "none", border: "none", color: "inherit", opacity: 0.5, padding: 0 }}>KONTAKT</button>
      </div>

      {/* HEADER - DAMIAN BOGDANOWICZ */}
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ 
          fontFamily: "HelveticaCustom", 
          fontSize: "36px", // Konkretny rozmiar zamiast vh dla stabilności
          lineHeight: 0.9,
          textTransform: "uppercase", 
          margin: 0,
          letterSpacing: "-1px"
        }}>
          <TextReveal text="DAMIAN" delay={0.2} />
          <br />
          <TextReveal text="BOGDANOWICZ" delay={0.3} />
        </h1>
      </div>

      {/* OPIS */}
      <div style={{ marginBottom: "40px" }}>
        <p style={{ 
          fontFamily: "HelveticaCustom", 
          fontSize: "18px", 
          lineHeight: 1.3,
          opacity: 0.9,
          marginBottom: "25px"
        }}>
          <TextReveal text="FILMMAKER & CINEMATOGRAPHER BAZUJĄCY W POLSCE. MOJA PRACA TO NIE TYLKO OBRAZ, TO EMOCJE UCHWYCONE W KADRZE." delay={0.5} />
        </p>
        
        <div style={{ 
          fontFamily: "'AppleGaramond', serif", 
          fontStyle: "italic", 
          fontSize: "14px", 
          opacity: 0.6,
          lineHeight: 1.5
        }}>
          <TextReveal text="Zajmuję się kompleksową realizacją wideo — od koncepcji, przez plan zdjęciowy, aż po postprodukcję." delay={0.7} />
        </div>
      </div>

      {/* ZDJĘCIE */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        style={{ width: "100%", marginBottom: "60px" }}
      >
        <img 
          src="/Images/Damian2.jpg" 
          alt="Damian" 
          style={{ width: "100%", height: "auto", borderRadius: "2px" }} 
        />
      </motion.div>

      {/* STOPKA - Pełna spójność z Menu/Kontakt (6px / 0.5 opacity) */}
      <div style={{
        paddingBottom: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px"
      }}>
        <p style={{ 
          fontFamily: "HelveticaCustom", 
          fontSize: "6px", 
          letterSpacing: "0.5px", 
          opacity: 0.5, 
          textTransform: "uppercase", 
          color: "#e8e4df" 
        }}>
          Strona zaprojektowana przez
        </p>
        <a href="https://www.whiteslope.studio/" target="_blank" rel="noopener noreferrer">
          <img src="/logos/whiteslopeStudioLogo.png" alt="Logo" style={{ height: "14px", opacity: 1 }} />
        </a>
      </div>
    </motion.div>
  );
}