"use client";
import { motion } from "framer-motion";
import { Instagram, Youtube } from "lucide-react";

interface FooterProps {
  onPortfolioOpen: () => void;
  onContactOpen: () => void;
  onAboutClick: () => void;
}

export default function Footer({ onPortfolioOpen, onContactOpen, onAboutClick }: FooterProps) {
  return (
    <footer 
      style={{ 
        padding: "120px clamp(20px, 5vw, 80px) 40px", 
        background: "#d31236", // TWOJA CZERWIEŃ
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "100vh",
        position: "relative", // Potrzebne do pozycjonowania zdjęcia
        overflow: "hidden" // Zabezpiecza przed wystawaniem zdjęcia
      }}
    >
      {/* --- ZDJĘCIE DAMIANA WTOPIONE W TŁO Z PRAWEJ --- */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: "50%", // Zajmuje połowę szerokości
          backgroundImage: "url('/Images/Damian1.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center right",
          opacity: 1, // Subtelna widoczność
          mixBlendMode: "multiply", // KLUCZOWE: Wtapia zdjęcie w czerwień
          filter: "grayscale(1) brightness(0.8)", // Skala szarości + lekkie przyciemnienie
          maskImage: "linear-gradient(to left, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)", // Gradientowa maska od prawej (pełna) do środka (przezroczysta)
          WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 100%)",
          pointerEvents: "none", // Żeby nie zasłaniało klikania w linki
        }}
      />

      {/* --- TREŚĆ STOPKI (musi być zIndex, żeby była nad zdjęciem) --- */}
      <div style={{ position: "relative", zIndex: 2, width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
        
        {/* TOP: LOGO I INFO */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "60px" }}>
          <img 
            src="/logos/logoDB7.png" 
            alt="DB Logo" 
            style={{ height: "90px", filter: "invert(1)" }} 
          />
          <div style={{ textAlign: "right", fontFamily: "HelveticaCustom", fontWeight: "300", letterSpacing: "5px", opacity: 0.9 }}>
            <p style={{ margin: 0, fontSize: "16px" }}>DAMIAN BOGDANOWICZ</p>
            <p style={{ margin: 0, fontSize: "16px" }}>2026</p>
          </div>
        </div>

        {/* CENTER: GIGANTYCZNA NAWIGACJA (CIENKA) */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "0px", margin: "40px 0" }}>
          {[
            { label: "O MNIE", action: onAboutClick },
            { label: "PORTFOLIO", action: onPortfolioOpen },
            { label: "KONTAKT", action: onContactOpen }
          ].map((item) => (
            <motion.button
              key={item.label}
              onClick={item.action}
              whileHover={{ x: 20, opacity: 0.6 }}
              style={{ 
                background: "none", 
                border: "none", 
                color: "#ffffff", 
                fontFamily: "HelveticaCustom", 
                fontSize: "clamp(50px, 14vw, 170px)", 
                fontWeight: "100", // ULTRA CIENKIE
                textAlign: "left", 
                cursor: "pointer",
                padding: 0,
                lineHeight: 0.85,
                letterSpacing: "-0.05em",
                width: "fit-content"
              }}
            >
              {item.label}
            </motion.button>
          ))}
        </nav>

        {/* BOTTOM: SOCIALS + COPYRIGHT + WHITESLOPE CENTERED */}
        <div style={{ width: "100%", marginTop: "auto" }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "flex-end",
            paddingBottom: "60px",
            borderBottom: "1px solid rgba(255,255,255,0.2)"
          }}>
            {/* SOCIALS */}
            <div style={{ display: "flex", gap: "40px" }}>
              <a href="https://www.instagram.com/damian_bogdanowicz/" target="_blank" style={{ color: "white", textDecoration: "none", fontFamily: "HelveticaCustom", fontSize: "14px", letterSpacing: "2px", fontWeight: "300" }}>
                INSTAGRAM
              </a>
              <a href="https://www.youtube.com/@DamianBogdanowicz" target="_blank" style={{ color: "white", textDecoration: "none", fontFamily: "HelveticaCustom", fontSize: "14px", letterSpacing: "2px", fontWeight: "300" }}>
                YOUTUBE
              </a>
            </div>

            {/* COPYRIGHT */}
            <p style={{ 
              fontFamily: "HelveticaCustom", 
              fontSize: "12px", 
              fontWeight: "300", 
              letterSpacing: "1px",
              margin: 0,
              opacity: 0.8 
            }}>
              © 2026 DAMIAN BOGDANOWICZ. WSZYSTKIE PRAWA ZASTRZEŻONE.
            </p>
          </div>

          {/* WHITESLOPE LOGO - IDEALNIE NA ŚRODKU NA SAMYM DOLE */}
          <div style={{ 
            marginTop: "40px", 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            gap: "15px" 
          }}>
            <p style={{ fontFamily: "HelveticaCustom", fontSize: "9px", letterSpacing: "3px", opacity: 0.5 }}>
              STRONA ZAPROJEKTOWANA PRZEZ
            </p>
            <a href="https://www.whiteslope.studio/" target="_blank">
              <motion.img 
                src="/logos/whiteslopeStudioLogo.png" 
                alt="Whiteslope Studio" 
                style={{ height: "25px", filter: "brightness(0) invert(1)" }}
                whileHover={{ scale: 1.1 }}
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}