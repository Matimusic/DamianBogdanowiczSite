"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { TextReveal } from "@/hooks/useTextReveal";

interface HeaderProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  scrollTo: (id: string) => void;
  onPortfolioOpen: () => void;
  onContactOpen: () => void;
}

export default function Header({ menuOpen, setMenuOpen, scrollTo, onPortfolioOpen, onContactOpen }: HeaderProps) {
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
        setIsVisible(false);
      }, 3000);
    };

    resetTimer();
    window.addEventListener("mousemove", resetTimer);

    return () => {
      window.removeEventListener("mousemove", resetTimer);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [menuOpen]);

  const handleLogoMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    logoControls.start({
      x: x * 0.2,
      y: y * 0.2,
      rotate: (x / rect.width) * 10,
      transition: { type: "spring", stiffness: 150, damping: 15, mass: 0.1 }
    });
  };

  const handleLogoMouseLeave = () => {
    logoControls.start({
      x: 0,
      y: 0,
      rotate: 0,
      transition: { type: "spring", stiffness: 150, damping: 15, mass: 0.1 }
    });
  };

  return (
    <motion.nav
      initial={{ top: "0px" }}
      animate={{ top: isVisible ? "0px" : "-150px" }}
      transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        zIndex: 300,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "30px clamp(20px, 5vw, 60px)",
        background: "transparent",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: -1,
          height: "200%",
          background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0) 50%, transparent 100%)",
          backdropFilter: "blur(12px)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 20%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 0%, black 20%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      {/* LEFT - PORTFOLIO */}
      <div style={{ flex: 1 }}>
        {!menuOpen && (
          <motion.button
            onClick={onPortfolioOpen}
            whileHover={{ fontWeight: "bold", scale: 1.05 }}
            style={{
              background: "none",
              border: "none",
              color: "#e8e4df",
              fontFamily: "HelveticaCustom, sans-serif",
              fontSize: "18px", // POWIĘKSZONE
              letterSpacing: "3px",
              cursor: "pointer",
              textTransform: "uppercase",
              fontWeight: "normal",
              transition: "font-weight 0.2s ease"
            }}
          >
            PORTFOLIO
          </motion.button>
        )}
      </div>

      {/* CENTER - LOGO */}
      <div 
        style={{ 
          flex: 1, 
          display: "flex", 
          justifyContent: "center",
          perspective: "1000px", 
          alignItems: "center" 
        }}
      >
        <motion.button 
          onClick={() => {
            scrollTo("home");
            if (menuOpen) setMenuOpen(false);
          }} 
          onMouseMove={handleLogoMouseMove}
          onMouseLeave={handleLogoMouseLeave}
          animate={logoControls}
          whileHover={{ scale: 1.05 }} 
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{ 
            background: "none", 
            border: "none", 
            cursor: "pointer",
            display: "inline-block",
            mixBlendMode: "difference", 
            color: "#fff"
          }}
        >
          <motion.img 
            src="/logos/logoDB7.png" 
            alt="DB Logo" 
            style={{ 
              height: "100px", 
              width: "auto",
            }} 
          />
        </motion.button>
      </div>

      {/* RIGHT - KONTAKT */}
      <div style={{ flex: 1, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "40px" }}>
        {!menuOpen && (
          <motion.button
            onClick={onContactOpen}
            whileHover={{ fontWeight: "bold", scale: 1.05 }}
            style={{
              background: "none",
              border: "none",
              color: "#e8e4df",
              fontFamily: "HelveticaCustom, sans-serif",
              fontSize: "18px", // POWIĘKSZONE
              letterSpacing: "3px",
              cursor: "pointer",
              textTransform: "uppercase",
              fontWeight: "normal",
              transition: "font-weight 0.2s ease"
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
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            padding: "10px",
            position: "relative",
            zIndex: 400,
            mixBlendMode: "difference",
          }}
        >
          <span style={{ display: "block", width: "30px", height: "2px", background: "#fff", transition: "0.2s", transform: menuOpen ? "translateY(8px) rotate(45deg)" : "none" }} />
          <span style={{ display: "block", width: "30px", height: "2px", background: "#fff", transition: "0.2s", opacity: menuOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: "30px", height: "2px", background: "#fff", transition: "0.2s", transform: menuOpen ? "translateY(-8px) rotate(-45deg)" : "none" }} />
        </button>
      </div>
    </motion.nav>
  );
}