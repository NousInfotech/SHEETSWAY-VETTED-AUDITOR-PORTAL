'use client';

import { useAuth } from '@/components/layout/providers';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function Page() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/sign-in');
      } else {
        router.push('/auth/audit-firm');
      }
    }
  }, [user, loading, router]);

  return (
    <div className='flex h-screen w-full items-center justify-center'>
      <Loader2 className='text-muted-foreground h-10 w-10 animate-spin' />
    </div>
  );
}
