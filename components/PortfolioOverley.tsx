"use client";
import { motion, AnimatePresence } from "framer-motion";
import { TextReveal } from "@/hooks/useTextReveal";
import { useHorizontalScroll } from "@/hooks/useHorizontalScroll";

interface PortfolioOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const ROLKI_TAGS = ["#ALL", "#COMMERCIAL", "#LIFESTYLE", "#DRONE"];
const FILMY_TAGS = ["#NARRATIVE", "#MUSIC_VIDEO", "#DOCUMENTARY"];

export default function PortfolioOverlay({ isOpen, onClose }: PortfolioOverlayProps) {
  // Tworzymy dwie osobne referencje, żeby każda lista przewijała się niezależnie
  const rolkiRef = useHorizontalScroll();
  const filmyRef = useHorizontalScroll();

  // Wspólny styl dla kontenera przewijanego
  const listContainerStyle: React.CSSProperties = {
    display: "flex",
    gap: "20px",
    overflowX: "hidden", // Hook zajmie się przewijaniem, więc chowamy scrollbar
    paddingBottom: "20px",
    flexWrap: "nowrap", // To kluczowe: zabrania zawijania do nowej linii
    cursor: "grab", // Wizualna wskazówka, że można łapać
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "100%" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 500,
            background: "#050505",
            color: "#e8e4df",
            overflowY: "auto",
            padding: "100px clamp(20px, 5vw, 60px) 60px",
          }}
        >
          {/* CLOSE BUTTON */}
          <button onClick={onClose} style={{ position: "fixed", top: "40px", right: "60px", background: "none", border: "none", color: "inherit", cursor: "pointer", fontFamily: "HelveticaCustom", fontSize: "12px", letterSpacing: "4px", zIndex: 510 }}>
            ZAMKNIJ
          </button>

          {/* MAIN HEADER */}
          <div style={{ marginBottom: "80px" }}>
            <motion.h1 style={{ fontFamily: "HelveticaCustom", fontSize: "clamp(40px, 10vw, 100px)", letterSpacing: "-2px", textTransform: "uppercase", margin: 0 }}>
              <TextReveal text="PORTFOLIO" delay={0.2} />
            </motion.h1>
          </div>

          {/* SEKCJA ROLKI */}
          <section style={{ marginBottom: "100px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "30px", borderBottom: "1px solid rgba(232,228,223,0.1)", paddingBottom: "15px" }}>
              <h2 style={{ fontFamily: "HelveticaCustom", fontSize: "14px", letterSpacing: "3px", opacity: 0.6 }}>ROLKI</h2>
              <div style={{ display: "flex", gap: "20px" }}>
                {ROLKI_TAGS.map((tag) => (
                  <span key={tag} style={{ fontFamily: "HelveticaCustom", fontSize: "10px", cursor: "pointer", opacity: 0.4 }}>{tag}</span>
                ))}
              </div>
            </div>
            
            <div ref={rolkiRef} style={listContainerStyle}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <motion.div key={i} whileHover={{ scale: 0.98 }} style={{ flex: "0 0 280px", cursor: "pointer" }}>
                  <div style={{ aspectRatio: "9/16", background: "#111", borderRadius: "8px", overflow: "hidden", marginBottom: "15px" }}>
                    <img src={`/api/placeholder/280/500`} alt="Short" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7, pointerEvents: "none" }} />
                  </div>
                  <p style={{ fontFamily: "HelveticaCustom", fontWeight: "bold", fontSize: "16px", margin: "0 0 4px" }}>TITLE_REEL_{i}</p>
                  <p style={{ fontFamily: "'AppleGaramond', serif", fontStyle: "italic", fontSize: "13px", opacity: 0.6 }}>Commercial / 2024</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* SEKCJA FILMY */}
<section style={{ marginBottom: "120px" }}>
  <div style={{ /* ... twoje style nagłówka ... */ }}>
    <h2 style={{ fontFamily: "HelveticaCustom", fontSize: "14px", letterSpacing: "3px", opacity: 0.6 }}>FILMY</h2>
    {/* ... tagi ... */}
  </div>

  {/* KONTENER Z HOOKIEM */}
  <div 
    ref={filmyRef} 
    style={{ 
      display: "flex", 
      gap: "40px", 
      overflowX: "auto", // Zmieniamy na auto, żeby hook mógł sterować scrollem
      paddingBottom: "20px",
      flexWrap: "nowrap", // ABSOLUTNIE KLUCZOWE: nie zawijaj linii
      cursor: "grab",
      scrollbarWidth: "none", // Ukrywa scrollbar na Firefox
      msOverflowStyle: "none", // Ukrywa scrollbar na IE/Edge
    }}
    className="hide-scrollbar" // Dodaj klasę, żeby ukryć scrollbar w CSS (Chrome/Safari)
  >
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <motion.div 
        key={i} 
        style={{ 
          flex: "0 0 600px", // Nie rośnij, nie kurcz się, szerokość 600px
          cursor: "pointer",
          userSelect: "none" // Zapobiega zaznaczaniu tekstu podczas przeciągania
        }}
      >
        <div style={{ aspectRatio: "16/9", background: "#111", borderRadius: "4px", overflow: "hidden", marginBottom: "20px", position: "relative" }}>
          <img 
            src={`/api/placeholder/600/337`} 
            alt="Movie" 
            style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} // pointerEvents: none jest ważne dla draga!
          />
          <div style={{ position: "absolute", bottom: "20px", left: "20px", width: "40px", height: "40px", borderRadius: "50%", border: "1px solid white", display: "flex", alignItems: "center", justifyContent: "center" }}>▶</div>
        </div>
        <p style={{ fontFamily: "HelveticaCustom", fontWeight: "bold", fontSize: "20px", margin: "0 0 5px", textTransform: "uppercase" }}>PROJECT_NAME_{i}</p>
        <p style={{ fontFamily: "'AppleGaramond', serif", fontStyle: "italic", fontSize: "14px", opacity: 0.5 }}>Directed by Damian Bogdanowicz — Cinematography</p>
      </motion.div>
    ))}
  </div>
</section>

          {/* STOPKA */}
          <div style={{ marginTop: "100px", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", opacity: 0.4 }}>
            <p style={{ fontFamily: "HelveticaCustom", fontSize: "10px", letterSpacing: "2px" }}>DESIGNED BY</p>
            <a href="https://www.whiteslope.studio/" target="_blank">
              <img src="/logos/whiteslopeStudioLogo.png" alt="Whiteslope" style={{ height: "20px" }} />
            </a>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}