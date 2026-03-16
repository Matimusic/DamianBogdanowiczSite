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

const PRELOAD_BATCH_SIZE = 1;
const VIDEO_FALLBACK_TIMEOUT_MS = 120000;


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
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [selectedFilmSlug, setSelectedFilmSlug] = useState<string | null>(null);
  const [filmDetailOpen, setFilmDetailOpen] = useState(false);

  const openFilmDetail = (slug: string) => {
    setSelectedFilmSlug(slug);
    setFilmDetailOpen(true);
  };
  
  const hasPreloadedRef = useRef(false);

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

  // Zmień to:
const scrollTo = (id?: string) => { // Dodaliśmy '?'
  setMenuOpen(false);
  
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
          onPortfolioOpen={() => { setMenuOpen(false); setPortfolioOpen(true); }}
          onContactOpen={() => { setMenuOpen(false); setContactOpen(true); }}
        />
        
        <MenuOverlay 
          isOpen={menuOpen} 
          onClose={scrollTo}
          onPortfolioOpen={() => { setMenuOpen(false); setPortfolioOpen(true); }}
          onContactOpen={() => { setMenuOpen(false); setContactOpen(true); }}
          onAboutOpen={() => { setMenuOpen(false); setAboutOpen(true); }}
        />

        

        <PortfolioOverlay
          isOpen={portfolioOpen}
          onClose={() => setPortfolioOpen(false)}
          onAboutOpen={() => {
            setPortfolioOpen(false);
            setAboutOpen(true);
          }}
          onContactOpen={() => {
            setPortfolioOpen(false);
            setContactOpen(true);
          }}
        />
        <ContactOverlay
          isOpen={contactOpen}
          onClose={() => setContactOpen(false)}
          onAboutOpen={() => {
            setContactOpen(false);
            setAboutOpen(true);
          }}
          onPortfolioOpen={() => {
            setContactOpen(false);
            setPortfolioOpen(true);
          }}
        />
        <AboutMeOverlay
          isOpen={aboutOpen}
          onClose={() => setAboutOpen(false)}
          onPortfolioOpen={() => {
            setAboutOpen(false);
            setPortfolioOpen(true);
          }}
          onContactOpen={() => {
            setAboutOpen(false);
            setContactOpen(true);
          }}
        />

        {/* SEKCJE */}
        {/* NOWY KOMPONENT SZCZEGÓŁÓW FILMU */}
        <FilmDetailOverlay 
          isOpen={filmDetailOpen} 
          onClose={() => {
            setFilmDetailOpen(false);
            setSelectedFilmSlug(null);
          }} 
          // TE DWIE LINIE SĄ KLUCZOWE DLA MENU:
          onPortfolioOpen={() => { setFilmDetailOpen(false); setPortfolioOpen(true); }}
          onContactOpen={() => { setFilmDetailOpen(false); setContactOpen(true); }}
          
          slug={selectedFilmSlug} 
          onFilmChange={(newSlug) => setSelectedFilmSlug(newSlug)}
        />

        

        <Footer
          onPortfolioOpen={() => setPortfolioOpen(true)}
          onContactOpen={() => setContactOpen(true)}
          onAboutClick={() => setAboutOpen(true)}
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