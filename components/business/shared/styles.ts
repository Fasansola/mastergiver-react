/**
 * Business panel design token constants.
 *
 * These are the exact values from the business design system spec.
 * Import from this file in any business component that needs fonts, input
 * styles, button styles, or label styles — this keeps all business-panel
 * visual tokens in one place.
 *
 * Do NOT import these into Phase 1 (user panel) components.
 */

import type { CSSProperties } from 'react';

// Input field — matches the business design system spec exactly
export const inputStyle: CSSProperties = {
  background: '#F9FAFB',
  border: '1px solid #F3F4F6',
  height: '42px',
  borderRadius: '6px',
  padding: '10px 16px',
  fontSize: '14px',
  width: '100%',
  outline: 'none',
  boxSizing: 'border-box',
  color: '#212325',
};

// Input label — uppercase, tracked, muted grey
export const labelStyle: CSSProperties = {
  fontWeight: 700,
  fontSize: '14px',
  lineHeight: '20px',
  letterSpacing: '1.16px',
  textTransform: 'uppercase',
  color: '#575C62',
  display: 'block',
};

// Small red error text shown below an invalid field
export const errorTextStyle: CSSProperties = {
  fontSize: '12px',
  color: '#E53E3E',
  marginTop: '4px',
};

/**
 * Primary button style — uses a function so disabled state can adjust the background.
 * Usage: style={primaryButtonStyle(isSubmitting)}
 */
export const primaryButtonStyle = (disabled: boolean): CSSProperties => ({
  background: disabled ? '#8B88BB' : '#2F2B77',
  height: '64px',
  borderRadius: '8px',
  padding: '16px 40px',
  boxShadow: '0px 8px 10px -6px #E2E1FF, 0px 20px 25px -5px #D4D1FF',
  color: '#FFFFFF',
  fontWeight: 700,
  fontSize: '20px',
  lineHeight: '160%',
  border: 'none',
  cursor: disabled ? 'not-allowed' : 'pointer',
  width: '100%',
  marginTop: '8px',
  transition: 'background 0.2s',
});

export const editProfileBTNStyle: CSSProperties = {
  width: 'fit-content',
  fontWeight: '700',
  lineHeight: '100%',
  textTransform: 'uppercase',
  color: '#2F2B77',
  cursor: 'pointer',
};
