'use client';
import PageContainer from '@/components/layout/page-container';
import { useAuth } from '@/components/layout/providers';
import EngagementViewPage from '@/features/engagements/engagement-view-page';
import { useClientEngagementStore } from '@/features/engagements/store';
import { useEffect } from 'react';
import { useMemo } from 'react';

export default function Page() {
  const { user, loading: authLoading } = useAuth();

  const my_profile = useMemo(() => {
      // Make it safer by checking if the item exists
      const profileString = localStorage.getItem('userProfile');
      if (!profileString) return null;
  
      try {
        return JSON.parse(profileString);
      } catch (error) {
        console.error('Failed to parse userProfile from localStorage', error);
        return null;
      }
    }, []); // 3. Use an empty dependency array to run this ONLY ONCE


  const {
    loadClientEngagements,
    loading: engagementsLoading,
  } = useClientEngagementStore();

  useEffect(() => {
    // Wait for auth to finish, then fetch if we have a user
    if (!authLoading && user && my_profile) {
      // This tiny delay is imperceptible to the user but is more than enough
      // time for the AuthProvider to finish writing the new token to storage
      // before the axios interceptor tries to read it.
      const timer = setTimeout(() => {
        loadClientEngagements(my_profile.id);
      }, 100); // A 100ms delay is a good starting point.

      // React best practice: clean up the timer
      return () => clearTimeout(timer);
    }
  }, [user, authLoading, my_profile, loadClientEngagements]);

  // Show a spinner for either auth or data fetching
  if (authLoading || engagementsLoading) {
    return (
      <>
        <div className='flex h-[80vh] w-full items-center justify-center'>
          <div className='classic-loader' />
        </div>
      </>
    );
  }
  return (
    <PageContainer>
      <div className='container mx-auto'>
        <EngagementViewPage />
      </div>
    </PageContainer>
  );
}
