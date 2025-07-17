// components/ProposalModal.tsx
import React from 'react';
import { X } from 'lucide-react';
import { ProposalModalProps } from '../types/request';
import { CreateProposalForm } from '@/components/proposals/CreateProposalForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { AlertDialogHeader } from '@/components/ui/alert-dialog';

const ProposalModal: React.FC<ProposalModalProps> = ({
  isOpen,
  onClose,
  request,
  proposalData,
  setProposalData,
  onSubmit
}) => {
  if (!isOpen || !request) return null;

  const handleSubmit = () => {
    if (
      !proposalData.quote ||
      !proposalData.timeline ||
      !proposalData.message
    ) {
      alert('Please fill in all required fields');
      return;
    }
    onSubmit(request.id);
  };

  const hardcodedAuditorId = 'auditor_uuid_placeholder';
  const hardcodedFirmId = 'firm_uuid_placeholder';

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
            You are creating a proposal for the request: "{request.industry} -{' '}
            {request.size} Business".
          </DialogDescription>
        </DialogHeader>

        {/* 2. This div is now the main content area that will scroll */}
        <div className="flex-grow overflow-y-auto pr-2">
          <CreateProposalForm
            clientRequestId={`${request.id}`}
            auditorId={hardcodedAuditorId}
            auditFirmId={hardcodedFirmId}
            // 3. We pass a prop to tell the form it's in a modal
            
          />
        </div>
        
      </DialogContent>
    </Dialog>
    </>

    // <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/70">
    //   <div className="bg-card text-foreground rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-blue-500 scrollbar-track-blue-100 dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-900">
    //     <div className="p-6 border-b border-border">
    //       <div className="flex items-center justify-between">
    //         <h2 className="text-xl font-semibold text-foreground">Submit Proposal</h2>
    //         <button
    //           onClick={onClose}
    //           className="text-muted-foreground hover:text-foreground"
    //         >
    //           <X className="h-5 w-5" />
    //         </button>
    //       </div>
    //       <p className="text-muted-foreground mt-1">
    //         Submit your proposal for {request.industry} - {request.size} Business
    //       </p>
    //     </div>

    //     <div className="p-6 space-y-6">
    //       <div className="grid grid-cols-2 gap-4">
    //         <div>
    //           <label className="block text-sm font-medium text-foreground mb-2">Quote (€) *</label>
    //           <input
    //             type="number"
    //             placeholder="15000"
    //             value={proposalData.quote}
    //             onChange={(e) => setProposalData({ ...proposalData, quote: e.target.value })}
    //             className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
    //           />
    //         </div>
    //         <div>
    //           <label className="block text-sm font-medium text-foreground mb-2">Delivery Timeline *</label>
    //           <input
    //             type="text"
    //             placeholder="4-6 weeks"
    //             value={proposalData.timeline}
    //             onChange={(e) => setProposalData({ ...proposalData, timeline: e.target.value })}
    //             className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
    //           />
    //         </div>
    //       </div>

    //       <div>
    //         <label className="block text-sm font-medium text-foreground mb-2">Summary Message *</label>
    //         <textarea
    //           placeholder="Brief description of your approach and expertise..."
    //           value={proposalData.message}
    //           onChange={(e) => setProposalData({ ...proposalData, message: e.target.value })}
    //           rows={4}
    //           className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
    //         />
    //       </div>

    //       <div>
    //         <label className="block text-sm font-medium text-foreground mb-2">Questions for Client (Optional)</label>
    //         <textarea
    //           placeholder="Any clarifying questions for the client..."
    //           value={proposalData.questions}
    //           onChange={(e) => setProposalData({ ...proposalData, questions: e.target.value })}
    //           rows={3}
    //           className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
    //         />
    //       </div>

    //       <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
    //         <button
    //           onClick={onClose}
    //           className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors bg-card text-foreground"
    //         >
    //           Cancel
    //         </button>
    //         <button
    //           onClick={handleSubmit}
    //           className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
    //         >
    //           Submit Proposal
    //         </button>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default ProposalModal;
