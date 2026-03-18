"use client";
import { useEffect } from "react";

export function useBackToClose(isOpen: boolean, onClose: () => void, overlayName: string) {
  useEffect(() => {
    if (isOpen) {
      // 1. Gdy otwieramy overlay, dodajemy "sztuczny" stan do historii przeglądarki
      window.history.pushState({ overlay: overlayName }, "");

      // 2. Funkcja reagująca na kliknięcie "wstecz"
      const handlePopState = (event: PopStateEvent) => {
        // Jeśli użytkownik kliknął "wstecz", zamykamy overlay
        onClose();
      };

      // 3. Nasłuchujemy na zdarzenie popstate (przycisk wstecz)
      window.addEventListener("popstate", handlePopState);

      // Czyszczenie po zamknięciu komponentu
      return () => {
        window.removeEventListener("popstate", handlePopState);
        
        // Jeśli overlay został zamknięty przyciskiem "X" (a nie przyciskiem wstecz),
        // musimy ręcznie usunąć ten sztuczny wpis z historii, żeby nie "wisiał"
        if (window.history.state?.overlay === overlayName) {
          window.history.back();
        }
      };
    }
  }, [isOpen, onClose, overlayName]);
}