"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { TextReveal } from "@/hooks/useTextReveal";
import { useIsMobile } from "@/hooks/useIsMobile";

interface HeaderProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  scrollTo: (id: string) => void;
  onPortfolioOpen: () => void;
  onContactOpen: () => void;
}

export default function Header({ menuOpen, setMenuOpen, scrollTo, onPortfolioOpen, onContactOpen }: HeaderProps) {
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(true);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logoControls = useAnimation();

  useEffect(() => {
    if (menuOpen) {
      setIsVisible(true);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      return;
    }

    const resetTimer = () => {
      setIsVisible(true);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => {
        if (!isMobile) setIsVisible(false);
      }, 3000);
    };

    resetTimer();
    window.addEventListener("mousemove", resetTimer);
    return () => {
      window.removeEventListener("mousemove", resetTimer);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [menuOpen, isMobile]);

  const handleLogoMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    logoControls.start({
      x: x * 0.2, y: y * 0.2, rotate: (x / rect.width) * 10,
      transition: { type: "spring", stiffness: 150, damping: 15, mass: 0.1 }
    });
  };

  const handleLogoMouseLeave = () => {
    logoControls.start({ x: 0, y: 0, rotate: 0, transition: { type: "spring", stiffness: 150, damping: 15, mass: 0.1 } });
  };

  return (
    <motion.nav
      initial={{ y: 0 }}
      // Zmieniamy na y, żeby płynnie chować cały pasek bez błędów w top
      animate={{ y: isVisible ? 0 : -200 }} 
      transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
      style={{
        position: "fixed",
        top: 0, // ZAWSZE 0, żeby gradient mógł zacząć się od krawędzi
        left: 0,
        right: 0,
        zIndex: 300,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        // Kontrolujemy pozycję treści przez padding
        padding: isMobile ? "24px 24px 0 24px" : "30px clamp(20px, 5vw, 60px)",
        background: "transparent",
      }}
    >
      {/* --- BACKGROUND / GRADIENT AREA --- */}
      <div
        style={{
          position: "absolute",
          top: 0, // Zaczyna się od samej góry ekranu
          left: 0,
          right: 0,
          zIndex: -1,
          // Wysokość wystarczająca, żeby przykryć cały header + trochę niżej
          height: isMobile ? "120px" : "200px", 
          background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0) 100%)",
          backdropFilter: "blur(12px)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      {/* LEFT - PORTFOLIO */}
      <div style={{ flex: isMobile ? "none" : 1, display: isMobile ? "none" : "block" }}>
        {!menuOpen && !isMobile && (
          <motion.button
            onClick={onPortfolioOpen}
            whileHover={{ fontWeight: "bold", scale: 1.05 }}
            style={{
              background: "none", border: "none", color: "#e8e4df",
              fontFamily: "HelveticaCustom, sans-serif", fontSize: "18px",
              letterSpacing: "3px", cursor: "pointer", textTransform: "uppercase",
              fontWeight: "normal", transition: "font-weight 0.2s ease"
            }}
          >
            PORTFOLIO
          </motion.button>
        )}
      </div>

      {/* CENTER - LOGO */}
      <div 
        style={{ 
          flex: isMobile ? "none" : 1, 
          display: "flex", 
          justifyContent: isMobile ? "flex-start" : "center",
          perspective: "1000px", 
          alignItems: "center" 
        }}
      >
        <motion.button 
          onClick={() => { scrollTo("home"); if (menuOpen) setMenuOpen(false); }} 
          onMouseMove={handleLogoMouseMove}
          onMouseLeave={handleLogoMouseLeave}
          animate={logoControls}
          whileHover={{ scale: 1.05 }} 
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{ 
            background: "none", border: "none", cursor: "pointer",
            display: "inline-block", mixBlendMode: "difference", color: "#fff"
          }}
        >
          <motion.img 
            src="/logos/logoDB7.png" 
            alt="DB Logo" 
            style={{ height: isMobile ? "50px" : "100px", width: "auto" }} 
          />
        </motion.button>
      </div>

      {/* RIGHT - KONTAKT & HAMBURGER */}
      <div style={{ flex: 1, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: isMobile ? "10px" : "40px" }}>
        {!menuOpen && !isMobile && (
          <motion.button
            onClick={onContactOpen}
            whileHover={{ fontWeight: "bold", scale: 1.05 }}
            style={{
              background: "none", border: "none", color: "#e8e4df",
              fontFamily: "HelveticaCustom, sans-serif", fontSize: "18px",
              letterSpacing: "3px", cursor: "pointer", textTransform: "uppercase",
              fontWeight: "normal", transition: "font-weight 0.2s ease"
            }}
          >
            KONTAKT
          </motion.button>
        )}

        <button
  onClick={() => setMenuOpen(!menuOpen)}
  style={{
    background: "none",
    border: "none",
    cursor: "pointer",
    // TWOJE WYMIARY:
    width: "32px",
    height: "32px",
    // CENTROWANIE ZAWARTOŚCI:
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "4px", // Mniejszy odstęp między kreskami, bo button jest mniejszy
    padding: 0,
    position: "relative",
    zIndex: 400,
    mixBlendMode: "difference",
  }}
>
  {/* GÓRNA KRESKA */}
  <span style={{ 
    display: "block", 
    width: "18px", // Szerokość dopasowana do 32px
    height: "1px", 
    background: "#fff", 
    transition: "0.3s ease", 
    transform: menuOpen ? "translateY(6px) rotate(45deg)" : "none" 
  }} />

  {/* ŚRODKOWA KRESKA */}
  <span style={{ 
    display: "block", 
    width: "18px", 
    height: "1px", 
    background: "#fff", 
    transition: "0.3s ease", 
    opacity: menuOpen ? 0 : 1 
  }} />

  {/* DOLNA KRESKA */}
  <span style={{ 
    display: "block", 
    width: "18px", 
    height: "1px", 
    background: "#fff", 
    transition: "0.3s ease", 
    transform: menuOpen ? "translateY(-6px) rotate(-45deg)" : "none" 
  }} />
</button>
      </div>
    </motion.nav>
  );
}