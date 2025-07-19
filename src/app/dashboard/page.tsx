// 'use client';
// import { useAuth } from '@/components/layout/providers';
// import { redirect } from 'next/navigation';
// import { useEffect } from 'react';
// // Removed unused React import

// export default function Dashboard() {
//   const { user, loading } = useAuth();
//   useEffect(() => {
//     if (!loading) {
//       if (!user) {
//         redirect('/auth/sign-in');
//       } else {
//         redirect('/dashboard/overview');
//       }
//     }
//   }, [user, loading]);
//   return null;
// }

'use client';

import { useAuth } from '@/components/layout/providers';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useProfileStore } from '@/stores/useProfileStore';

export default function Dashboard() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const profile = useProfileStore.getState().profile;

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/sign-in');
      } else {
        if(!profile){
          router.push('/auth/audit-firm');
        }else {
          router.push('dashboard/overview')
        }
      }
    }
  }, [user, loading, router]);
  

  return (
    <div className='flex h-screen w-full items-center justify-center'>
      <Loader2 className='text-muted-foreground h-10 w-10 animate-spin' />
    </div>
  );
}
