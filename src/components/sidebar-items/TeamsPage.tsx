'use client';

import { useEffect, useState } from 'react';
import { AuditorCard } from './AuditorCard';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AuditorRegistrationForm } from '@/components/auth-register/AuditorRegistrationForm';
import { PlusCircle, Loader2, UserX } from 'lucide-react';
import { useAuth } from '../layout/providers';
import { getAllAuditors } from '@/lib/services/auditorService';
import { AuditorProfile } from '@/stores/useProfileStore';
import { toast } from 'sonner';
import PageContainer from '@/components/layout/page-container';
import { AuditorDetailDialog } from './AuditorDetailDialog';

export default function TeamsPage() {
  const { user, loading: authLoading } = useAuth();
  
  // State for data fetching
  const [auditors, setAuditors] = useState<AuditorProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for dialogs
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [viewingAuditor, setViewingAuditor] = useState<AuditorProfile | null>(null);
  const [editingAuditor, setEditingAuditor] = useState<AuditorProfile | null>(null);

  const fetchTeamMembers = async () => {
    setIsLoading(true);
    try {
      const data = await getAllAuditors();
      if (data) {
        setAuditors(data);
      }
    } catch (error) {
      toast.error("Failed to load team members.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchTeamMembers();
    } else if (!authLoading && !user) {
      setIsLoading(false);
    }
  }, [user, authLoading]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      );
    }
    if (auditors.length === 0) {
      return (
        <div className='flex flex-col items-center justify-center px-6 py-20 text-center'>
          <UserX className='text-muted-foreground/50 mb-6 h-20 w-20' strokeWidth={1} />
          <h3 className='text-foreground mb-2 text-xl font-semibold'>No Team Members Found</h3>
          <p className='text-muted-foreground max-w-sm'>Click "Add Member" to build your team.</p>
        </div>
      );
    }
    return (
      <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
        {auditors.map((auditor) => (
          <AuditorCard
            key={auditor.id}
            auditor={auditor}
            onViewProfile={setViewingAuditor} // Pass the setter function directly
            onEditProfile={setEditingAuditor}   // Pass the setter function directly
          />
        ))}
      </div>
    );
  };

  return (
    <PageContainer>
      <div className='container mx-auto px-4 py-12'>
        <div className='mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-center'>
          <div className='text-center md:text-left'>
            <h1 className='text-4xl font-bold tracking-tight sm:text-5xl'>Meet Our Team</h1>
            <p className='mt-3 max-w-2xl text-lg text-muted-foreground'>A dedicated team of world-class security professionals.</p>
          </div>
          <div className='flex-shrink-0 text-center md:text-right'>
            <Button onClick={() => setIsAddMemberDialogOpen(true)}>
              <PlusCircle className='mr-2 h-4 w-4' />
              Add Member
            </Button>
          </div>
        </div>
        {renderContent()}
      </div>

      {/* --- DIALOGS --- */}
      <AuditorDetailDialog 
        isOpen={!!viewingAuditor}
        onClose={() => setViewingAuditor(null)}
        auditor={viewingAuditor}
      />

      <Dialog open={!!editingAuditor} onOpenChange={(isOpen) => !isOpen && setEditingAuditor(null)}>
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Edit Auditor Profile</DialogTitle>
            <DialogDescription>Update the profile details for {editingAuditor?.name}.</DialogDescription>
          </DialogHeader>
          <div className="py-4 max-h-[80vh] overflow-y-auto pr-4">
            {/* The AuditorRegistrationForm would need to be updated to handle editing */}
            {/* For now, we'll just show the form */}
            {editingAuditor && (
                <AuditorRegistrationForm 
                key={editingAuditor ? editingAuditor.id : 'create'}
                isModalMode={true}
                auditorToEdit={editingAuditor}
                onFormSubmit={() => {
                    setEditingAuditor(null);
                    fetchTeamMembers(); // Re-fetch data on success
                }} 
            />
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Add a New Auditor</DialogTitle>
            <DialogDescription>Register a new auditor to join the firm.</DialogDescription>
          </DialogHeader>
          <div className="py-4 max-h-[80vh] overflow-y-auto pr-4">
            <AuditorRegistrationForm 
              onFormSubmit={() => {
                setIsAddMemberDialogOpen(false);
                fetchTeamMembers(); // Re-fetch data on success
              }} 
            />
          </div>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}