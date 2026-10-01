"use client";

import { useEffect, useRef, useState } from "react";

/** Tracks scroll direction ("up" | "down") and whether the page has scrolled past a threshold. */
export function useScrollDirection(threshold = 12) {
  const [direction, setDirection] = useState<"up" | "down">("up");
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;

    const onScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > threshold);

      if (Math.abs(currentY - lastY.current) < 6) return;
      setDirection(currentY > lastY.current ? "down" : "up");
      lastY.current = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return { direction, scrolled };
}
