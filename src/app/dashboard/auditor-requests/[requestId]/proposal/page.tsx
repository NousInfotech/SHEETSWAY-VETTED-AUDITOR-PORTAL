import PageContainer from '@/components/layout/page-container';
import { CreateProposalForm } from '@/components/proposals/CreateProposalForm';

// The page component will receive the requestId from the URL params
export default function ProposePage({
  params
}: {
  params: { requestId: string };
}) {
  // In a real application, you would fetch the current auditor's
  // and their firm's ID here to pass to the form.
  const hardcodedAuditorId = 'auditor_uuid_placeholder';
  const hardcodedFirmId = 'firm_uuid_placeholder';

  return (
    <PageContainer>
      <div className='container mx-auto px-4 py-8'>
        <CreateProposalForm
          clientRequestId={params.requestId}
          auditorId={hardcodedAuditorId}
          auditFirmId={hardcodedFirmId}
        />
      </div>
    </PageContainer>
  );
}
