'use client';

/**
 * A password input with a show/hide toggle button.
 *
 * Styled to the business panel design system. Supports React Hook Form's
 * `register()` via forwardRef — the ref is forwarded to the underlying
 * <input> element so React Hook Form can track focus and value.
 *
 * Usage:
 *   <BusinessPasswordInput {...register('password')} placeholder="••••••••" />
 */

import { forwardRef, useState } from 'react';

interface BusinessPasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const BusinessPasswordInput = forwardRef<
  HTMLInputElement,
  BusinessPasswordInputProps
>(({ style, ...props }, ref) => {
  const [show, setShow] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <input
        {...props}
        ref={ref}
        type={show ? 'text' : 'password'}
        style={{
          background: '#F9FAFB',
          border: '1px solid #F3F4F6',
          height: '48px',
          borderRadius: '6px',
          // Extra right padding so text doesn't slide under the toggle button
          padding: '10px 48px 10px 16px',
          fontSize: '14px',
          width: '100%',
          outline: 'none',
          boxSizing: 'border-box',
          color: '#000000',
          ...style, // allow callers to override individual properties
        }}
      />

      {/* Show / Hide toggle */}
      <button
        type="button"
        onClick={() => setShow((prev) => !prev)}
        aria-label={show ? 'Hide password' : 'Show password'}
        style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#575C62',
          fontSize: '12px',
          fontWeight: 600,
          padding: 0,
          lineHeight: 1,
        }}
      >
        {show ? 'Hide' : 'Show'}
      </button>
    </div>
  );
});

BusinessPasswordInput.displayName = 'BusinessPasswordInput';

export default BusinessPasswordInput;
