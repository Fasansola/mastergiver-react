'use client';

/**
 * StickyHeaderWrapper
 *
 * Client wrapper for the fixed site header. On mobile it listens to scroll
 * position and slides the header out of view when the user gets within 200px
 * of the footer, then slides it back in when they scroll up.
 *
 * On tablet and desktop the header is always visible — no behaviour change.
 */

import { useHideNearFooter } from '@/hooks/useHideNearFooter';

interface StickyHeaderWrapperProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

const StickyHeaderWrapper = ({
  children,
  style,
  className,
}: StickyHeaderWrapperProps) => {
  const hide = useHideNearFooter(200);

  return (
    <div
      className={className}
      style={{
        ...style,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transform: hide ? 'translateY(-100%)' : 'translateY(0)',
        transition: 'transform 0.3s ease',
      }}
    >
      {children}
    </div>
  );
};

export default StickyHeaderWrapper;
