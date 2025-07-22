'use client';

import { useAuth } from '@/components/layout/providers';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useProfileStore } from '@/stores/useProfileStore';

export default function Page() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const profile = useProfileStore((state) => state.profile);

  // useEffect(() => {
  //   if (loading) return;

  //   if (user && profile) {
  //     router.push('/dashboard/overview');
  //   } else if (user && !profile) {
  //     router.push('/auth/audit-firm');
  //   } else {
  //     router.push('/auth/sign-in');
  //   }
  // }, [user, profile, loading, router]);

  // Show a loader while the logic runs
  return (
    <div className='flex h-screen w-full items-center justify-center'>
      <Loader2 className='text-muted-foreground h-10 w-10 animate-spin' />
    </div>
  );
}
