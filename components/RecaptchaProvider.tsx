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
    /*
     * scriptProps.async + defer: the reCAPTCHA v3 loader is still injected
     * globally (so useGoogleReCaptcha() works on any page) but the script
     * no longer blocks the main thread during initial parse. The badge and
     * token generation will be available before any form submission occurs.
     * appendTo: 'body' keeps it out of <head> where it would otherwise
     * compete with render-critical resources.
     */
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? ''}
      scriptProps={{ async: true, defer: true, appendTo: 'body' }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
}
