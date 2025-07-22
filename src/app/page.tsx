'use client';

import { useAuth } from '@/components/layout/providers';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useProfileStore } from '@/stores/useProfileStore';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.push('/auth/sign-in');
  }, [])

  
  return;
}
