"use client";
import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import MenuOverlay from "@/components/MenuOverlay";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import LoadingOverlay from "@/components/LoadingOverlay";
import ContactOverlay from "@/components/ContactOverlay";
import PortfolioOverlay from "@/components/PortfolioOverlay";
import AboutMeOverlay from "@/components/AboutMeOverlay";
import { CLIPS } from "@/data/clips";
import { blobUrlCache } from "@/data/blobCache";
import FilmDetailOverlay from "@/components/FilmDetailOverlay";
import { useIsMobile } from "@/hooks/useIsMobile";
import AboutMeOverlayMobile from "@/components/AboutMeOverlayMobile"; // Zakładając, że tak nazwałeś plik
import PortfolioOverlayMobile from "@/components/PortfolioOverlayMobile";
import ContactOverlayMobile from "@/components/ContactOverlayMobile";
import FilmDetailOverlayMobile from "@/components/FilmDetailOverlayMobile";

const PRELOAD_BATCH_SIZE = 1;
const VIDEO_FALLBACK_TIMEOUT_MS = 120000;
const OVERLAY_HISTORY_KEY = "damian:lastOverlay";

type OverlayName = "home" | "portfolio" | "contact" | "about" | "filmDetail";

type OverlayHistoryState = {
  __damianOverlayNav: true;
  overlay: string;
  filmSlug?: string | null;
};


const preloadImage = (src: string) =>
  new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });

const preloadVideoMetadata = (src: string) =>
  new Promise<void>((resolve) => {
    const video = document.createElement("video");
    let settled = false;

    const cleanup = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timeoutId);
      video.onloadeddata = null;
      video.oncanplaythrough = null;
      video.onerror = null;
      video.src = "";
      resolve();
    };

    const timeoutId = setTimeout(cleanup, VIDEO_FALLBACK_TIMEOUT_MS);
    video.preload = "auto";
    video.muted = true;
    video.onloadeddata = cleanup;
    video.oncanplaythrough = cleanup;
    video.onerror = cleanup;
    video.src = src;
    video.load();
  });

const preloadVideoBuffer = async (src: string) => {
  try {
    const existing = blobUrlCache.get(src);
    if (existing) {
      return;
    }

    const response = await fetch(src);
    if (!response.ok) throw new Error("Fetch failed");
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const previousBlobUrl = blobUrlCache.get(src);
    if (previousBlobUrl) {
      URL.revokeObjectURL(previousBlobUrl);
    }
    blobUrlCache.set(src, blobUrl);
  } catch {
    // Fallback: gdy fetch się nie uda, wczytaj przez element video.
    await preloadVideoMetadata(src);
  }
};

