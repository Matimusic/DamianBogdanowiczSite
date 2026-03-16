import { useEffect, useRef, useState } from "react";

interface UseLoadingPopupOptions {
  minVisibleMs?: number;
}

export function useLoadingPopup(isLoading: boolean, options: UseLoadingPopupOptions = {}) {
  const { minVisibleMs = 650 } = options;
  const [isVisible, setIsVisible] = useState(false);
  const shownAtRef = useRef<number | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isLoading) {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }

      if (!isVisible) {
        shownAtRef.current = Date.now();
        setIsVisible(true);
      }

      return;
    }

    if (!isVisible) return;

    const shownAt = shownAtRef.current ?? Date.now();
    const elapsed = Date.now() - shownAt;
    const delay = Math.max(0, minVisibleMs - elapsed);

    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
      shownAtRef.current = null;
      hideTimeoutRef.current = null;
    }, delay);
  }, [isLoading, isVisible, minVisibleMs]);

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  return isVisible;
}
