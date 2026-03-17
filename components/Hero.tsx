"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useScroll, useTransform, useMotionValueEvent, MotionValue } from "framer-motion";
import { TextReveal } from "@/hooks/useTextReveal";
import { useLoadingPopup } from "@/hooks/useLoadingPopup";
import { CLIPS, type FilmClip } from "@/data/clips";
import { blobUrlCache } from "@/data/blobCache";
import { useIsMobile } from "@/hooks/useIsMobile";

// --- NOWE STAŁE DLA PŁYNNOŚCI ---
const STEP = 1300;           // Jeszcze trochę więcej miejsca na spokojny scroll
const REST = 600;            // Postój filmu
const MOVE = STEP - REST;    // Wjazd trwa 700px
const FADE_IN_DIST = 550;    // Wydłużony Fade In (z czerni do filmu)
const FADE_OUT_DIST = 500;   // Wydłużony Fade Out (z filmu do czerni)
const ENTRY_ADVANCE = 120;   // Delikatnie wcześniejszy start wjazdu kolejnego filmu
const CAPTION_SYNC_DELAY = 220; // Napisy pojawiają się chwilę po starcie kolejnego klipu
const CAPTION_FADE_IN_DIST = 180;
const FIRST_CAPTION_INSTANT_VISIBLE_PX = 1;
const CAPTION_HIDE_DELAY_MS = 3000;
const IS_PROD = process.env.NODE_ENV === 'production';
const PREFIX = IS_PROD ? '/DamianBogdanowiczSite' : '';

const easeInOutCubic = (t: number) => {
  if (t < 0.5) return 4 * t * t * t;
  return 1 - Math.pow(-2 * t + 2, 3) / 2;
};

const linear = (t: number) => t;

interface ClipItemProps {
  clip: FilmClip;
  index: number;
  scrollYProgress: MotionValue<number>;
  totalHeight: number;
  registerVideoRef: (index: number, element: HTMLVideoElement | null) => void;
  captionsVisible: boolean;
}

interface HeroProps {
  isPortfolioOpen: boolean;
  onFilmClick: (slug: string) => void; // Dodaj to
}

