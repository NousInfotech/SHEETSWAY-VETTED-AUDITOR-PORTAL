import React from 'react'
import { CreateProposalForm } from '@/components/proposals/CreateProposalForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { ClientRequestDetailDialogProps } from './ClientRequestDetailDialog';

function SubmitProposalDialog({
  request,
  isOpen,
  onClose,
  handleSubmitProposal,
}: ClientRequestDetailDialogProps) {
  return (
    <>
      <Dialog
      open={isOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      
      <DialogContent className="sm:max-w-[900px] flex flex-col max-h-[90vh]">
        
       
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className='text-2xl'>Create Proposal</DialogTitle>
          <DialogDescription>
            You are creating a proposal for the request
          </DialogDescription>
        </DialogHeader>

        {/* 2. This div is now the main content area that will scroll */}
        <div className="flex-grow overflow-y-auto pr-2">
          <CreateProposalForm
            clientRequestId={`${request?.id}`}
            auditorId=""
            auditFirmId=""
            // 3. We pass a prop to tell the form it's in a modal
            
          />
        </div>
        
      </DialogContent>
    </Dialog>
    </>
  )
}

export default SubmitProposalDialog