'use client';
import { useEffect } from 'react';
import { logout } from '@/lib/auth/auth.actions';
import { useRouter } from 'next/navigation';

const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    logout().then(() => {
      router.push('/login');
    });
  }, [router]);

  return null;
};

export default LogoutPage;
