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

import { Stack } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

const BusinessLayout = ({ children }: PropsWithChildren) => {
  return <Stack gap="0">{children}</Stack>;
};

export default BusinessLayout;
