'use client';

import PageContainer from '@/components/layout/page-container';
import EngagementRequestViewPage from '@/features/request/components/EngagementRequestsPage';

export default function page() {
  return (
    <PageContainer>
      <div className='container mx-auto'>
        <EngagementRequestViewPage />
      </div>
    </PageContainer>
  );
}
