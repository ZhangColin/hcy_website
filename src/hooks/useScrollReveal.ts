"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scroll reveal hook with IntersectionObserver
 *
 * This hook handles the common pattern of revealing elements as they scroll into view.
 * It includes a fix for the race condition where elements already in viewport on mount
 * wouldn't trigger the IntersectionObserver callback.
 *
 * @param threshold - Visibility threshold (0-1), default 0.15
 * @returns { ref, visible } - Ref to attach to element and visibility state
 */
export function useScrollReveal(threshold: number = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      console.log('[useScrollReveal] No element found');
      return;
    }

    console.log('[useScrollReveal] Setting up for element:', el.className?.substring(0, 50) || 'unknown');

    let hasFired = false;

    const io = new IntersectionObserver(
      ([entry]) => {
        console.log('[useScrollReveal] Observer callback:', {
          isIntersecting: entry.isIntersecting,
          intersectionRatio: entry.intersectionRatio,
          hasFired
        });
        if (entry.isIntersecting && !hasFired) {
          hasFired = true;
          console.log('[useScrollReveal] Setting visible = true via observer');
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold }
    );

    io.observe(el);

    // Check initial state immediately - element might already be in viewport
    // This fixes the race condition where observer doesn't fire if element is already visible
    const checkTimer = setTimeout(() => {
      if (!hasFired) {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const elementHeight = rect.height;
        const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
        const visibleRatio = elementHeight > 0 ? visibleHeight / elementHeight : 0;

        console.log('[useScrollReveal] Initial check:', {
          rect: { top: rect.top, bottom: rect.bottom, height: rect.height },
          visibleHeight,
          visibleRatio,
          threshold
        });

        // If already visible beyond threshold, trigger animation
        if (visibleRatio >= threshold) {
          hasFired = true;
          console.log('[useScrollReveal] Setting visible = true via initial check');
          setVisible(true);
          io.disconnect();
        } else {
          console.log('[useScrollReveal] Not yet visible, waiting for observer');
        }
      }
    }, 0);

    return () => {
      clearTimeout(checkTimer);
      io.disconnect();
    };
  }, [threshold]);

  return { ref, visible };
}
