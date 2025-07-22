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
import { useEffect } from 'react';

export default function DashboardClientLayout({
  children,
  defaultOpen
}: {
  children: React.ReactNode;
  defaultOpen: boolean;
}) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const profile = useProfileStore((state) => state.profile);

  useEffect(() => {
    if (loading) {
      return; // Still loading, do nothing yet
    }
    if (!user) {
      router.push('/auth/sign-in');
      return;
    }
    if (!profile) {
      router.push('/auth/audit-firm');
    }
  }, [user, profile, loading, router]);

  if (loading || !user || !profile) {
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
