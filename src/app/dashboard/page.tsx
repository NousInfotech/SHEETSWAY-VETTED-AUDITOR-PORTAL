'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function DashboardRootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/overview');
  }, [router]);

  return (
    <div className='flex h-screen w-full items-center justify-center'>
      <Loader2 className='text-muted-foreground h-10 w-10 animate-spin' />
    </div>
  );
}
