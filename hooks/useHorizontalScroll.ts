import { useCallback, useRef } from "react";

export function useHorizontalScroll() {
  // Przechowujemy ID animacji i stan w useRef, aby nie restartować hooka
  const rafId = useRef<number | null>(null);
  const elRef = useRef<HTMLElement | null>(null);

  // To jest "Callback Ref" - odpali się za każdym razem, gdy element pojawi się w DOM
  const setRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      elRef.current = node;
      const el = node;

      let isDown = false;
      let startX: number;
      let scrollLeftStart: number;
      let velocity = 0;
      let lastMoveTime: number;
      let lastMoveX: number;
      let movedTotal = 0;

      const momentumScroll = () => {
        if (Math.abs(velocity) > 0.5) {
          el.scrollLeft += velocity;
          velocity *= 0.95; // Tarcie
          rafId.current = requestAnimationFrame(momentumScroll);
        }
      };

      const onMouseDown = (e: MouseEvent) => {
        isDown = true;
        movedTotal = 0;
        velocity = 0;
        if (rafId.current) cancelAnimationFrame(rafId.current);
        
        el.style.cursor = "grabbing";
        const rect = el.getBoundingClientRect();
        startX = e.clientX - rect.left;
        scrollLeftStart = el.scrollLeft;
        
        lastMoveX = e.clientX;
        lastMoveTime = Date.now();
      };

      const onMouseMove = (e: MouseEvent) => {
        if (!isDown) return;
        
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const walk = x - startX;
        
        const now = Date.now();
        const dt = now - lastMoveTime;
        const dx = e.clientX - lastMoveX;
        
        if (dt > 0) {
          velocity = -(dx / dt) * 10;
        }

        lastMoveX = e.clientX;
        lastMoveTime = now;
        movedTotal += Math.abs(dx);

        if (movedTotal > 5) {
          e.preventDefault();
          el.scrollLeft = scrollLeftStart - walk;
        }
      };

      const onMouseUpOrLeave = () => {
        if (!isDown) return;
        isDown = false;
        el.style.cursor = "grab";
        
        if (Date.now() - lastMoveTime > 100) {
          velocity = 0;
        }
        
        rafId.current = requestAnimationFrame(momentumScroll);
      };

      const onDragStart = (e: DragEvent) => e.preventDefault();

      const onClickCapture = (e: MouseEvent) => {
        if (movedTotal > 10) {
          e.preventDefault();
          e.stopPropagation();
        }
      };

      // Rejestracja zdarzeń
      el.addEventListener("mousedown", onMouseDown);
      window.addEventListener("mousemove", onMouseMove); // Window dla lepszej płynności
      window.addEventListener("mouseup", onMouseUpOrLeave);
      el.addEventListener("mouseleave", onMouseUpOrLeave);
      el.addEventListener("click", onClickCapture, { capture: true });
      el.addEventListener("dragstart", onDragStart as any);

      // Sprzątanie po usunięciu elementu (np. zamknięcie overlaya)
      (el as any)._cleanup = () => {
        el.removeEventListener("mousedown", onMouseDown);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUpOrLeave);
        el.removeEventListener("mouseleave", onMouseUpOrLeave);
        el.removeEventListener("click", onClickCapture, { capture: true });
        el.removeEventListener("dragstart", onDragStart as any);
        if (rafId.current) cancelAnimationFrame(rafId.current);
      };
    } else {
      // Jeśli element znika (isOpen = false), posprzątaj
      if (elRef.current && (elRef.current as any)._cleanup) {
        (elRef.current as any)._cleanup();
      }
      elRef.current = null;
    }
  }, []);

  return setRef; // Zwracamy funkcję setRef zamiast obiektu useRef
}