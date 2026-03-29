import { redirect } from 'next/navigation';

export interface TokenVerifyError {
  error: string;
  // Preserved from the verifyFn result when present — used by pages that
  // offer a "resend" option (e.g. expired signup tokens carry the email).
  email?: string;
}

// Shared orchestration for token-based verification pages.
//
// Handles the common boilerplate:
//   1. Guard for a missing token (returns { error: 'missing-token' })
//   2. Call verifyFn with the token
//   3. Return the error (plus any email) if verification fails
//   4. Redirect to successRedirect on success
//
// For pages with a dynamic success redirect (e.g. redirecting to /onboarding
// vs /dashboard based on DB state), omit successRedirect and have verifyFn
// call redirect() internally on success — Next.js's redirect() throws
// NEXT_REDIRECT so it never returns, and this function will never be reached.
//
// The return type is only reached on failure — callers can assert that any
// code after this call is an error path.

export async function verifyTokenAndRedirect<
  T extends { success: boolean; error?: string; email?: string },
>({
  token,
  verifyFn,
  successRedirect,
}: {
  token: string | undefined;
  verifyFn: (token: string) => Promise<T>;
  successRedirect?: string;
}): Promise<TokenVerifyError> {
  if (!token) return { error: 'missing-token' };

  const result = await verifyFn(token);

  if (!result.success) {
    return {
      error: result.error ?? 'Verification failed.',
      email: result.email,
    };
  }

  if (successRedirect) redirect(successRedirect);

  // Only reachable if successRedirect was omitted AND verifyFn did not call
  // redirect() on success — this is a programming error.
  throw new Error(
    'verifyTokenAndRedirect: verification succeeded but no redirect occurred. ' +
      'Provide successRedirect or have verifyFn call redirect() on success.'
  );
}
