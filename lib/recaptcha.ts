/**
 * Server-side reCAPTCHA v3 verification.
 *
 * Calls Google's siteverify endpoint with the token sent from the client.
 * Returns false if the token is invalid or the score is too low (< 0.5).
 *
 * If RECAPTCHA_SECRET_KEY is not set (e.g. local dev without keys), this
 * function logs a warning and returns true so forms still work locally.
 */

const VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';
const SCORE_THRESHOLD = 0.5;

export async function verifyRecaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  if (!secret) {
    console.warn('[reCAPTCHA] RECAPTCHA_SECRET_KEY is not set — skipping verification.');
    return true;
  }

  try {
    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${secret}&response=${token}`,
      // Bypass Next.js fetch cache — every call must hit Google's API
      cache: 'no-store',
    });

    const data = (await res.json()) as {
      success: boolean;
      score: number;
      action: string;
      'error-codes'?: string[];
    };

    if (!data.success) {
      console.warn('[reCAPTCHA] Verification failed:', data['error-codes']);
      return false;
    }

    // TODO: remove this log after confirming reCAPTCHA is working in production
    console.log(`[reCAPTCHA] action="${data.action}" score=${data.score} (threshold=${SCORE_THRESHOLD}) → ${data.score >= SCORE_THRESHOLD ? 'PASS ✓' : 'BLOCKED ✗'}`);

    return data.score >= SCORE_THRESHOLD;
  } catch (err) {
    console.error('[reCAPTCHA] Network error during verification:', err);
    // Fail open on network errors so a Google outage doesn't break sign-ups
    return true;
  }
}