function ClipItem({ 
  clip, 
  index, 
  scrollYProgress, 
  totalHeight, 
  registerVideoRef, 
  captionsVisible, 
  isSafari 
}: ClipItemProps & { isSafari: boolean }) {
  
  // --- 1. OBLICZENIA SEKSEWNCJI SCROLLA ---
  const startMovePx = index * STEP;
  const shiftedStartMovePx = index === 0 ? startMovePx : Math.max(startMovePx - ENTRY_ADVANCE, 0);
  const endMovePx = shiftedStartMovePx + MOVE;
  const endRestPx = (index + 1) * STEP;

  const fadeInStartPx = startMovePx;
  const fadeInEndPx = startMovePx + FADE_IN_DIST;
  const fadeOutStartPx = endRestPx - FADE_OUT_DIST;

  const startMove = shiftedStartMovePx / totalHeight;
  const endMove = endMovePx / totalHeight;
  const endRest = endRestPx / totalHeight;
  const fadeInStart = fadeInStartPx / totalHeight;
  const fadeInEnd = fadeInEndPx / totalHeight;
  const fadeOutStart = fadeOutStartPx / totalHeight;

  // --- 2. ANIMACJE TRANSFORMACJI ---
  
  // Ruch góra-dół
  const y = useTransform(
    scrollYProgress,
    [startMove, endMove, endRest],
    [index === 0 ? "0%" : "105%", "0%", "0%"],
    { ease: [easeInOutCubic, linear] }
  );

  // Subtelne przybliżenie filmu
  const videoScale = useTransform(
    scrollYProgress,
    [startMove, endMove, endRest],
    [index === 0 ? 1 : 1.1, 1, 1.03],
    { ease: [easeInOutCubic, easeInOutCubic] }
  );

  // Przejścia jasności (Fade)
  const fadeInOpacity = useTransform(
    scrollYProgress,
    [fadeInStart, fadeInEnd],
    [index === 0 ? 0 : 1, 0],
    { ease: easeInOutCubic }
  );

  const fadeOutOpacity = useTransform(
    scrollYProgress,
    [fadeOutStart, endRest],
    [0, 1],
    { ease: easeInOutCubic }
  );

  // --- 3. INTELIGENTNA LOGIKA ŹRÓDŁA (R2 vs Lokal) ---
  const isExternal = clip.src.startsWith('http');
  
  // Jeśli link zaczyna się od http (R2), bierze go czystego. 
  // Jeśli nie, dodaje PREFIX pod GitHub Pages.
  const videoSrc = isExternal 
    ? clip.src 
    : (blobUrlCache.get(clip.src) ?? `${PREFIX}${clip.src}`);

  return (
    <motion.div
      style={{
        position: "absolute",
        inset: -1,
        zIndex: index,
        y,
        background: "#000",
        overflow: "hidden"
      }}
    >
      <motion.video
        ref={(el) => registerVideoRef(index, el)}
        // Jeśli to Safari, opcjonalnie wyłączamy autoPlay, by wymusić interakcję 
        // lub zostawiamy, licząc na to, że MP4/WebM zadziała.
        autoPlay={!isSafari} 
        loop 
        muted 
        playsInline
        preload="auto"
        // Kluczowe: src bezpośrednio w tagu video (Safari lepiej to znosi)
        src={videoSrc}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          scale: videoScale
        }}
      />

      {/* Warstwa wyłaniania z czerni */}
      <motion.div 
        style={{
          position: "absolute",
          inset: 0,
          background: "#000",
          zIndex: 4,
          opacity: fadeInOpacity,
          pointerEvents: "none"
        }}
      />

      {/* Warstwa wygaszania do czerni */}
      <motion.div 
        style={{
          position: "absolute",
          inset: 0,
          background: "#000",
          zIndex: 2,
          opacity: index === CLIPS.length - 1 ? 0 : fadeOutOpacity,
          pointerEvents: "none"
        }}
      />
      
      {/* Ciemny gradient na dole pod napisy */}
      <motion.div
        animate={{ opacity: captionsVisible ? 1 : 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 5,
          background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.95) 100%)",
          pointerEvents: "none"
        }}
      />
    </motion.div>
  );
}

