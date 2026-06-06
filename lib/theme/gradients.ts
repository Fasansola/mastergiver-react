/**
 * Shared gradient constants for the MasterGiver public pages.
 *
 * Use these wherever you need a gradient background — both in Chakra UI
 * `bg=` props and in inline style={{ background: ... }} objects.
 *
 * Chakra UI v3 (Panda CSS) does not resolve CSS var() references reliably
 * when the variable contains a gradient, so we use plain TS constants instead.
 * The matching CSS variables in globals.css remain for documentation purposes.
 */

/** Hero gradient used on the Home, Partner, and Reputation page hero sections. */
export const HERO_GRADIENT =
  'linear-gradient(107.69deg, #F3F6FF 0%, #F1F5FF 100%)';

/** Softer directional gradient used on the Good Businesses / Directory hero sections. */
export const DIRECTORY_HERO_GRADIENT =
  'linear-gradient(160deg, #F0F4FF 0%, #EAF0FF 40%, #F5F3FF 100%)';
