"use client";
import { motion, AnimatePresence } from "framer-motion";
import { TextReveal } from "@/hooks/useTextReveal";

interface AboutMeOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onPortfolioOpen: () => void;
  onContactOpen: () => void;
}

export default function AboutMeOverlay({ 
  isOpen, 
  onClose, 
  onPortfolioOpen, 
  onContactOpen 
}: AboutMeOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          // Animacja identyczna jak w PortfolioOverlay
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "100%" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 600,
            background: "#050505",
            color: "#e8e4df",
            overflowY: "auto",
            padding: "100px clamp(20px, 5vw, 60px) 60px",
          }}
        >
          {/* PRZYCISK ZAMKNIĘCIA */}
          <button 
            onClick={onClose} 
            style={{ 
              position: "fixed", 
              top: "40px", 
              right: "60px", 
              background: "none", 
              border: "none", 
              color: "inherit", 
              cursor: "pointer", 
              fontFamily: "HelveticaCustom", 
              fontSize: "36px",
              letterSpacing: "4px"
            }}
          >
            ✕
          </button>

          {/* GÓRNA NAWIGACJA WEWNĄTRZ OVERLAY */}
<div style={{ 
  display: "flex", 
  gap: "30px", 
  marginBottom: "60px",
  fontFamily: "HelveticaCustom",
  fontSize: "14px",
  letterSpacing: "2px"
}}>
  {/* 1. STRONA GŁÓWNA (Zawsze zamyka obecny overlay) */}
  <button 
    onClick={onClose} 
    style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", opacity: 0.6, padding: 0 }}
  >
    STRONA GŁÓWNA
  </button>

  {/* 2. PORTFOLIO (lub O MNIE - zależy w którym pliku jesteś) */}
  <button 
    onClick={onPortfolioOpen} 
    style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", opacity: 0.6, padding: 0 }}
  >
    PORTFOLIO
  </button>

  {/* 3. KONTAKT */}
  <button 
    onClick={onContactOpen} 
    style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", opacity: 0.6, padding: 0 }}
  >
    KONTAKT
  </button>
</div>

          {/* MAIN HEADER - GIGANTYCZNY */}
          <div style={{ marginBottom: "60px", width: "100%" }}>
            <motion.h1 
              style={{ 
                fontFamily: "HelveticaCustom", 
                fontSize: "clamp(50px, 15vw, 180px)", 
                lineHeight: 0.9,
                letterSpacing: "-0.05em",
                textTransform: "uppercase", 
                margin: 0,
                fontWeight: "bold"
              }}
            >
              <TextReveal text="DAMIAN" delay={0.2} />
              <br />
              <TextReveal text="BOGDANOWICZ" delay={0.3} />
            </motion.h1>
          </div>

          {/* CONTENT SECTION - FULL WIDTH */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
            gap: "80px", 
            alignItems: "start",
            width: "100%"
          }}>
            
            {/* OPIS */}
            <div style={{ maxWidth: "800px" }}>
              <p style={{ 
                fontFamily: "HelveticaCustom", 
                fontSize: "clamp(18px, 3vw, 28px)", 
                lineHeight: 1.3,
                opacity: 0.9,
                marginBottom: "40px"
              }}>
                <TextReveal 
                  text="FILMMAKER & CINEMATOGRAPHER BAZUJĄCY W POLSCE. MOJA PRACA TO NIE TYLKO OBRAZ, TO EMOCJE UCHWYCONE W KADRZE." 
                  delay={0.5} 
                />
              </p>
              
              <div style={{ 
                fontFamily: "'AppleGaramond', serif", 
                fontStyle: "italic", 
                fontSize: "20px", 
                opacity: 0.6,
                maxWidth: "600px",
                lineHeight: 1.6
              }}>
                <TextReveal 
                  text="Zajmuję się kompleksową realizacją wideo — od koncepcji, przez plan zdjęciowy, aż po postprodukcję. Każdy projekt traktuję jako nową historię do opowiedzenia." 
                  delay={0.7} 
                />
              </div>
            </div>

            {/* ZDJĘCIE - BEZ PRZYCINANIA */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              style={{ width: "100%" }}
            >
              <img 
                src="/Images/Damian2.jpg" 
                alt="Damian Bogdanowicz work" 
                style={{ 
                  width: "100%", 
                  height: "auto", // Zachowuje proporcje
                  display: "block",
                  borderRadius: "2px"
                }} 
              />
            </motion.div>
          </div>

          {/* --- STOPKA Z LOGO WHITESLOPE --- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            style={{
              marginTop: "120px",
              paddingBottom: "40px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
              width: "100%"
            }}
          >
            <p style={{ 
              fontFamily: "HelveticaCustom", 
              fontSize: "10px", 
              letterSpacing: "2px", 
              opacity: 0.5,
              textTransform: "uppercase",
              margin: 0
            }}>
              Strona zaprojektowana przez
            </p>
            <a 
              href="https://www.whiteslope.studio/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ transition: "opacity 0.3s" }}
            >
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