export default function Home() {
  const isMobile = useIsMobile();
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [selectedFilmSlug, setSelectedFilmSlug] = useState<string | null>(null);
  const [filmDetailOpen, setFilmDetailOpen] = useState(false);
  
  const hasPreloadedRef = useRef(false);
  const isPopStateNavigationRef = useRef(false);

  const normalizeOverlay = (overlay: string): OverlayName => {
    if (overlay === "portfolio" || overlay === "contact" || overlay === "about" || overlay === "filmDetail") {
      return overlay;
    }
    return "home";
  };

  const applyOverlayState = (overlay: OverlayName, filmSlug?: string | null) => {
    setMenuOpen(false);
    setPortfolioOpen(overlay === "portfolio");
    setContactOpen(overlay === "contact");
    setAboutOpen(overlay === "about");
    setFilmDetailOpen(overlay === "filmDetail");
    setSelectedFilmSlug(overlay === "filmDetail" ? filmSlug ?? null : null);
  };

  const saveLastOverlay = (overlay: OverlayName) => {
    if (overlay === "home") return;
    sessionStorage.setItem(OVERLAY_HISTORY_KEY, overlay);
  };

  const navigateOverlay = (overlay: OverlayName, options?: { push?: boolean; filmSlug?: string | null }) => {
    const shouldPush = options?.push ?? true;
    const filmSlug = options?.filmSlug ?? null;

    applyOverlayState(overlay, filmSlug);
    saveLastOverlay(overlay);

    if (shouldPush && !isPopStateNavigationRef.current) {
      const nextState: OverlayHistoryState = {
        __damianOverlayNav: true,
        overlay,
        filmSlug,
      };
      window.history.pushState(nextState, "");
    }
  };

  const openFilmDetail = (slug: string) => {
    navigateOverlay("filmDetail", { filmSlug: slug });
  };

  const closeToHome = () => {
    navigateOverlay("home");
  };

  useEffect(() => {
    if (hasPreloadedRef.current) {
      return;
    }
    hasPreloadedRef.current = true;

    let cancelled = false;

    const preloadAll = async () => {
      const assets = [
        ...CLIPS.map((clip) => clip.src),
        "/logos/logoDB7.png",
        "/logos/logoDB7.png",
      ];

      let completed = 0;
      const total = assets.length;

      for (let i = 0; i < assets.length; i += PRELOAD_BATCH_SIZE) {
        const batch = assets.slice(i, i + PRELOAD_BATCH_SIZE);
        await Promise.all(
          batch.map(async (asset) => {
            if (asset.endsWith(".mp4") || asset.endsWith(".webm")) { 
                await preloadVideoBuffer(asset);
              } else {
                await preloadImage(asset);
              }

            completed += 1;
            if (!cancelled) {
              setLoadingProgress(completed / total);
            }
          })
        );
      }

      if (!cancelled) {
        setIsReady(true);
      }
    };

    preloadAll();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const currentState = window.history.state as OverlayHistoryState | null;
    if (!currentState?.__damianOverlayNav) {
      const initialState: OverlayHistoryState = {
        __damianOverlayNav: true,
        overlay: "home",
        filmSlug: null,
      };
      window.history.replaceState(initialState, "");
    }

    const handlePopState = (event: PopStateEvent) => {
      const state = event.state as OverlayHistoryState | null;
      isPopStateNavigationRef.current = true;

      if (state?.__damianOverlayNav) {
        const normalizedOverlay = normalizeOverlay(state.overlay);
        applyOverlayState(normalizedOverlay, state.filmSlug ?? null);
        saveLastOverlay(normalizedOverlay);
      } else {
        applyOverlayState("home");
      }

      isPopStateNavigationRef.current = false;
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Zmień to:
const scrollTo = (id?: string) => { // Dodaliśmy '?'
  if (menuOpen) {
    setMenuOpen(false);
  }
  
  // Dodaj zabezpieczenie, żeby kod nie szukał elementu 'undefined'
  if (!id) return; 

  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  if (!isReady) {
    return <LoadingOverlay progress={loadingProgress} shouldExit={false} />;
  }

  return (
    <>
      <main>
        <Hero 
          // Muzyka wyciszy się TYLKO, gdy te dwa stany będą prawdziwe. 
          //aboutOpen i contactOpen nie są tu ujęte, więc muzyka będzie grała dalej.
          isPortfolioOpen={portfolioOpen || filmDetailOpen} 
          onFilmClick={openFilmDetail} 
        />

        <div className="grain" />
        
        <Header 
          menuOpen={menuOpen} 
          setMenuOpen={setMenuOpen} 
          scrollTo={scrollTo}
          onPortfolioOpen={() => navigateOverlay("portfolio")}
          onContactOpen={() => navigateOverlay("contact")}
        />
        
        <MenuOverlay 
          isOpen={menuOpen} 
          onClose={scrollTo}
          onPortfolioOpen={() => navigateOverlay("portfolio")}
          onContactOpen={() => navigateOverlay("contact")}
          onAboutOpen={() => navigateOverlay("about")}
        />

        

        {/* PORTFOLIO OVERLAY - SWITCHER */}
{portfolioOpen && (
  isMobile ? (
    <PortfolioOverlayMobile
      isOpen={portfolioOpen}
      onClose={closeToHome}
      onAboutOpen={() => navigateOverlay("about")}
      onContactOpen={() => navigateOverlay("contact")}
    />
  ) : (
    <PortfolioOverlay
      isOpen={portfolioOpen}
      onClose={closeToHome}
      onAboutOpen={() => navigateOverlay("about")}
      onContactOpen={() => navigateOverlay("contact")}
    />
  )
)}
        {/* CONTACT OVERLAY - SWITCHER */}
{contactOpen && (
  isMobile ? (
    <ContactOverlayMobile
      isOpen={contactOpen}
      onClose={closeToHome}
      onAboutOpen={() => navigateOverlay("about")}
      onPortfolioOpen={() => navigateOverlay("portfolio")}
    />
  ) : (
    <ContactOverlay
      isOpen={contactOpen}
      onClose={closeToHome}
      onAboutOpen={() => navigateOverlay("about")}
      onPortfolioOpen={() => navigateOverlay("portfolio")}
    />
  )
)}
        {/* TYLKO JEŚLI aboutOpen JEST TRUE, sprawdzamy czy to mobile czy desktop */}
        {aboutOpen && (
          isMobile ? (
            <AboutMeOverlayMobile
              isOpen={aboutOpen}
              onClose={closeToHome}
              onPortfolioOpen={() => navigateOverlay("portfolio")}
              onContactOpen={() => navigateOverlay("contact")}
            />
          ) : (
            <AboutMeOverlay
              isOpen={aboutOpen}
              onClose={closeToHome}
              onPortfolioOpen={() => navigateOverlay("portfolio")}
              onContactOpen={() => navigateOverlay("contact")}
            />
          )
        )}

        {/* FILM DETAIL OVERLAY - SWITCHER */}
{filmDetailOpen && (
  isMobile ? (
    <FilmDetailOverlayMobile 
      isOpen={filmDetailOpen} 
      onClose={closeToHome} 
      onPortfolioOpen={() => navigateOverlay("portfolio")}
      onContactOpen={() => navigateOverlay("contact")}
      slug={selectedFilmSlug} 
      onFilmChange={(newSlug) => navigateOverlay("filmDetail", { filmSlug: newSlug })}
    />
  ) : (
    <FilmDetailOverlay 
      isOpen={filmDetailOpen} 
      onClose={closeToHome} 
      onPortfolioOpen={() => navigateOverlay("portfolio")}
      onContactOpen={() => navigateOverlay("contact")}
      slug={selectedFilmSlug} 
      onFilmChange={(newSlug) => navigateOverlay("filmDetail", { filmSlug: newSlug })}
    />
  )
)}

        

        <Footer
          onPortfolioOpen={() => navigateOverlay("portfolio")}
          onContactOpen={() => navigateOverlay("contact")}
          onAboutClick={() => navigateOverlay("about")}
        />
      </main>

      {overlayVisible && (
        <LoadingOverlay
          progress={loadingProgress}
          shouldExit={isReady}
          onExitComplete={() => setOverlayVisible(false)}
        />
      )}
    </>
  );
}