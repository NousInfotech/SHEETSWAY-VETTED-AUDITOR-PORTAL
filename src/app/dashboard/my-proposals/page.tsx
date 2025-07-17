"use client";

import PageContainer from '@/components/layout/page-container';
import { getProposals, Proposal } from '@/lib/services/proposalService';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/layout/providers';
import { Loader2, FileSearch } from 'lucide-react';
import { toast } from 'sonner';


export default function MyProposalsPage() {
  const { user, loading: authLoading } = useAuth();

  
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  
  useEffect(() => {
    
    const fetchProposals = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getProposals();
        if (data) {
          setProposals(data);
        } else {
          
          setError("Failed to fetch proposals.");
          toast.error("Could not load proposals.");
        }
      } catch (err) {
        
        setError("An error occurred while fetching data.");
        toast.error("Failed to load proposals.");
      } finally {
        setIsLoading(false);
      }
    };

    
    if (!authLoading && user) {
      fetchProposals();
    } else if (!authLoading && !user) {
      
      setIsLoading(false);
      setError("You must be logged in to view proposals.");
    }
  }, [user, authLoading]); 


  // 5. Render UI based on the current state.
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="ml-3">Loading your proposals...</p>
        </div>
      );
    }
    
    if (error) {
        return (
            <div className='flex flex-col items-center justify-center px-6 py-20 text-center'>
                <h3 className='text-destructive mb-2 text-xl font-semibold'>Error</h3>
                <p className='text-muted-foreground max-w-sm'>{error}</p>
            </div>
        )
    }

    if (proposals.length === 0) {
      return (
        <div className='flex flex-col items-center justify-center px-6 py-20 text-center'>
          <FileSearch className='text-muted-foreground/50 mb-6 h-20 w-20' strokeWidth={1}/>
          <h3 className='text-foreground mb-2 text-xl font-semibold'>No Proposals Found</h3>
          <p className='text-muted-foreground max-w-sm'>You have not created or received any proposals yet.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Map over the proposals and render them */}
        {proposals.map((proposal) => (
          <div key={proposal.id} className="p-4 border rounded-lg shadow-sm">
            <h4 className="font-bold">{proposal.proposalName}</h4>
            <p className="text-sm text-muted-foreground">Status: {proposal.status}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <PageContainer>
      <div className='container mx-auto py-8'>
        <h1 className="text-3xl font-bold mb-6">My Proposals</h1>
        {renderContent()}
      </div>
    </PageContainer>
  );
}