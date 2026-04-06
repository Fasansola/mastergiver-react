'use client';

/**
 * Business dashboard logout button.
 *
 * Calls the shared logoutAction server action (from Phase 1 — it only calls
 * NextAuth's signOut, which is shared infrastructure) and redirects to the
 * business sign-in page on completion.
 *
 * Pinned to the bottom of the sidebar via the parent layout.
 */

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { logoutAction } from '@/lib/actions/auth.actions';

const BusinessLogoutButton = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    await logoutAction();
    router.push('/business/signin');
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        width: '100%',
        background: 'none',
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
        padding: '12px 16px',
        cursor: isLoading ? 'not-allowed' : 'pointer',
        fontWeight: 510,
        fontSize: '16px',
        color: isLoading ? '#9CA3AF' : '#575C62',
        transition: 'color 0.15s',
      }}
    >
      <span style={{ fontSize: '18px' }}>→</span>
      {isLoading ? 'Signing out…' : 'Sign Out'}
    </button>
  );
};

export default BusinessLogoutButton;
