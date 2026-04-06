/**
 * Root layout for all /business/* pages.
 *
 * Loads the Libre Bodoni font from Google Fonts and exposes it as the CSS
 * variable `--font-libre-bodoni`. All business components reference this
 * variable for headings (H1, H2, H3) rather than the Poppins font used by
 * the individual user panel.
 *
 * This layout wraps both auth pages and dashboard pages. Auth pages wrap
 * their content in <BusinessAuthCard>. The dashboard will have its own
 * inner layout with a sidebar (added in Step 4).
 */
import { Libre_Bodoni } from 'next/font/google';
import type { PropsWithChildren } from 'react';

const libreBodoni = Libre_Bodoni({
  variable: '--font-libre-bodoni',
  weight: ['400', '700'],
  subsets: ['latin'],
});

const BusinessLayout = ({ children }: PropsWithChildren) => {
  return (
    // libreBodoni.variable sets --font-libre-bodoni on this element so
    // font-display can resolve var(--font-libre-bodoni) for all descendants.
    // font-body applies SF Pro as the default for the entire business panel.
    <div className={`${libreBodoni.variable} font-body`}>{children}</div>
  );
};

export default BusinessLayout;
