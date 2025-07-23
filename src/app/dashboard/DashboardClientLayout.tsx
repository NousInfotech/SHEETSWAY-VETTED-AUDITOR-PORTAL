'use client';

// All your client-side imports
import KBar from '@/components/kbar';
import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import { useAuth } from '@/components/layout/providers';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useProfileStore } from '@/stores/useProfileStore';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardClientLayout({
  children,
  defaultOpen
}: {
  children: React.ReactNode;
  defaultOpen: boolean;
}) {
  const router = useRouter();
  const { user, loading } = useAuth();

  // 1. Create state to hold the profile from localStorage. Initialize to null.
  const [localProfile, setLocalProfile] = useState<any | null>(null);
  // 2. Create a state to know when the localStorage has been checked.
  const [isStorageChecked, setIsStorageChecked] = useState(false);

  // 3. This effect runs only on the client after the component mounts.
  useEffect(() => {
    // Access localStorage safely inside useEffect
    const profileString = localStorage.getItem('userProfile');
    if (profileString) {
      try {
        setLocalProfile(JSON.parse(profileString));
      } catch (error) {
        console.error('Failed to parse userProfile from localStorage', error);

        localStorage.removeItem('userProfile');
      }
    }
    // Mark that we have finished checking localStorage
    setIsStorageChecked(true);
  }, []);

  // 4. This effect handles all redirection logic.
  useEffect(() => {
    // Wait until auth loading and localStorage check are complete
    if (loading || !isStorageChecked) {
      return;
    }

    if (!user) {
      router.push('/auth/sign-in');
      return;
    }

    if (!localProfile) {
      router.push('/auth/audit-firm');
    }
  }, [user, loading, localProfile, isStorageChecked, router]);

  if (!localProfile) {
    return (
      <div className='flex h-screen w-full items-center justify-center'>
        <Loader2 className='text-muted-foreground h-10 w-10 animate-spin' />
      </div>
    );
  }

  // If all checks pass, render the full dashboard UI
  return (
    <KBar>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset>
          <Header />

          {children}
        </SidebarInset>
      </SidebarProvider>
    </KBar>
  );
}
