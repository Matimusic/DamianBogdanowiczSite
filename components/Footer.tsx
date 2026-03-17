"use client";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Instagram, Youtube } from "lucide-react"; 

interface FooterProps {
  onPortfolioOpen: () => void;
  onContactOpen: () => void;
  onAboutClick: () => void;
}

export default function Footer({ onPortfolioOpen, onContactOpen, onAboutClick }: FooterProps) {
  const isMobile = useIsMobile();

  return (
    <footer 
      style={{ 
        padding: isMobile ? "60px 24px 40px" : "60px clamp(32px, 6vw, 80px) 40px", 
        background: "#d31236", 
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh", 
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* --- ZDJĘCIE WTOPIONE --- */}
      <div
        style={{
          position: "absolute",
          top: 0, right: 0, bottom: 0,
          width: isMobile ? "100%" : "50%", 
          backgroundImage: "url('/Images/Damian1.jpg')",
          backgroundSize: "cover",
          backgroundPosition: isMobile ? "center" : "center right",
          opacity: isMobile ? 0.3 : 1,
          mixBlendMode: "multiply",
          filter: "grayscale(1) brightness(0.7)",
          maskImage: isMobile 
            ? "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)" 
            : "linear-gradient(to left, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage: isMobile 
            ? "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)" 
            : "linear-gradient(to left, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 100%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 2, width: "100%", flex: 1, display: "flex", flexDirection: "column" }}>
        
        {/* TOP: LOGO I INFO */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <img 
            src="/logos/logoDB7.png" 
            alt="DB Logo" 
            style={{ height: isMobile ? "40px" : "6vh", filter: "invert(1)" }} 
          />
          <div style={{ textAlign: "right", fontFamily: "HelveticaCustom", fontWeight: "300", letterSpacing: isMobile ? "2px" : "0.3vh", opacity: 0.9 }}>
            <p style={{ margin: 0, fontSize: isMobile ? "10px" : "1.8vh" }}>DAMIAN BOGDANOWICZ</p>
            <p style={{ margin: 0, fontSize: isMobile ? "10px" : "1.8vh" }}>2026</p>
          </div>
        </div>

        {/* CENTER: GŁÓWNA NAWIGACJA (VH) */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <nav style={{ display: "flex", flexDirection: "column", gap: isMobile ? "10px" : "1vh" }}>
            {[
              { label: "O MNIE", action: onAboutClick },
              { label: "PORTFOLIO", action: onPortfolioOpen },
              { label: "KONTAKT", action: onContactOpen }
            ].map((item) => (
              <motion.button
                key={item.label}
                onClick={item.action}
                whileHover={!isMobile ? { x: 20, opacity: 0.6 } : {}}
                style={{ 
                  background: "none", border: "none", color: "#ffffff", 
                  fontFamily: "HelveticaCustom", fontSize: isMobile ? "7vh" : "11vh", 
                  fontWeight: "100", textAlign: "left", cursor: "pointer",
                  padding: 0, lineHeight: 0.85, letterSpacing: "-0.05em",
                  width: "fit-content", textTransform: "uppercase"
                }}
              >
                {item.label}
              </motion.button>
            ))}
          </nav>
        </div>

        {/* BOTTOM: SOCIALS + COPYRIGHT (NA GÓRZE DOLNEJ BELKI) */}
        <div style={{ width: "100%", marginTop: "auto" }}>
          
          <div style={{ 
            display: "flex", 
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "flex-end",
            gap: isMobile ? "20px" : "0",
            paddingBottom: "40px",
            borderBottom: "1px solid rgba(255,255,255,0.2)"
          }}>
            {/* SOCIAL MEDIA */}
            <div style={{ display: "flex", gap: isMobile ? "20px" : "40px" }}>
              <a href="https://www.instagram.com/damian_bogdanowicz/" target="_blank" style={{ display: "flex", alignItems: "center", gap: "8px", color: "white", textDecoration: "none", fontFamily: "HelveticaCustom", fontWeight: "300" }}>
                <Instagram size={isMobile ? 16 : "2vh"} strokeWidth={1.5} />
                <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                  <span style={{ fontSize: isMobile ? "1.8vh" : "1.8vh", letterSpacing: "3px" }}>INSTAGRAM</span>
                  <span style={{ fontSize: isMobile ? "1.2vh" : "1.3vh", opacity: 0.4, letterSpacing: "1px" }}>damian_bogdanowicz</span>
                </div>
              </a>
              <a href="https://www.youtube.com/@DamianBogdanowicz" target="_blank" style={{ display: "flex", alignItems: "center", gap: "8px", color: "white", textDecoration: "none", fontFamily: "HelveticaCustom", fontWeight: "300" }}>
                <Youtube size={isMobile ? 16 : "2vh"} strokeWidth={1.5} />
                <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                  <span style={{ fontSize: isMobile ? "1.8vh" : "1.8vh", letterSpacing: "3px" }}>YOUTUBE</span>
                  <span style={{ fontSize: isMobile ? "1.2vh" : "1.3vh", opacity: 0.4, letterSpacing: "1px" }}>@damianbogdanowicz</span>
                </div>
              </a>
            </div>

            {/* COPYRIGHT */}
            <p style={{ fontFamily: "HelveticaCustom", fontSize: isMobile ? "8px" : "1.2vh", fontWeight: "300", letterSpacing: "1px", margin: 0, opacity: 0.6 }}>
              © 2026 DAMIAN BOGDANOWICZ.
            </p>
          </div>

          {/* WHITESLOPE NANO - IDEALNIE NA ŚRODKU POD LINIĄ */}
          <div style={{ 
            marginTop: "40px", 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            gap: "10px" 
          }}>
            <p style={{ fontFamily: "HelveticaCustom", fontSize: isMobile ? "6px" : "0.8vh", letterSpacing: "1.5px", opacity: 0.4, textTransform: "uppercase", margin: 0 }}>
              Strona zaprojektowana przez
            </p>
            <a href="https://www.whiteslope.studio/" target="_blank">
              <motion.img 
                src="/logos/whiteslopeStudioLogo.png" 
                alt="Logo" 
                style={{ height: isMobile ? "14px" : "2.2vh", filter: "brightness(0) invert(1)" }} 
                whileHover={{ scale: 1.05 }}
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}