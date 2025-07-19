// 'use client';

// import PageContainer from '@/components/layout/page-container';
// import { getProposals, Proposal } from '@/lib/services/proposalService';
// import React, { useEffect, useState } from 'react';
// import { useAuth } from '@/components/layout/providers';
// import { Loader2, FileSearch } from 'lucide-react';
// import { toast } from 'sonner';

// export default function MyProposalsPage() {
//   const { user, loading: authLoading } = useAuth();

//   const [proposals, setProposals] = useState<Proposal[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchProposals = async () => {
//       setIsLoading(true);
//       setError(null);
//       try {
//         const data = await getProposals();
//         if (data) {
//           setProposals(data);
//         } else {
//           setError('Failed to fetch proposals.');
//           toast.error('Could not load proposals.');
//         }
//       } catch (err) {
//         setError('An error occurred while fetching data.');
//         toast.error('Failed to load proposals.');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (!authLoading && user) {
//       fetchProposals();
//     } else if (!authLoading && !user) {
//       setIsLoading(false);
//       setError('You must be logged in to view proposals.');
//     }
//   }, [user, authLoading]);

//   console.log(user);
//   console.log(proposals);
//   // 5. Render UI based on the current state.
//   const renderContent = () => {
//     if (isLoading) {
//       return (
//         <div className='flex items-center justify-center py-20'>
//           <Loader2 className='text-muted-foreground h-8 w-8 animate-spin' />
//           <p className='ml-3'>Loading your proposals...</p>
//         </div>
//       );
//     }

//     if (error) {
//       return (
//         <div className='flex flex-col items-center justify-center px-6 py-20 text-center'>
//           <h3 className='text-destructive mb-2 text-xl font-semibold'>Error</h3>
//           <p className='text-muted-foreground max-w-sm'>{error}</p>
//         </div>
//       );
//     }

//     if (proposals.length === 0) {
//       return (
//         <div className='flex flex-col items-center justify-center px-6 py-20 text-center'>
//           <FileSearch
//             className='text-muted-foreground/50 mb-6 h-20 w-20'
//             strokeWidth={1}
//           />
//           <h3 className='text-foreground mb-2 text-xl font-semibold'>
//             No Proposals Found
//           </h3>
//           <p className='text-muted-foreground max-w-sm'>
//             You have not created or received any proposals yet.
//           </p>
//         </div>
//       );
//     }

//     return (
//       <div className='space-y-4'>
//         {/* Map over the proposals and render them */}
//         {proposals.map((proposal) => (
//           <div key={proposal.id} className='rounded-lg border p-4 shadow-sm'>
//             <h4 className='font-bold'>{proposal.proposalName}</h4>
//             <p className='text-muted-foreground text-sm'>
//               Status: {proposal.status}
//             </p>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <PageContainer>
//       <div className='container mx-auto py-8'>
//         <h1 className='mb-6 text-3xl font-bold'>My Proposals</h1>
//         {renderContent()}
//       </div>
//     </PageContainer>
//   );
// }





'use client';

import PageContainer from '@/components/layout/page-container';
import { getProposals, Proposal } from '@/lib/services/proposalService';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/layout/providers';
import { Loader2, FileSearch, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ProposalDetailDialog } from '@/components/proposals/ProposalDetailDialog';
import { CreateProposalForm } from '@/components/proposals/CreateProposalForm'; // Import the renamed form

export default function MyProposalsPage() {
  const { user, loading: authLoading } = useAuth();

  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for managing which dialogs are open
  const [viewingProposal, setViewingProposal] = useState<Proposal | null>(null);
  const [editingProposal, setEditingProposal] = useState<Proposal | null>(null);

  const fetchProposals = async () => {
    setIsLoading(true);
    try {
      const data = await getProposals();
      if (data) setProposals(data);
    } catch (err) {
      toast.error('Failed to load proposals.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchProposals();
    } else if (!authLoading && !user) {
      setIsLoading(false);
    }
  }, [user, authLoading]);

  const handleEditClick = (proposal: Proposal) => {
    setViewingProposal(null); // Close the view dialog
    setEditingProposal(proposal); // Open the edit dialog
  };
  
  const handleDeleteSuccess = (deletedProposalId: string) => {
    setProposals(currentProposals => 
        currentProposals.filter(p => p.id !== deletedProposalId)
    );
  };
  
  const handleEditSuccess = () => {
    setEditingProposal(null); // Close the edit dialog
    fetchProposals(); // Re-fetch the list to show updated data
  };

  const renderContent = () => {
    if (isLoading) { /* ... loading UI ... */ }
    if (proposals.length === 0) { /* ... empty state UI ... */ }

    return (
      <div className='space-y-4'>
        {proposals.map((proposal) => (
          <div key={proposal.id} className='rounded-lg border bg-card p-4 shadow-sm flex justify-between items-center'>
            <div>
              <h4 className='font-bold'>{proposal.proposalName}</h4>
              <p className='text-muted-foreground text-sm'>
                Status: <Badge variant="outline">{proposal.status}</Badge>
              </p>
            </div>
            <Button variant="ghost" onClick={() => setViewingProposal(proposal)}>
                <Eye className="mr-2 h-4 w-4" /> View Details
            </Button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <PageContainer>
        <div className='container mx-auto py-8'>
          <h1 className='mb-6 text-3xl font-bold'>My Proposals</h1>
          {renderContent()}
        </div>
      </PageContainer>

      {/* View Details Dialog */}
      <ProposalDetailDialog
        isOpen={!!viewingProposal}
        onClose={() => setViewingProposal(null)}
        proposal={viewingProposal}
        onEdit={handleEditClick}
        onDeleteSuccess={handleDeleteSuccess}
      />
      
      {/* Edit Form Dialog */}
      <Dialog open={!!editingProposal} onOpenChange={() => setEditingProposal(null)}>
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Edit Proposal</DialogTitle>
            <DialogDescription>Make changes to your proposal below and click save.</DialogDescription>
          </DialogHeader>
          <div className="py-4 max-h-[80vh] overflow-y-auto pr-4">
            <CreateProposalForm 
              key={editingProposal?.id} // Force re-mount on change
              proposalToEdit={editingProposal}
              onFormSubmit={handleEditSuccess}
              isModalMode={true}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
