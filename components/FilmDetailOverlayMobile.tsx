"use client";
import { motion, AnimatePresence } from "framer-motion";
import { TextReveal } from "@/hooks/useTextReveal";
import { FILMS_DETAILS } from "@/data/filmsData";
import { CLIPS } from "@/data/clips";
import { useHorizontalScroll } from "@/hooks/useHorizontalScroll";
import { Play } from "lucide-react";

interface FilmDetailOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onPortfolioOpen: () => void;
  onContactOpen: () => void;
  slug: string | null;
  onFilmChange: (newSlug: string) => void;
}

const getEmbedUrl = (url: string) => {
  if (!url) return "";
  let videoId = "";
  if (url.includes("v=")) videoId = url.split("v=")[1].split("&")[0];
  else if (url.includes("youtu.be/")) videoId = url.split("youtu.be/")[1].split("?")[0];
  else videoId = url.split("/").pop() || "";
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&rel=0&modestbranding=1&playsinline=1`;
};

export default function FilmDetailOverlayMobile({ 
  isOpen, 
  onClose, 
  onPortfolioOpen, 
  onContactOpen, 
  slug, 
  onFilmChange 
}: FilmDetailOverlayProps) {
  
  const film = slug ? FILMS_DETAILS[slug] : null;
  const setCarouselRef = useHorizontalScroll();

  return (
    <AnimatePresence>
      {isOpen && film && (
        <motion.div
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "100%" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          id="film-overlay-container-mobile"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 600,
            background: "#050505",
            color: "#e8e4df",
            overflowY: "auto",
            overflowX: "hidden",
            padding: "80px 24px 60px",
          }}
        >
          {/* --- NANO NAWIGACJA (6px) --- */}
          <div style={{ 
            position: "absolute", 
            top: "24px", 
            left: "24px", 
            display: "flex", 
            gap: "12px", 
            zIndex: 700,
            fontFamily: "HelveticaCustom",
            fontSize: "6px",
            letterSpacing: "2px",
            paddingTop: "12px"
          }}>
            <button onClick={onClose} style={{ background: "none", border: "none", color: "inherit", opacity: 0.5, padding: 0 }}>STRONA GŁÓWNA</button>
            <button onClick={onPortfolioOpen} style={{ background: "none", border: "none", color: "inherit", opacity: 0.5, padding: 0 }}>PORTFOLIO</button>
            <button onClick={onContactOpen} style={{ background: "none", border: "none", color: "inherit", opacity: 0.5, padding: 0 }}>KONTAKT</button>
          </div>

          {/* --- NANO "X" --- */}
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

          {/* --- HEADER --- */}
          <header style={{ marginBottom: "4vh", marginTop: "2vh" }}>
            <h1 style={{ 
              fontFamily: "HelveticaCustom", 
              fontSize: "6vh", 
              fontWeight: "100", 
              lineHeight: 0.9, 
              letterSpacing: "-0.05em",
              textTransform: "uppercase",
              margin: 0
            }}>
              <TextReveal text={film.title} delay={0.1} />
            </h1>
            <p style={{ fontFamily: "HelveticaCustom", fontSize: "1.2vh", letterSpacing: "3px", opacity: 0.4, marginTop: "2vh", textTransform: "uppercase" }}>
              {film.category} <span style={{margin: "0 10px"}}>|</span> {film.year}
            </p>
          </header>

          {/* --- PLAYER --- */}
          <section style={{ 
            width: "calc(100% + 48px)", 
            marginLeft: "-24px",
            marginBottom: "4vh",
            background: "#000"
          }}>
            <div style={{ aspectRatio: "16/9", overflow: "hidden" }}>
              <iframe 
                width="100%" 
                height="100%" 
                src={getEmbedUrl(film.videoUrl)} 
                frameBorder="0" 
                allow="autoplay; fullscreen" 
                allowFullScreen 
              />
            </div>
          </section>

          {/* --- DESCRIPTION & CREDITS --- */}
          <div style={{ display: "flex", flexDirection: "column", gap: "5vh", marginBottom: "8vh" }}>
            <p style={{ 
              fontFamily: "HelveticaCustom", 
              fontSize: "2.5vh", 
              lineHeight: 1.2, 
              fontWeight: "300",
              color: "#ffffff",
            }}>
              {film.description}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5vh" }}>
              {film.credits.map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "1vh" }}>
                  <span style={{ fontFamily: "HelveticaCustom", fontSize: "1vh", opacity: 0.3, letterSpacing: "2px", textTransform: "uppercase" }}>{item.label}</span>
                  <span style={{ fontFamily: "HelveticaCustom", fontSize: "1.6vh", fontWeight: "100", letterSpacing: "1px", color: "#ffffff", textTransform: "uppercase" }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* --- KARUZELA PROJEKTÓW --- */}
          <section style={{ padding: "4vh 0" }}>
            <h3 style={{ fontFamily: "HelveticaCustom", fontSize: "1.4vh", letterSpacing: "2px", opacity: 0.6, marginBottom: "3vh", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "1vh" }}>POZOSTAŁE PROJEKTY</h3>
            <div ref={setCarouselRef} style={{ display: "flex", gap: "20px", overflowX: "auto", scrollbarWidth: "none", paddingBottom: "2vh" }}>
              {CLIPS.map((clip) => (
                <div
                  key={clip.id}
                  onClick={() => {
                    onFilmChange(clip.slug);
                    document.getElementById("film-overlay-container-mobile")?.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  style={{ flex: "0 0 30vh" }}
                >
                  <div style={{ aspectRatio: "16/9", background: "#111", overflow: "hidden", position: "relative", borderRadius: "4px" }}>
                    <video src={clip.src} muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <p style={{ fontFamily: "HelveticaCustom", fontSize: "1.8vh", textTransform: "uppercase", marginTop: "1.5vh" }}>{clip.title}</p>
                </div>
              ))}
            </div>
          </section>

          {/* --- SEKCJA BANERÓW DAMIAN --- */}
          <section style={{ 
            width: "100vw", 
            marginLeft: "-24px", 
            height: "50vh", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            position: "relative",
            background: "#000",
            overflow: "hidden",
            marginTop: "4vh"
          }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/Images/Damian1.jpg')", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.15, mixBlendMode: "luminosity" }} />
            <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 20px" }}>
              <h2 style={{ fontFamily: "HelveticaCustom", fontSize: "4vh", fontWeight: "500", lineHeight: 1, letterSpacing: "-0.04em", textTransform: "uppercase" }}>
                FILMY <span style={{ color: "#d31236" }}>PRZYKUWAJĄCE</span> WZROK
              </h2>
            </div>
          </section>

          {/* --- TICKER --- */}
          <div style={{ 
            width: "100vw", 
            marginLeft: "-24px", 
            padding: "20px 0", 
            background: "#050505", 
            borderTop: "1px solid rgba(255,255,255,0.1)",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            overflow: "hidden"
          }}>
            <p style={{ fontFamily: "HelveticaCustom", fontSize: "7px", letterSpacing: "4px", textTransform: "uppercase", opacity: 0.4, textAlign: "center", whiteSpace: "nowrap" }}>
              FILMY KRÓTKIE • FILMY DŁUGIE • TELEDYSKI • REELSY
            </p>
          </div>

          {/* --- FOOTER WHITESLOPE --- */}
          <div style={{ marginTop: "40px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
            <p style={{ fontFamily: "HelveticaCustom", fontSize: "6px", letterSpacing: "0.5px", opacity: 0.5, textTransform: "uppercase" }}>
              STRONA ZAPROJEKTOWANA PRZEZ
            </p>
            <a href="https://www.whiteslope.studio/" target="_blank">
              <img src="/logos/whiteslopeStudioLogo.png" alt="Logo" style={{ height: "14px" }} />
            </a>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}