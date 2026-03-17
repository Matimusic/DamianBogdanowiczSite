"use client";
import { motion, AnimatePresence } from "framer-motion";
import { TextReveal } from "@/hooks/useTextReveal";
import { useState } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: (id?: string) => void;
  onPortfolioOpen: () => void;
  onContactOpen: () => void;
  onAboutOpen: () => void;
}

export default function MenuOverlay({ isOpen, onClose, onPortfolioOpen, onContactOpen, onAboutOpen }: MenuOverlayProps) {
  const isMobile = useIsMobile();

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
          transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 450,
            background: "rgba(0, 0, 0, 0.95)", // Głębsza czerń
            backdropFilter: "blur(25px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "#e8e4df",
          }}
        >
          {/* PRZYCISK ZAMKNIĘCIA - Obniżony do 38px dla idealnego wyrównania */}
          <button 
            onClick={() => onClose()}
            style={{
              position: "absolute",
              top: isMobile ? "38px" : "40px", 
              right: isMobile ? "24px" : "clamp(20px, 5vw, 60px)",
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
              zIndex: 500,
              mixBlendMode: "difference",
            }}
          >
            <span style={{ 
              display: "block", 
              width: "18px", 
              height: "1px", 
              background: "#fff", 
              transform: "translateY(2.5px) rotate(45deg)",
            }} />
            <span style={{ 
              display: "block", 
              width: "18px", 
              height: "1px", 
              background: "#fff", 
              transform: "translateY(-2.5px) rotate(-45deg)",
            }} />
          </button>

          {/* GŁÓWNE MENU */}
          <div style={{ 
            textAlign: "center", 
            display: "flex", 
            flexDirection: "column", 
            gap: isMobile ? "2px" : "0px", 
            width: "100%",
          }}>
            {allMenuItems.map((item, index) => (
              <MenuButton key={item.label} item={item} index={index} isMobile={isMobile} />
            ))}
          </div>

          {/* STOPKA - 100% Widoczność */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            style={{ 
              position: "absolute", 
              bottom: isMobile ? "30px" : "40px", 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              gap: "8px" 
            }}
          >
            <p style={{ 
              fontFamily: "HelveticaCustom", 
              fontSize: "6px", 
              letterSpacing: "0.5", 
              opacity: 0.5, 
              textTransform: "uppercase",
              color: "#e8e4df"
            }}>
              Strona zaprojektowana przez
            </p>
            <a href="https://www.whiteslope.studio/" target="_blank" rel="noopener noreferrer">
              <img 
                src="/logos/whiteslopeStudioLogo.png" 
                alt="Logo" 
                style={{ height: "16px", opacity: 1 }} 
              />
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MenuButton({ item, index, isMobile }: { item: any; index: number; isMobile: boolean }) {
  const [isHovered, setIsHovered] = useState(false);

  const dynamicFontSize = isMobile ? "24px" : "clamp(40px, 6vw, 55px)";

  return (
    <motion.button
      onClick={() => item.action()}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      style={{
        background: "none",
        border: "none",
        color: "#e8e4df",
        cursor: "pointer",
        padding: "6px 20px",
        position: "relative",
        display: "grid",
        placeItems: "center",
        width: "100%",
        outline: "none"
      }}
    >
      {/* Helvetica */}
      <motion.div
        animate={{ 
          opacity: isHovered ? 0 : 1,
          y: isHovered ? -2 : 0,
        }}
        transition={{ duration: 0.2 }}
        style={{
          gridArea: "1/1",
          fontFamily: "HelveticaCustom, sans-serif",
          fontSize: dynamicFontSize,
          letterSpacing: isMobile ? "1px" : "4px",
          textTransform: "uppercase"
        }}
      >
        <TextReveal text={item.label} delay={0.1 + index * 0.05} />
      </motion.div>

      {/* Garamond (Tylko na Desktop Hover) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: isHovered ? 1 : 0,
          y: isHovered ? 0 : 2,
        }}
        transition={{ duration: 0.2 }}
        style={{
          gridArea: "1/1",
          fontFamily: "'AppleGaramond', serif",
          fontStyle: "italic",
          fontSize: dynamicFontSize,
          letterSpacing: "1px",
          color: "#fff2e5"
        }}
      >
        {item.label}
      </motion.div>
    </motion.button>
  );
}