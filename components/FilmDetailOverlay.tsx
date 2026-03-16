"use client";
import { motion, AnimatePresence } from "framer-motion";
import { TextReveal } from "@/hooks/useTextReveal";
import { FILMS_DETAILS } from "@/data/filmsData";
import { CLIPS } from "@/data/clips";
import { useHorizontalScroll } from "@/hooks/useHorizontalScroll";
import { Plus, Play } from "lucide-react";

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

  // mute=0 - dźwięk włączony
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&rel=0&modestbranding=1&playsinline=1`;
};

export default function FilmDetailOverlay({ 
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
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "100%" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          id="film-overlay-container"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 600,
            background: "#050505",
            color: "#e8e4df",
            overflowY: "auto",
            overflowX: "hidden",
            padding: "100px clamp(20px, 5vw, 60px) 60px",
          }}
        >
          {/* --- IDENTYCZNA NAWIGACJA JAK W PORTFOLIO --- */}
          <div style={{ 
            position: "fixed", 
            top: "40px", 
            left: "clamp(20px, 5vw, 60px)", 
            display: "flex", 
            gap: "30px", 
            zIndex: 610,
            fontFamily: "HelveticaCustom",
            fontSize: "12px",
            letterSpacing: "4px"
          }}>
            <button onClick={onClose} style={{ background: "none", border: "none", color: "#e8e4df", cursor: "pointer", opacity: 0.6, padding: 0 }}>
              STRONA GŁÓWNA
            </button>
            <button onClick={onPortfolioOpen} style={{ background: "none", border: "none", color: "#e8e4df", cursor: "pointer", opacity: 0.6, padding: 0 }}>
              PORTFOLIO
            </button>
            <button onClick={onContactOpen} style={{ background: "none", border: "none", color: "#e8e4df", cursor: "pointer", opacity: 0.6, padding: 0 }}>
              KONTAKT
            </button>
          </div>

          <button 
            onClick={onClose} 
            style={{ 
              position: "fixed", top: "35px", right: "60px", 
              background: "none", border: "none", color: "inherit", 
              cursor: "pointer", fontFamily: "HelveticaCustom", fontSize: "36px", zIndex: 610 
            }}
          >
            ✕
          </button>

          {/* --- HEADER --- */}
          <header style={{ marginBottom: "60px", marginTop: "40px" }}>
            <h1 style={{ 
              fontFamily: "HelveticaCustom", 
              fontSize: "clamp(45px, 11vw, 170px)", 
              fontWeight: "100", 
              lineHeight: 0.8, 
              letterSpacing: "-0.05em",
              textTransform: "uppercase",
              margin: 0
            }}>
              <TextReveal text={film.title} delay={0.1} />
            </h1>
            <p style={{ fontFamily: "HelveticaCustom", fontSize: "12px", letterSpacing: "5px", opacity: 0.4, marginTop: "25px", textTransform: "uppercase" }}>
              {film.category} <span style={{margin: "0 15px"}}>|</span> {film.year}
            </p>
          </header>

          {/* --- PLAYER --- */}
        <section style={{ 
        width: "95vw", 
        position: "relative",
        left: "50%", // Przesuń o połowę szerokości rodzica
        transform: "translateX(-50%)", // Coofnij o połowę własnej szerokości
        marginBottom: "80px",
        boxShadow: "0 40px 100px -20px rgba(0,0,0,0.5)" // Subtelny cień, żeby film "odstawał" od tła
        }}>
        <div style={{ aspectRatio: "16/9", background: "#000", overflow: "hidden" }}>
            <iframe 
            width="100%" 
            height="100%" 
            src={getEmbedUrl(film.videoUrl)} 
            frameBorder="0" 
            allow="autoplay; fullscreen; accelerometer; gyroscope; picture-in-picture"
            allowFullScreen 
            />
        </div>
        </section>

          {/* --- DESCRIPTION & CREDITS (PURE CINEMATIC) --- */}
<div style={{ 
  display: "grid", 
  gridTemplateColumns: "1.2fr 1fr", 
  gap: "50px", 
  marginBottom: "150px",
  
  alignItems: "start"
}}>
  
  {/* LEWA KOLUMNA: Opis (HelveticaCustom) */}
  <div style={{ paddingTop: "10px" }}>
    <p style={{ 
      fontFamily: "HelveticaCustom", 
      fontSize: "clamp(20px, 2.5vw, 34px)", 
      lineHeight: 1.1, 
      fontWeight: "300",
      letterSpacing: "-0.02em",
      color: "#ffffff",
      
    }}>
      {film.description}
    </p>
  </div>

  {/* PRAWA KOLUMNA: Hollywood Credits Style */}
  <div style={{ 
    display: "flex", 
    flexDirection: "column", 
    gap: "20px" 
  }}>
    {film.credits.map((item, i) => (
      <div key={i} style={{ 
        display: "grid", 
        gridTemplateColumns: "1fr 1fr", 
        gap: "30px",
        alignItems: "baseline"
      }}>
        {/* ROLA: Prawa strona osi środkowej */}
        <span style={{ 
          fontFamily: "HelveticaCustom", 
          fontSize: "10px", 
          textAlign: "right", 
          opacity: 0.3, 
          letterSpacing: "3px", 
          textTransform: "uppercase" 
        }}>
          {item.label}
        </span>

        {/* NAZWISKO / SPRZĘT: Lewa strona osi środkowej */}
        <span style={{ 
          fontFamily: "HelveticaCustom", 
          fontSize: "15px", 
          textAlign: "left", 
          fontWeight: "100", 
          letterSpacing: "1px",
          color: "#ffffff",
          textTransform: "uppercase"
        }}>
          {item.value}
        </span>
      </div>
    ))}
  </div>
</div>

          {/* --- KARUZELA PROJEKTÓW --- */}
          <section style={{ padding: "100px 0" }}>
            <h3 style={{ fontFamily: "HelveticaCustom", fontSize: "14px", letterSpacing: "4px", opacity: 0.6, marginBottom: "50px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "15px" }}>POZOSTAŁE PROJEKTY</h3>
            <div ref={setCarouselRef} style={{ display: "flex", gap: "40px", overflowX: "auto", scrollbarWidth: "none", paddingBottom: "40px" }}>
              {CLIPS.map((clip) => {
                return (
                  <motion.div
                    key={clip.id}
                    onClick={() => {
                      onFilmChange(clip.slug);
                      document.getElementById("film-overlay-container")?.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    whileHover={{ scale: 1.02 }}
                    style={{ flex: "0 0 500px", cursor: "pointer" }}
                  >
                    <div style={{ aspectRatio: "16/9", background: "#111", overflow: "hidden", position: "relative" }}>
                      <video src={clip.src} muted loop style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.9 }} onMouseEnter={e => e.currentTarget.play()} onMouseLeave={e => e.currentTarget.pause()} />
                      <div style={{ position: "absolute", bottom: "25px", left: "25px", color: "#d31236" }}><Play size={20} /></div>
                    </div>
                    <p style={{ fontFamily: "HelveticaCustom", fontSize: "18px", fontWeight: "100", textTransform: "uppercase", marginTop: "20px" }}>{clip.title}</p>
                  </motion.div>
                );
              })}
            </div>
          </section>

          

          {/* --- SEKCJA: DAMIAN - TEKST - DAMIAN (FULL WIDTH) --- */}
          <section style={{ 
            width: "100vw", 
            marginLeft: "calc(-1 * clamp(20px, 5vw, 60px))", 
            height: "75vh", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            position: "relative",
            background: "#000",
            overflow: "hidden"
          }}>
            <div style={{ position: "absolute", left: 0, width: "45%", height: "100%", backgroundImage: "url('/Images/Damian1.jpg')", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.1, mixBlendMode: "luminosity", maskImage: "linear-gradient(to right, black 20%, transparent 100%)", WebkitMaskImage: "linear-gradient(to right, black 20%, transparent 100%)" }} />
            
            <div style={{ position: "relative", zIndex: 10, textAlign: "center" }}>
              <h2 style={{ fontFamily: "HelveticaCustom", fontSize: "clamp(40px, 8vw, 110px)", fontWeight: "500", lineHeight: 0.9, letterSpacing: "-0.04em", textTransform: "uppercase" }}>
                FILMY <span style={{ color: "#d31236" }}><br />PRZYKUWAJĄCE</span> <br /> WZROK
              </h2>
            </div>

            <div style={{ position: "absolute", right: 0, width: "45%", height: "100%", backgroundImage: "url('/Images/Damian2.jpg')", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.1, mixBlendMode: "luminosity", maskImage: "linear-gradient(to left, black 20%, transparent 100%)", WebkitMaskImage: "linear-gradient(to left, black 20%, transparent 100%)" }} />
          </section>

          {/* --- PASEK USŁUG (TICKER) - NAD SEKCJĄ DAMIANA --- */}
          <div style={{ 
            width: "100vw", 
            marginLeft: "calc(-1 * clamp(20px, 5vw, 60px))", 
            padding: "35px 0", 
            background: "#050505", 
            borderTop: "1px solid rgba(255,255,255,0.1)",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            justifyContent: "center"
          }}>
            <p style={{ fontFamily: "HelveticaCustom", fontSize: "10px", fontWeight: "100", letterSpacing: "8px", textTransform: "uppercase", opacity: 0.5 }}>
              FILMY KRÓTKIE <span style={{color: "#d31236", margin: "0 20px"}}>•</span> FILMY DŁUGIE <span style={{color: "#d31236", margin: "0 20px"}}>•</span> TELEDYSKI <span style={{color: "#d31236", margin: "0 20px"}}>•</span> REELSY <span style={{color: "#d31236", margin: "0 20px"}}>•</span> SHORTY <span style={{color: "#d31236", margin: "0 20px"}}>•</span> TIKTOK FORMAT
            </p>
          </div>

          

          {/* --- FOOTER WHITESLOPE --- */}
          <div style={{ 
            marginTop: "60px", 
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}