"use client";
import { motion, AnimatePresence } from "framer-motion";
import { TextReveal } from "@/hooks/useTextReveal";
import { useHorizontalScroll } from "@/hooks/useHorizontalScroll";
import { PORTFOLIO_REELS } from "@/data/portfolioReels";
import { PORTFOLIO_FILMS } from "@/data/portfolioFilms";
import { useState } from "react";
import { usePortfolioFilms } from "@/hooks/usePortfolioFilms";
import { usePortfolioReels } from "@/hooks/usePortfolioReels";

interface PortfolioOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onAboutOpen: () => void;
  onContactOpen: () => void;
}

const ROLKI_TAGS = ["#ALL", "#COMMERCIAL", "#LIFESTYLE"];
const FILMY_TAGS = ["#NARRATIVE", "#MUSIC_VIDEO"];

const SkeletonMobile = ({ width, aspect }: { width: string, aspect: string }) => (
  <div style={{ flex: `0 0 ${width}`, userSelect: "none" }}>
    <motion.div
      style={{
        aspectRatio: aspect,
        background: "linear-gradient(90deg, #111 25%, #222 50%, #111 75%)",
        backgroundSize: "200% 100%",
        borderRadius: "4px",
        marginBottom: "10px",
      }}
      animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
    />
    <div style={{ height: "10px", width: "80%", background: "#111", borderRadius: "2px", marginBottom: "4px" }} />
    <div style={{ height: "8px", width: "50%", background: "#111", borderRadius: "2px" }} />
  </div>
);

// Funkcja pomocnicza do YouTube
const getEmbedUrl = (url: string) => {
  let videoId = "";
  if (url.includes("shorts/")) {
    videoId = url.split("shorts/")[1].split("?")[0];
  } else if (url.includes("watch?v=")) {
    videoId = url.split("v=")[1].split("&")[0];
  } else {
    videoId = url.split("/").pop() || "";
  }
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
};

