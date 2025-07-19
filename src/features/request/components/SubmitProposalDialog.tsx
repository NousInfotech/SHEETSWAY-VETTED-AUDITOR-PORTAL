import React from 'react';
import { CreateProposalForm } from '@/components/proposals/CreateProposalForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { ClientRequestDetailDialogProps } from './ClientRequestDetailDialog';
import { ClientRequest } from '@/lib/services/clientRequestService';

interface onSubmitProposalProps {
  request: ClientRequest;
  isOpen: boolean;
  onClose: () => void;
}

function SubmitProposalDialog({
  request,
  isOpen,
  onClose
}: onSubmitProposalProps) {
  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) onClose();
        }}
      >
        <DialogContent className='flex max-h-[90vh] flex-col sm:max-w-[900px]'>
          <DialogHeader className='flex-shrink-0'>
            <DialogTitle className='text-2xl'>Create Proposal</DialogTitle>
            <DialogDescription>
              You are creating a proposal for the request
            </DialogDescription>
          </DialogHeader>

          {/* 2. This div is now the main content area that will scroll */}
          <div className='flex-grow overflow-y-auto pr-2'>
            <CreateProposalForm
              clientRequestId={request.id}
              auditorId=''
              auditFirmId=''
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default SubmitProposalDialog;
