'use client';

/**
 * useHideNearFooter
 *
 * Returns `true` when the user is on mobile (< 768px) AND the footer is
 * within `threshold` pixels of the bottom of the viewport.
 *
 * Used to hide the sticky site header before it overlaps the footer.
 */

import { useEffect, useState } from 'react';

export function useHideNearFooter(threshold = 200): boolean {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const footer = document.getElementById('site-footer');
    if (!footer) return;

    const check = () => {
      // Only active on mobile
      if (window.innerWidth >= 768) {
        setHide(false);
        return;
      }

      // Distance from footer top to the bottom of the viewport.
      // Negative value means footer top is already above the viewport bottom.
      const distanceToViewportBottom =
        footer.getBoundingClientRect().top - window.innerHeight;

      setHide(distanceToViewportBottom <= threshold);
    };

    check();
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check, { passive: true });

    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, [threshold]);

  return hide;
}
