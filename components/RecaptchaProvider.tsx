'use client';

/**
 * Wraps the app with Google reCAPTCHA v3.
 *
 * Must be a Client Component because GoogleReCaptchaProvider uses context
 * under the hood. Placed in the root layout so every page has access to
 * the useGoogleReCaptcha() hook without needing a per-page provider.
 */

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

export default function RecaptchaProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? ''}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
}
