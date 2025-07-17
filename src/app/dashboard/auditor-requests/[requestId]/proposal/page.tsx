'use client';

import PageContainer from '@/components/layout/page-container';
import { CreateProposalForm } from '@/components/proposals/CreateProposalForm';
import { useProfileStore } from '@/stores/useProfileStore';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function ProposePage() {
  const params = useParams();

  const clientRequestId = Array.isArray(params.requestId)
    ? params.requestId[0]
    : params.requestId || '';

  const { profile, isLoading: isProfileLoading } = useProfileStore();

  if (isProfileLoading || !clientRequestId) {
    return (
      <div className='flex h-96 items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin' />
        <p className='ml-2'>Loading...</p>
      </div>
    );
  }

  if (!profile || !profile.auditFirmId) {
    return (
      <PageContainer>
        <div className='container mx-auto py-12 text-center'>
          <h1 className='text-destructive text-2xl font-bold'>Access Denied</h1>
          <p className='text-muted-foreground'>
            You must be a registered auditor associated with a firm to submit a
            proposal.
          </p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className='container mx-auto px-4 py-8'>
        {/* 6. Now we can safely pass all props with the correct types */}
        <CreateProposalForm
          clientRequestId={clientRequestId}
          auditorId={profile.id}
          auditFirmId={profile.auditFirmId}
        />
      </div>
    </PageContainer>
  );
}
