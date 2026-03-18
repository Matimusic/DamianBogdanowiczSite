"use client";
import { motion, AnimatePresence } from "framer-motion";
import { TextReveal } from "@/hooks/useTextReveal";
import { useHorizontalScroll } from "@/hooks/useHorizontalScroll";
import { PORTFOLIO_REELS } from "@/data/portfolioReels";
import { PORTFOLIO_FILMS } from "@/data/portfolioFilms";
import { useState } from "react";
import { usePortfolioFilms } from "@/hooks/usePortfolioFilms"; // Importujemy hooka
import { usePortfolioReels } from "@/hooks/usePortfolioReels"; // Importujemy hooka

interface PortfolioOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onAboutOpen: () => void;
  onContactOpen: () => void;
}

const ROLKI_TAGS = ["#ALL", "#COMMERCIAL", "#LIFESTYLE", "#DRONE"];
const FILMY_TAGS = ["#NARRATIVE", "#MUSIC_VIDEO", "#DOCUMENTARY"];

// Funkcja pomocnicza do YouTube Embed
const getEmbedUrl = (url: string) => {
  let videoId = "";
  
  if (url.includes("shorts/")) {
    videoId = url.split("shorts/")[1].split("?")[0];
  } else if (url.includes("watch?v=")) {
    videoId = url.split("v=")[1].split("&")[0];
  } else {
    // obsługa linków typu youtu.be/ID
    videoId = url.split("/").pop() || "";
  }

  // Dodajemy origin, żeby YouTube wiedział, że to legalne osadzenie
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&origin=${origin}`;
};

// Sub-komponent Playera
const VideoPlayerOverlay = ({ url, onClose }: { url: string; onClose: () => void }) => {
  const isShort = url.includes("shorts") || url.includes("embed");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,0.98)", // Bardzo ciemne tło dla lepszego kontrastu
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "zoom-out",
        padding: "10px" // Minimalny margines od krawędzi ekranu
      }}
    >
      <motion.button 
        onClick={onClose}
        whileHover={{ scale: 1.2, opacity: 1 }}
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 0.5 }}
        style={{ 
          position: "fixed", top: "20px", right: "20px", 
          color: "white", background: "none", border: "none", 
          fontSize: "50px", fontWeight: "100", cursor: "pointer", zIndex: 1010 
        }}
      >
        ✕
      </motion.button>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          background: "#000",
          boxShadow: "0 0 100px rgba(0,0,0,1)",
          
          // DLA ROLEK (9:16):
          // DLA FILMÓW (16:9):
          // Wybieramy mniejszą wartość między szerokością a wysokością, aby zachować proporcje
          width: isShort 
            ? "min(95vw, calc(98vh * 9 / 16))" 
            : "min(98vw, calc(98vh * 16 / 9))",
          height: isShort 
            ? "min(98vh, calc(95vw * 16 / 9))" 
            : "min(98vh, calc(98vw * 9 / 16))",
            
          aspectRatio: isShort ? "9/16" : "16/9",
        }}
      >
        <iframe
          width="100%"
          height="100%"
          src={getEmbedUrl(url)}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{ 
            width: "100%",
            height: "100%",
            border: "none"
          }}
        />
      </motion.div>
    </motion.div>
  );
};

const karuzela_styl: React.CSSProperties = {
  display: "flex",
  gap: "20px",
  overflowX: "auto",
  overflowY: "hidden",
  paddingBottom: "20px",
  flexWrap: "nowrap",
  cursor: "grab",
  width: "100%",
  boxSizing: "border-box",
  scrollbarWidth: "none",
  msOverflowStyle: "none",
};

const SkeletonFilmCard = () => {
  return (
    <div style={{ flex: "0 0 600px", userSelect: "none" }}>
      {/* Miniaturka 16/9 z efektem shine */}
      <motion.div
        style={{
          aspectRatio: "16/9",
          background: "linear-gradient(90deg, #111 25%, #222 50%, #111 75%)",
          backgroundSize: "200% 100%",
          borderRadius: "4px",
          marginBottom: "20px",
        }}
        animate={{
          backgroundPosition: ["200% 0", "-200% 0"],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      {/* Pasek tytułu */}
      <motion.div
        style={{
          height: "24px",
          width: "60%",
          background: "#111",
          borderRadius: "4px",
          marginBottom: "10px",
        }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* Pasek podtytułu */}
      <motion.div
        style={{
          height: "16px",
          width: "40%",
          background: "#111",
          borderRadius: "4px",
        }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
      />
    </div>
  );
};

const SkeletonReelCard = () => (
  <div style={{ flex: "0 0 280px" }}>
    <motion.div
      style={{
        aspectRatio: "9/16",
        background: "linear-gradient(90deg, #111 25%, #222 50%, #111 75%)",
        backgroundSize: "200% 100%",
        borderRadius: "8px",
        marginBottom: "15px",
      }}
      animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
    />
    <div style={{ height: "18px", width: "70%", background: "#111", borderRadius: "4px", marginBottom: "8px" }} />
    <div style={{ height: "14px", width: "40%", background: "#111", borderRadius: "4px" }} />
  </div>
);

export default function PortfolioOverlay({ isOpen, onClose, onAboutOpen, onContactOpen }: PortfolioOverlayProps) {
  // 1. Hooki do przewijania (używamy Callback Ref)
  const setRolkiRef = useHorizontalScroll();
  const setFilmyRef = useHorizontalScroll();

  // 2. STAN DLA AKTYWNEGO FILMU (Tego brakowało!)
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  // POBIERAMY DANE Z GOOGLE SHEETS
  const { films, isLoading } = usePortfolioFilms();
  // POBIERAMY ROLKI Z GOOGLE SHEETS
  const { reels, isReelsLoading } = usePortfolioReels();

  return (
    <AnimatePresence>
      {isOpen && (
        <> {/* DODANY FRAGMENT - NAPRAWIA BŁĄD JEDNEGO RODZICA */}
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
              overflowX: "hidden",
              padding: "100px clamp(20px, 5vw, 60px) 60px",
            }}
          >
            {/* NAWIGACJA */}
<div 
  style={{ 
    position: "fixed", 
    top: "40px", 
    left: "clamp(20px, 5vw, 60px)", 
    display: "flex", 
    gap: "30px", 
    zIndex: 510 
  }}
>
  <button 
    onClick={onClose} 
    style={{ 
      background: "none", 
      border: "none", 
      color: "#e8e4df", 
      cursor: "pointer", 
      fontFamily: "HelveticaCustom", 
      fontSize: "12px", 
      letterSpacing: "4px", 
      opacity: 0.6,
      padding: 0 
    }}
  >
    STRONA GŁÓWNA
  </button>

  <button 
    onClick={onAboutOpen} 
    style={{ 
      background: "none", 
      border: "none", 
      color: "#e8e4df", 
      cursor: "pointer", 
      fontFamily: "HelveticaCustom", 
      fontSize: "12px", 
      letterSpacing: "4px", 
      opacity: 0.6,
      padding: 0 
    }}
  >
    O MNIE
  </button>

  <button 
    onClick={onContactOpen} 
    style={{ 
      background: "none", 
      border: "none", 
      color: "#e8e4df", 
      cursor: "pointer", 
      fontFamily: "HelveticaCustom", 
      fontSize: "12px", 
      letterSpacing: "4px", 
      opacity: 0.6,
      padding: 0 
    }}
  >
    KONTAKT
  </button>
</div>

            <button onClick={onClose} style={{ position: "fixed", top: "40px", right: "60px", background: "none", border: "none", color: "inherit", cursor: "pointer", fontFamily: "HelveticaCustom", fontSize: "36px", letterSpacing: "4px", zIndex: 510 }}>
              
            ✕
            </button>

            {/* HEADER */}
            <div style={{ marginBottom: "80px" }}>
              <motion.h1 style={{ fontFamily: "HelveticaCustom", fontSize: "clamp(40px, 10vw, 100px)", letterSpacing: "-2px", textTransform: "uppercase", margin: 0 }}>
                <TextReveal text="PORTFOLIO" delay={0.2} />
              </motion.h1>
            </div>

            {/* SEKCJA ROLKI */}
            <section style={{ marginBottom: "100px" }}>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "flex-end", 
                marginBottom: "30px", 
                borderBottom: "1px solid rgba(232,228,223,0.1)", 
                paddingBottom: "15px" 
              }}>
                <h2 style={{ fontFamily: "HelveticaCustom", fontSize: "14px", letterSpacing: "3px", opacity: 0.6 }}>ROLKI</h2>
                <div style={{ display: "flex", gap: "20px" }}>
                  {ROLKI_TAGS.map((tag) => (
                    <span key={tag} style={{ fontFamily: "HelveticaCustom", fontSize: "10px", cursor: "pointer", opacity: 0.4 }}>{tag}</span>
                  ))}
                </div>
              </div>

              <div ref={setRolkiRef} style={karuzela_styl}>
                {isReelsLoading ? (
                  // Wyświetlamy 4 szkielety podczas ładowania
                  <>
                    <SkeletonReelCard />
                    <SkeletonReelCard />
                    <SkeletonReelCard />
                    <SkeletonReelCard />
                    <SkeletonReelCard />
                    <SkeletonReelCard />
                    <SkeletonReelCard />
                  </>
                ) : (
                  reels.map((reel, index) => (
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={() => setActiveVideo(reel.link)}
                      style={{ flex: "0 0 280px", cursor: "pointer" }}
                    >
                      <div style={{ 
                        aspectRatio: "9/16", 
                        background: "#111", 
                        borderRadius: "8px", 
                        overflow: "hidden", 
                        marginBottom: "15px", 
                        position: "relative" 
                      }}>
                        <img 
                          src={reel.thumbnail} 
                          alt={reel.title} 
                          style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} 
                        />
                        {/* Opcjonalna ikonka play na rolce */}
                        <div style={{ 
                          position: "absolute", 
                          top: "50%", 
                          left: "50%", 
                          transform: "translate(-50%, -50%)", 
                          opacity: 0.5,
                          fontSize: "24px"
                        }}>▶</div>
                      </div>
                      <p style={{ 
                        fontFamily: "HelveticaCustom", 
                        fontWeight: "bold", 
                        fontSize: "16px", 
                        margin: "0 0 4px", 
                        textTransform: "uppercase" 
                      }}>{reel.title}</p>
                      <p style={{ 
                        fontFamily: "'AppleGaramond', serif", 
                        fontStyle: "italic", 
                        fontSize: "13px", 
                        opacity: 0.6 
                      }}>{reel.subtitle}</p>
                    </motion.div>
                  ))
                )}
              </div>
            </section>

            {/* SEKCJA FILMY */}
            <section style={{ marginBottom: "120px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "30px", borderBottom: "1px solid rgba(232,228,223,0.1)", paddingBottom: "15px" }}>
                <h2 style={{ fontFamily: "HelveticaCustom", fontSize: "14px", letterSpacing: "3px", opacity: 0.6 }}>FILMY</h2>
                <div style={{ display: "flex", gap: "20px" }}>
                  {FILMY_TAGS.map((tag) => (
                    <span key={tag} style={{ fontFamily: "HelveticaCustom", fontSize: "10px", cursor: "pointer", opacity: 0.4 }}>{tag}</span>
                  ))}
                </div>
              </div>

              <div ref={setFilmyRef} style={{ ...karuzela_styl, gap: "40px" }}>
                {isLoading ? (
                  // Renderujemy 3 szkielety zamiast napisu
                  <>
                    <SkeletonFilmCard />
                    <SkeletonFilmCard />
                    <SkeletonFilmCard />
                    <SkeletonFilmCard />
                  </>
                ) : (
                  films.map((film, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ flex: "0 0 600px", userSelect: "none" }}
                      onClick={() => setActiveVideo(film.youtubeUrl)}
                    >
                      <div style={{ aspectRatio: "16/9", background: "#111", borderRadius: "4px", overflow: "hidden", marginBottom: "20px", position: "relative" }}>
                        <img src={film.thumbnailUrl} alt={film.title} style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} />
                        <div style={{ position: "absolute", bottom: "20px", left: "20px", width: "40px", height: "40px", borderRadius: "50%", border: "1px solid white", display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>▶</div>
                      </div>
                      <p style={{ fontFamily: "HelveticaCustom", fontWeight: "bold", fontSize: "20px", margin: "0 0 5px", textTransform: "uppercase" }}>{film.title}</p>
                      <p style={{ fontFamily: "'AppleGaramond', serif", fontStyle: "italic", fontSize: "14px", opacity: 0.5 }}>{film.subtitle}</p>
                    </motion.div>
                  ))
                )}
              </div>
            </section>

            {/* STOPKA */}
            <div style={{ marginTop: "100px", paddingBottom: "40px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
              <p style={{ fontFamily: "HelveticaCustom", fontSize: "10px", letterSpacing: "2px", opacity: 0.5, textTransform: "uppercase" }}>Strona zaprojektowana przez</p>
              <a href="https://www.whiteslope.studio/" target="_blank" rel="noopener noreferrer">
                <img src="/logos/whiteslopeStudioLogo.png" alt="Whiteslope Studio" style={{ height: "25px" }} />
              </a>
            </div>
          </motion.div>

          {/* PLAYER VIDEO */}
          <AnimatePresence>
            {activeVideo && (
              <VideoPlayerOverlay 
                url={activeVideo} 
                onClose={() => setActiveVideo(null)} 
              />
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}