export default function Hero({ isPortfolioOpen, onFilmClick }: HeroProps) {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const routeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [captionsVisible, setCaptionsVisible] = useState(true);
  const [headingHovered, setHeadingHovered] = useState(false);
  const [volume, setVolume] = useState(0);
  const savedVolumeRef = useRef(0);
  const [isVolHovered, setIsVolHovered] = useState(false);
  const [cursorHidden, setCursorHidden] = useState(false);
  const cursorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [durationSec, setDurationSec] = useState(0);
  const [bufferedSec, setBufferedSec] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [isSafari, setIsSafari] = useState(false);

useEffect(() => {
  // Prosty test na Safari (wykluczając Chrome i Androida)
  const userAgent = navigator.userAgent.toLowerCase();
  const isSafariBrowser = userAgent.includes('safari') && !userAgent.includes('chrome') && !userAgent.includes('android');
  setIsSafari(isSafariBrowser);
}, []);
  
  const totalScrollHeight = (CLIPS.length * STEP) + 100;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // --- NOWA LOGIKA: SYNCHRONIZACJA WYGASZANIA NAPISÓW ZE SCROLLEM ---
  const captionsScrollOpacity = useTransform(
    scrollYProgress,
    CLIPS.flatMap((_, i) => {
      const clipStartPx = i === 0 ? 0 : (i * STEP) + CAPTION_SYNC_DELAY;
      const fadeInEndPx = i === 0 ? FIRST_CAPTION_INSTANT_VISIBLE_PX : clipStartPx + CAPTION_FADE_IN_DIST;
      const endRestPx = (i + 1) * STEP;
      const fadeOutStartPx = endRestPx - FADE_OUT_DIST;

      const fadeInStart = clipStartPx / totalScrollHeight;
      const fadeInEnd = fadeInEndPx / totalScrollHeight;
      const fadeOutStart = fadeOutStartPx / totalScrollHeight;
      const fadeOutEnd = endRestPx / totalScrollHeight;

      // Delikatny fade in po starcie klipu + fade out przy końcu bez skoku 0->1.
      return [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd];
    }),
    CLIPS.flatMap((_, i) => (i === 0 ? [1, 1, 1, 0] : [0, 1, 1, 0])),
    { clamp: true }
  );

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const currentPx = latest * totalScrollHeight;
    const delayedPx = Math.max(currentPx - CAPTION_SYNC_DELAY, 0);
    const index = Math.floor(delayedPx / STEP);
    const clampedIndex = Math.min(Math.max(index, 0), CLIPS.length - 1);
    
    if (clampedIndex !== activeIndex) {
      setActiveIndex(clampedIndex);
    }
  });

  useEffect(() => {
  // 1. Jeśli to komórka, wymuszamy widoczność i nie odpalamy żadnych timerów
  if (isMobile) {
    setCaptionsVisible(true);
    return;
  }

  // 2. Jeśli to nie jest myszka (np. dotyk), też nie odpalamy ukrywania
  if (!window.matchMedia("(pointer: fine)").matches) {
    return;
  }

  const resetCaptionTimer = () => {
    setCaptionsVisible(true);

    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }

    hideTimerRef.current = setTimeout(() => {
      setCaptionsVisible(false);
    }, CAPTION_HIDE_DELAY_MS);
  };

  resetCaptionTimer();
  window.addEventListener("mousemove", resetCaptionTimer);

  return () => {
    window.removeEventListener("mousemove", resetCaptionTimer);
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
  };
}, [isMobile]);

  useEffect(() => {
    return () => {
      if (routeTimerRef.current) {
        clearTimeout(routeTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      if (cursorTimerRef.current) clearTimeout(cursorTimerRef.current);
    };
  }, []);



  // 2. ZASTĄP GŁÓWNY BLOK VIDEO (ten od linii 277) TYM:
useEffect(() => {
  videoRefs.current.forEach((v, i) => {
    if (!v) return;

    const isActive = i === activeIndex;
    
    if (isActive) {
      // 1. Określamy głośność docelową
      const targetVolume = isPortfolioOpen ? 0 : volume;

      // 2. Jeśli chcemy odtwarzać dźwięk, musimy najpierw odmutować wideo
      if (targetVolume > 0) {
        v.muted = false;
      }

      // 3. PŁYNNA ANIMACJA GŁOŚNOŚCI
      // Animujemy właściwość 'volume' elementu video od aktualnej do docelowej
      animate(v.volume, targetVolume, {
        duration: 0.8, // czas trwania fade'a (sekundy)
        ease: "easeInOut",
        onUpdate: (latest) => {
          v.volume = latest;
        },
        onComplete: () => {
          // 4. Jeśli zjechaliśmy do 0, mutujemy wideo dla pewności
          if (targetVolume === 0) {
            v.muted = true;
          }
        }
      });

      if (isPlaying) {
        v.play().catch(() => {
          v.muted = true;
          v.play().catch(() => {});
        });
      } else {
        v.pause();
      }
    } else {
      v.pause();
      v.muted = true;
      v.volume = 0;
    }
  });
}, [volume, activeIndex, isPlaying, isPortfolioOpen]);

  useEffect(() => {
    setCurrentTimeSec(0);
    setDurationSec(0);
    setBufferedSec(0);
    setIsPlaying(true);
    setIsVideoLoading(true);
  }, [activeIndex]);

  useEffect(() => {
    const activeVideo = videoRefs.current[activeIndex];
    if (!activeVideo) return;

    const updateFromReadyState = () => {
      // HAVE_FUTURE_DATA/HAVE_ENOUGH_DATA => można płynnie odtwarzać.
      setIsVideoLoading(activeVideo.readyState < 3);
    };

    const onWaiting = () => setIsVideoLoading(true);
    const onSeeking = () => setIsVideoLoading(true);
    const onSeeked = updateFromReadyState;
    const onStalled = () => setIsVideoLoading(true);
    const onCanPlay = updateFromReadyState;
    const onPlaying = () => setIsVideoLoading(false);
    const onProgress = updateFromReadyState;
    const onLoadedData = updateFromReadyState;

    updateFromReadyState();
    activeVideo.addEventListener("waiting", onWaiting);
    activeVideo.addEventListener("seeking", onSeeking);
    activeVideo.addEventListener("seeked", onSeeked);
    activeVideo.addEventListener("stalled", onStalled);
    activeVideo.addEventListener("canplay", onCanPlay);
    activeVideo.addEventListener("playing", onPlaying);
    activeVideo.addEventListener("progress", onProgress);
    activeVideo.addEventListener("loadeddata", onLoadedData);

    return () => {
      activeVideo.removeEventListener("waiting", onWaiting);
      activeVideo.removeEventListener("seeking", onSeeking);
      activeVideo.removeEventListener("seeked", onSeeked);
      activeVideo.removeEventListener("stalled", onStalled);
      activeVideo.removeEventListener("canplay", onCanPlay);
      activeVideo.removeEventListener("playing", onPlaying);
      activeVideo.removeEventListener("progress", onProgress);
      activeVideo.removeEventListener("loadeddata", onLoadedData);
    };
  }, [activeIndex]);

  useEffect(() => {
    let rafId = 0;

    const updateTimeline = () => {
      const activeVideo = videoRefs.current[activeIndex];
      if (activeVideo) {
        const duration = Number.isFinite(activeVideo.duration) ? activeVideo.duration : 0;
        const currentTime = activeVideo.currentTime || 0;
        let buffered = 0;

        if (activeVideo.buffered && activeVideo.buffered.length > 0) {
          buffered = activeVideo.buffered.end(activeVideo.buffered.length - 1);
        }

        setDurationSec(duration);
        setCurrentTimeSec(Math.min(currentTime, duration || currentTime));
        setBufferedSec(Math.min(buffered, duration || buffered));
      }

      rafId = window.requestAnimationFrame(updateTimeline);
    };

    rafId = window.requestAnimationFrame(updateTimeline);
    return () => window.cancelAnimationFrame(rafId);
  }, [activeIndex]);

  const handleHeroMouseMove = () => {
    setCursorHidden(false);
    if (cursorTimerRef.current) clearTimeout(cursorTimerRef.current);
    cursorTimerRef.current = setTimeout(() => setCursorHidden(true), CAPTION_HIDE_DELAY_MS);
  };

  const handleHeroMouseLeave = () => {
    setCursorHidden(false);
    if (cursorTimerRef.current) clearTimeout(cursorTimerRef.current);
  };

  const registerVideoRef = (index: number, element: HTMLVideoElement | null) => {
    videoRefs.current[index] = element;
  };

  const handleSeek = (nextTime: number) => {
    const activeVideo = videoRefs.current[activeIndex];
    if (!activeVideo || !Number.isFinite(activeVideo.duration) || activeVideo.duration <= 0) {
      return;
    }

    const safeTime = Math.max(0, Math.min(nextTime, activeVideo.duration));
    if (typeof activeVideo.fastSeek === "function") {
      activeVideo.fastSeek(safeTime);
    } else {
      activeVideo.currentTime = safeTime;
    }
    setCurrentTimeSec(safeTime);
    setIsVideoLoading(true);
  };

  const handleScrollToNext = () => {
    if (activeIndex < CLIPS.length - 1) {
      const nextPx = (activeIndex + 1) * STEP;
      const containerTop = (containerRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY;
      window.scrollTo({ top: containerTop + nextPx, behavior: "smooth" });
    }
  };

  const handleTogglePlayback = () => {
    const activeVideo = videoRefs.current[activeIndex];
    if (!activeVideo) return;

    if (isPlaying) {
      activeVideo.pause();
      setIsPlaying(false);
      return;
    }

    setIsVideoLoading(true);
    activeVideo.play().then(() => setIsPlaying(true)).catch(() => {});
  };

  const timelineProgress = durationSec > 0 ? (currentTimeSec / durationSec) * 100 : 0;
  const bufferedProgress = durationSec > 0 ? (bufferedSec / durationSec) * 100 : 0;
  const showVideoLoadingPopup = useLoadingPopup(isVideoLoading, { minVisibleMs: 700 });

  useEffect(() => {
    setHeadingHovered(false);
  }, [activeIndex]);

  const activeClip = CLIPS[activeIndex];
  const isFirstClip = activeClip.id === 1;

  const handleHeadingClick = () => {
  if (routeTimerRef.current) {
    clearTimeout(routeTimerRef.current);
  }

  const slug = activeClip.slug;

  routeTimerRef.current = setTimeout(() => {
    onFilmClick(slug); 
  }, 280);
};

  return (
    <section 
      ref={containerRef} 
      style={{ height: `${totalScrollHeight}px`, position: "relative", background: "#000" }}
    >
      <div
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        style={{
          position: "sticky", top: 0, height: "100vh", width: "100%", overflow: "hidden",
          cursor: cursorHidden ? "none" : "default"
        }}
      >
        
        {CLIPS.map((clip, index) => (
          <ClipItem 
            key={clip.id} 
            clip={clip} 
            index={index} 
            scrollYProgress={scrollYProgress} 
            totalHeight={totalScrollHeight} 
            registerVideoRef={registerVideoRef}
            captionsVisible={captionsVisible}
            isSafari={isSafari} // Dodaj to
          />
        ))}

        <AnimatePresence>
  {showVideoLoadingPopup && (
    <motion.div
      // ANIMACJA: Na mobile wjeżdża z góry (y: -20), na desktopie z dołu (y: 20)
      initial={{ 
        opacity: 0, 
        x: "-50%", 
        y: isMobile ? -20 : 20, 
        filter: "blur(5px)" 
      }}
      animate={{ opacity: 1, x: "-50%", y: 0, filter: "blur(0px)" }}
      exit={{ 
        opacity: 0, 
        x: "-50%", 
        y: isMobile ? -20 : 30, 
        filter: "blur(3px)" 
      }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      style={{
        position: "absolute",
        left: "50%",
        
        // POZYCJA: Na mobile góra, na desktopie dół
        top: isMobile ? "80px" : "auto",
        bottom: isMobile ? "auto" : "80px", 
        
        zIndex: 130,
        minWidth: isMobile ? "auto" : "220px", 
        padding: isMobile ? "4px 10px" : "12px 18px",
        borderRadius: isMobile ? "8px" : "16px",
        
        background: "rgba(0,0,0,0.9)", 
        color: "#f2ede6",
        fontFamily: "'HelveticaCustom', sans-serif",
        
        // ROZMIARY: Nano na mobile, standard na desktopie
        fontSize: isMobile ? "8px" : "13px", 
        letterSpacing: isMobile ? "1.2px" : "0.4px",
        textTransform: "uppercase", 
        
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: isMobile ? "4px" : "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
      }}
    >
      <span>Wczytywanie video</span>
      
      <span style={{ display: "inline-flex", alignItems: "center", gap: "2px" }}>
        {[0, 1, 2].map((dot) => (
          <motion.span
            key={dot}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: dot * 0.15 }}
            style={{
              width: isMobile ? "1.5px" : "5px", 
              height: isMobile ? "1.5px" : "5px",
              borderRadius: "50%",
              background: "#f2ede6",
              display: "inline-block",
            }}
          />
        ))}
      </span>
    </motion.div>
  )}
</AnimatePresence>

        {/* NAPISY */}
        {/* 1. Zewnętrzny kontener: reaguje TYLKO na scroll (zanika przy zmianie filmu) */}
        <motion.div
            style={{
              position: "absolute", // Upewnij się, że jest absolute
              left: 0,
              right: 0,
              fontFamily: "'HelveticaCustom', sans-serif", // Zmieniono z Helvetica na HelveticaCustom
              fontWeight: "normal",
              // PODNOSIMY: na mobile 30% wysokości ekranu od dołu, na kompie 120px
              bottom: isMobile ? "96px" : "120px", 
              padding: isMobile ? "0 24px" : "0 60px",
              zIndex: 100,
              opacity: captionsScrollOpacity as any,
              pointerEvents: "none",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              textAlign: "left"
            }}
          >
          {/* 2. Wewnętrzny kontener: reaguje TYLKO na bezczynność myszki */}
          <motion.div
            animate={{ 
              y: captionsVisible ? 0 : 16,
              opacity: captionsVisible ? 1 : 0, // Teraz opacity spadnie do twardego ZERA
              filter: captionsVisible ? "blur(0px)" : "blur(10px)"
            }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{
              // Wyłączamy klikanie, gdy tekst jest niewidoczny
              pointerEvents: captionsVisible ? "auto" : "none" 
            }}
          >
            {/* Właściwe napisy */}
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.button
                onClick={handleHeadingClick}
                whileTap={{ scale: 0.985 }}
                style={{
                  all: "unset",
                  cursor: "pointer",
                  display: "inline-flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  // MNIEJSZA PRZERWA: na mobile 6px, na kompie 12px
                  gap: isMobile ? "0px" : "12px", 
                  pointerEvents: "auto",
                  maxWidth: isMobile ? "90vw" : "auto" // Żeby tekst nie wychodził poza ekran
                }}
              >
                <h1 style={{ 
                  fontFamily: "'HelveticaCustom', sans-serif",
                  fontWeight: "500",
                  // DYNAMICZNE SKALOWANIE: na mobile min(9vw, 34px), na kompie clamp
                  fontSize: isMobile ? "min(9vw, 34px)" : "clamp(50px, 10vw, 70px)", 
                  lineHeight: 0.9, 
                  textTransform: "uppercase",
                  color: "#fbfaf9",
                  margin: 0,
                  textShadow: "0px 4px 20px rgba(0,0,0,0.5)"
                }}>
                  {activeIndex === 0 ? activeClip.title : <TextReveal text={activeClip.title} color="#fbfaf9" />}
                </h1>
                
                <motion.span
                  initial={false}
                  animate={{
                    scaleX: headingHovered ? 1 : 0,
                    opacity: headingHovered ? 1 : 0
                  }}
                  transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                  style={{
                    width: "100%",
                    height: "2px",
                    background: "#e8e4df",
                    transformOrigin: "left center"
                  }}
                />
              </motion.button>

              <p style={{ 
                fontFamily: "AppleGaramondItalic", 
                // MNIEJSZY SUBTITLE: na mobile 15px, na kompie 24px
                fontSize: isMobile ? "13px" : "24px", 
                fontWeight: "500", 
                letterSpacing: isMobile ? "0.5px" : "1px", 
                marginTop: isMobile ? "6px" : "15px", // Mniejszy odstęp
                fontStyle: "italic",
                color: "#fbfaf9",
                textShadow: "0px 2px 10px rgba(0,0,0,0.5)"
              }}>
                {activeIndex === 0 ? activeClip.sub : <TextReveal text={activeClip.sub} delay={0.08} color="#fbfaf9" />}
              </p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* SEEK + BUFFER BAR - synchronized like heading, docked at screen edge */}
{!isMobile && (
  <motion.div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 7,
      zIndex: 111,
      opacity: captionsScrollOpacity as any,
    }}
  >
    <motion.div
      animate={{
        y: captionsVisible ? 0 : 16,
        opacity: captionsVisible ? 1 : 0,
        filter: captionsVisible ? "blur(0px)" : "blur(10px)",
      }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      style={{ pointerEvents: captionsVisible ? "auto" : "none" }}
    >
      <motion.div
        key={`controls-${activeIndex}`}
        initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ position: "relative", width: "100%" }}
      >
        {/* PASEK PRZYKLEJONY DO KRAWĘDZI: połowa poza ekranem */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "16px", transform: "translateY(50%)" }}>
          {/* Linie mają bottom: 0, co "przykleja" je do fizycznej krawędzi monitora */}
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "3px", background: "rgba(255,255,255,0.18)" }} />
          <div style={{ position: "absolute", left: 0, bottom: 0, height: "3px", width: `${Math.min(100, bufferedProgress)}%`, background: "rgba(255,255,255,0.42)" }} />
          <div style={{ position: "absolute", left: 0, bottom: 0, height: "3px", width: `${Math.min(100, timelineProgress)}%`, background: "#e11a3b" }} />

          <style>
            {`
              .red-slider-thumb::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: #e11a3b;
                cursor: pointer;
                /* Zjeżdżamy kropką w dół, żeby idealnie leżała na linii */
                transform: translateY(5px); 
              }
              .red-slider-thumb::-moz-range-thumb {
                width: 12px;
                height: 12px;
                border: none;
                border-radius: 50%;
                background: #e11a3b;
                cursor: pointer;
                transform: translateY(5px);
              }
            `}
          </style>

          <input
            type="range"
            className="red-slider-thumb"
            min={0}
            max={Math.max(durationSec, 0.01)}
            step={0.01}
            value={Math.min(currentTimeSec, Math.max(durationSec, 0.01))}
            onChange={(e) => handleSeek(Number(e.target.value))}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              appearance: "none", 
              WebkitAppearance: "none",
              background: "transparent",
              cursor: "pointer",
              margin: 0,
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  </motion.div>
)}

        {isMobile ? (
          /* --- WERSJA MOBILE (24px marginesu, Play+Mute po lewej, Strzałka po prawej) --- */
  <motion.div
    animate={{ opacity: captionsVisible ? 1 : 0, y: captionsVisible ? 0 : 10 }}
    transition={{ duration: 0.35, ease: "easeOut" }}
    style={{
      position: "absolute",
      left: "24px",
      right: "24px",
      bottom: "24px",
      zIndex: 130,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between", // Rozpycha elementy na boki
      pointerEvents: captionsVisible ? "auto" : "none",
    }}
  >
    {/* GRUPA LEWA: Play + Mute */}
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      {/* PLAY BUTTON */}
      <button
        onClick={handleTogglePlayback}
        style={{
          width: "32px",
          height: "32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          borderRadius: "50%",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          background: "rgba(0, 0, 0, 0.3)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          color: "white",
        }}
      >
        {isPlaying ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="8,5 20,12 8,19" />
          </svg>
        )}
      </button>

      {/* MUTE BUTTON */}
      <button
        onClick={() => setVolume((v) => (v === 0 ? 0.7 : 0))}
        style={{
          width: "32px",
          height: "32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          borderRadius: "50%",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          background: "rgba(0, 0, 0, 0.3)",
          backdropFilter: "blur(8px)",
          color: volume === 0 ? "#ed0031" : "#ffffff",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          {volume === 0 ? (
            <><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></>
          ) : (
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
          )}
        </svg>
      </button>
    </div>

    {/* GRUPA PRAWA: Sama strzałka (zamiast Zobacz Szczegóły) */}
    <motion.svg
      animate={{ y: [0, 4, 0] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="rgba(255, 255, 255, 0.7)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="19 12 12 19 5 12" />
    </motion.svg>

  </motion.div>
        ) : (
          <>
            {/* DESKTOP: kolejność 1) przewijaj 2) zobacz szczegóły 3) play 4) volume */}
            <motion.div
              animate={{ opacity: captionsVisible ? 1 : 0, y: captionsVisible ? 0 : 10 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              style={{
                position: "absolute",
                bottom: "clamp(60px, 8vh, 100px)",
                right: "clamp(20px, 5vw, 60px)",
                zIndex: 110,
                display: "flex",
                alignItems: "flex-end",
                gap: "10px",
                pointerEvents: captionsVisible ? "auto" : "none",
              }}
            >
              {/* NAPIS PRZEWIJAJ W DÓŁ Z ANIMOWANĄ STRZAŁKĄ */}
              <p style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "rgba(255, 255, 255, 0.84)",
                fontFamily: "'HelveticaCustom', sans-serif",
                fontSize: "14px",
                letterSpacing: "0px",
                textTransform: "uppercase",
                userSelect: "none",
                margin: "0 10px 0 0",
                paddingBottom: "18px",
              }}>
                Przewijaj w dół

                {/* Animowana ikona strzałki */}
                <motion.svg
                  animate={{ y: [0, 2, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <polyline points="19 12 12 19 5 12" />
                </motion.svg>
              </p>

              {/* PRZYCISK ZOBACZ WIĘCEJ (Teraz jest pierwszy w kodzie, więc będzie po lewej) */}
              <button
                onClick={handleHeadingClick}
                style={{
                  height: "54px",
                  padding: "0 20px",
                  borderRadius: "27px",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  background: "rgba(0, 0, 0, 0.3)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  color: "#ffffff",
                  fontFamily: "HelveticaCustom",
                  fontSize: "11px",
                  letterSpacing: "1.8px",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Zobacz szczegóły
              </button>

              {/* PRZYCISK PLAY / PAUSE */}
              <button
                onClick={handleTogglePlayback}
                style={{
                  width: "54px",
                  height: "54px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                  borderRadius: "50%",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  background: "rgba(0, 0, 0, 0.3)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                {isPlaying ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="5" width="4" height="14" rx="1" />
                    <rect x="14" y="5" width="4" height="14" rx="1" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="8,5 20,12 8,19" />
                  </svg>
                )}
              </button>
              <motion.div
                onMouseEnter={() => setIsVolHovered(true)}
                onMouseLeave={() => setIsVolHovered(false)}
                animate={{ height: isVolHovered ? 217 : 54 }}
                transition={{ duration: 0.35, ease: [0.25, 1, 0.35, 1] }}
                style={{
                  display: "flex",
                  flexDirection: "column-reverse",
                  alignItems: "center",
                  width: "54px",
                  borderRadius: "27px",
                  background: "rgba(0, 0, 0, 0.3)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  overflow: "hidden",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
                }}
              >
                {/* Ikona głośności (zawsze na samym dole) */}
                <button
                  onClick={() => setVolume((v) => (v === 0 ? 0.7 : 0))}
                  style={{
                    minHeight: "54px",
                    width: "54px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: volume === 0 ? "#ed0031" : "#ffffff",
                    outline: "none",
                    transition: "all 0.3s",
                    filter: volume === 0
                      ? "drop-shadow(0.5px 0px 0px #ed0031) drop-shadow(-0.5px 0px 0px #ed0031)"
                      : "none"
                  }}
                >
                  {volume === 0 ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                      <line x1="23" y1="9" x2="17" y2="15"/>
                      <line x1="17" y1="9" x2="23" y2="15"/>
                    </svg>
                  ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                    </svg>
                  )}
                </button>

                {/* Wrapper na suwak i tekst (wysuwa się do góry) */}
                <div style={{
                  display: "flex",
                  flexDirection: "column-reverse",
                  alignItems: "center",
                  gap: "10px",
                  paddingBottom: "4px",
                  opacity: isVolHovered ? 1 : 0,
                  transition: "opacity 0.25s"
                }}>

                  {/* PIONOWY Track suwaka */}
                  <div style={{ position: "relative", width: "4px", height: "100px", borderRadius: "2px", background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "flex-end" }}>

                    {/* Solidne śnieżnobiałe wypełnienie idące od dołu */}
                    <div style={{
                      width: "100%",
                      height: `${volume * 100}%`,
                      background: "#ffffff",
                      borderRadius: "2px",
                      pointerEvents: "none"
                    }} />

                    {/* Obrócony o -90 stopni natywny suwak */}
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%) rotate(-90deg)",
                        width: "100px",
                        height: "30px",
                        opacity: 0,
                        cursor: "pointer",
                        margin: 0,
                      }}
                    />
                  </div>

                  {/* Procenty u samej góry */}
                  <span style={{
                    fontFamily: "HelveticaCustom",
                    fontSize: "14px",
                    letterSpacing: "1px",
                    color: "#ffffff",
                    fontWeight: "bold",
                    margin: "10px 10px 10px 10px",
                  }}>
                    {Math.round(volume * 100)}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}