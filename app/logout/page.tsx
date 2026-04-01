'use client';
import { useEffect } from 'react';
import { logoutAction } from '@/lib/actions/auth.actions';
import { useRouter } from 'next/navigation';

const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    logoutAction().then(() => {
      router.push('/login');
    });
  }, [router]);

  return null;
};

export default LogoutPage;
