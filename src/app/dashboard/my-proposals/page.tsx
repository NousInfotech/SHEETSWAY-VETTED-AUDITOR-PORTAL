'use client';

import PageContainer from '@/components/layout/page-container';
import { getProposals, Proposal } from '@/lib/services/proposalService';
import React, { useEffect, useMemo, useState } from 'react';
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
  DialogTitle
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

  const fetchProposals = async () => {
    setIsLoading(true);
    try {
      const data = await getProposals();
      if (data) {
        let myfirmProposals = data.filter(
          (item) => item.auditFirmId === my_profile.auditFirmId
        );
        const sortedProposals = myfirmProposals.sort((a, b) => {
          //  Use .getTime() to convert dates to numbers before subtracting.
          // This sorts in descending order (newest first).
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
        console.log(sortedProposals)
        setProposals(sortedProposals);
      }
    } catch (err) {
      toast.error('Failed to load proposals.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user && my_profile) {
      fetchProposals();
    } else if (!authLoading && !user) {
      setIsLoading(false);
    }
  }, [user, authLoading, my_profile]);

  const handleEditClick = (proposal: Proposal) => {
    setViewingProposal(null); // Close the view dialog
    setEditingProposal(proposal); // Open the edit dialog
  };

  const handleDeleteSuccess = (deletedProposalId: string) => {
    setProposals((currentProposals) =>
      currentProposals.filter((p) => p.id !== deletedProposalId)
    );
  };

  const handleEditSuccess = () => {
    setEditingProposal(null); // Close the edit dialog
    fetchProposals(); // Re-fetch the list to show updated data
  };

  const renderContent = () => {
    if (isLoading) {
      <div className='text-xl text-red-500 font-medium w-full max-w-6xl mx-auto my-24'>Loading......</div>
    }
    if (proposals.length === 0) {
      <div className='text-xl text-red-500 font-medium w-full max-w-6xl mx-auto my-24'>No Proposals Available!!!</div>
    }

    return (
      <div className='space-y-4'>
        {proposals.map((proposal) => (
          <div
            key={proposal.id}
            className='bg-card flex items-center justify-between rounded-lg border p-4 shadow-sm'
          >
            <div>
              <h4 className='font-bold'>{proposal.proposalName}</h4>
              <p className='text-muted-foreground text-sm'>
                Status: <Badge variant='outline'>{proposal.status}</Badge>
              </p>
            </div>
            <Button
              variant='ghost'
              onClick={() => setViewingProposal(proposal)}
            >
              <Eye className='mr-2 h-4 w-4' /> View Details
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
          <h1 className='mb-6 text-3xl font-bold'>Proposals</h1>
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
      <Dialog
        open={!!editingProposal}
        onOpenChange={() => setEditingProposal(null)}
      >
        <DialogContent className='sm:max-w-[900px]'>
          <DialogHeader>
            <DialogTitle className='text-2xl'>Edit Proposal</DialogTitle>
            <DialogDescription>
              Make changes to your proposal below and click save.
            </DialogDescription>
          </DialogHeader>
          <div className='max-h-[80vh] overflow-y-auto py-4 pr-4'>
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
