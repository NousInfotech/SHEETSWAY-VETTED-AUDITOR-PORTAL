'use client';

import PageContainer from '@/components/layout/page-container';
import { useAuth } from '@/components/layout/providers';
import EngagementRequestViewPage from '@/features/request/components/EngagementRequestsPage';


export default function Page() {

  const {user} = useAuth()
  console.log(user)
  return (
    <PageContainer>
      <div className='container mx-auto'>
        <EngagementRequestViewPage />
      </div>
    </PageContainer>
  );
}