export default function PortfolioOverlayMobile({ isOpen, onClose, onAboutOpen, onContactOpen }: PortfolioOverlayProps) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const setRolkiRef = useHorizontalScroll();
  const setFilmyRef = useHorizontalScroll();

  // POBIERANIE DANYCH Z GOOGLE SHEETS
  const { films, isLoading: isFilmsLoading } = usePortfolioFilms();
  const { reels, isReelsLoading } = usePortfolioReels();

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
        padding: "80px 0 60px", // Padding boczny zerowy dla karuzeli, dodamy go wewnatrz
      }}
    >
      {/* PRZYCISK ZAMKNIĘCIA - Idealnie 24px/24px */}
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
          zIndex: 700,
          mixBlendMode: "difference"
        }}
      >
        <span style={{ display: "block", width: "18px", height: "1px", background: "#fff", transform: "translateY(2.5px) rotate(45deg)" }} />
        <span style={{ display: "block", width: "18px", height: "1px", background: "#fff", transform: "translateY(-2.5px) rotate(-45deg)" }} />
      </button>

      {/* GÓRNA NAWIGACJA - Font 6px, margines 24px */}
      <div style={{
        position: "absolute",
        top: "24px",
        left: "24px",
        display: "flex",
        gap: "12px",
        fontFamily: "HelveticaCustom",
        fontSize: "6px",
        letterSpacing: "2px",
        paddingTop: "12px"
      }}>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "inherit", opacity: 0.5 }}>STRONA GŁÓWNA</button>
        <button onClick={onAboutOpen} style={{ background: "none", border: "none", color: "inherit", opacity: 0.5 }}>O MNIE</button>
        <button onClick={onContactOpen} style={{ background: "none", border: "none", color: "inherit", opacity: 0.5 }}>KONTAKT</button>
      </div>

      {/* HEADER */}
      <div style={{ padding: "0 24px", marginBottom: "40px" }}>
        <h1 style={{ fontFamily: "HelveticaCustom", fontSize: "32px", textTransform: "uppercase", margin: 0, letterSpacing: "-1px" }}>
          <TextReveal text="PORTFOLIO" delay={0.2} />
        </h1>
      </div>

      {/* SEKCJA ROLKI */}
      <section style={{ marginBottom: "60px" }}>
        <div style={{ padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "15px" }}>
          <h2 style={{ fontFamily: "HelveticaCustom", fontSize: "8px", letterSpacing: "2px", opacity: 0.6 }}>ROLKI</h2>
          <div style={{ display: "flex", gap: "10px" }}>
            {ROLKI_TAGS.map(tag => (
              <span key={tag} style={{ fontSize: "6px", opacity: 0.4 }}>{tag}</span>
            ))}
          </div>
        </div>

        <div ref={setRolkiRef} style={{ display: "flex", gap: "15px", overflowX: "auto", padding: "0 24px", scrollbarWidth: "none" }}>
          {isReelsLoading ? (
            <>
              <SkeletonMobile width="160px" aspect="9/16" />
              <SkeletonMobile width="160px" aspect="9/16" />
              <SkeletonMobile width="160px" aspect="9/16" />
            </>
          ) : (
            reels.map((reel, index) => (
              <div key={index} onClick={() => setActiveVideo(reel.link)} style={{ flex: "0 0 160px" }}>
                <div style={{ aspectRatio: "9/16", background: "#111", borderRadius: "4px", overflow: "hidden", marginBottom: "10px" }}>
                  <img src={reel.thumbnail} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <p style={{ fontSize: "10px", fontFamily: "HelveticaCustom", textTransform: "uppercase", marginBottom: "2px" }}>{reel.title}</p>
                <p style={{ fontSize: "8px", fontFamily: "AppleGaramond", fontStyle: "italic", opacity: 0.5 }}>{reel.subtitle}</p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* SEKCJA FILMY */}
      <section style={{ marginBottom: "60px" }}>
        <div style={{ padding: "0 24px", marginBottom: "15px" }}>
          <h2 style={{ fontFamily: "HelveticaCustom", fontSize: "8px", letterSpacing: "2px", opacity: 0.6 }}>FILMY</h2>
        </div>

        <div ref={setFilmyRef} style={{ display: "flex", gap: "15px", overflowX: "auto", padding: "0 24px", scrollbarWidth: "none" }}>
          {isFilmsLoading ? (
            <>
              <SkeletonMobile width="260px" aspect="16/9" />
              <SkeletonMobile width="260px" aspect="16/9" />
            </>
          ) : (
            films.map((film, index) => (
              <div key={index} onClick={() => setActiveVideo(film.youtubeUrl)} style={{ flex: "0 0 260px" }}>
                <div style={{ aspectRatio: "16/9", background: "#111", borderRadius: "4px", overflow: "hidden", marginBottom: "10px", position: "relative" }}>
                  <img src={film.thumbnailUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", bottom: "10px", left: "10px", fontSize: "12px" }}>▶</div>
                </div>
                <p style={{ fontSize: "10px", fontFamily: "HelveticaCustom", textTransform: "uppercase", marginBottom: "2px" }}>{film.title}</p>
                <p style={{ fontSize: "8px", fontFamily: "AppleGaramond", fontStyle: "italic", opacity: 0.5 }}>{film.subtitle}</p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* STOPKA - Zgodna z Menu/Kontakt (6px / 0.5 opacity) */}
      <div style={{ marginTop: "40px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
        <p style={{ fontFamily: "HelveticaCustom", fontSize: "6px", letterSpacing: "0.5px", opacity: 0.5, textTransform: "uppercase" }}>
          Strona zaprojektowana przez
        </p>
        <a href="https://www.whiteslope.studio/" target="_blank" rel="noopener noreferrer">
          <img src="/logos/whiteslopeStudioLogo.png" alt="Logo" style={{ height: "14px" }} />
        </a>
      </div>

      {/* MODAL VIDEO */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.95)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
            onClick={() => setActiveVideo(null)}
          >
            <div style={{ width: "100%", aspectRatio: activeVideo.includes("shorts") ? "9/16" : "16/9", background: "#000" }}>
              <iframe width="100%" height="100%" src={getEmbedUrl(activeVideo)} frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}