'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Proposal, deleteProposal } from '@/lib/services/proposalService';
import { formatDate, formatCurrency } from '@/lib/utils';
import {
  CalendarDays,
  Clock,
  DollarSign,
  FileText,
  ListChecks,
  Trash2,
  Pencil,
  Loader2,
  Info,
  Euro
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ProposalDetailDialogProps {
  proposal: Proposal | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (proposal: Proposal) => void;
  onDeleteSuccess: (proposalId: string) => void;
}

// Small helper component for displaying info items
const InfoItem = ({ icon: Icon, label, value, className }: { icon: React.ElementType, label: string, value: React.ReactNode, className?: string }) => (
    <div className={cn("flex items-start gap-3", className)}>
        <Icon className="h-5 w-5 flex-shrink-0 text-muted-foreground mt-1" />
        <div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="font-semibold text-foreground">{value}</p>
        </div>
    </div>
);

export function ProposalDetailDialog({ proposal, isOpen, onClose, onEdit, onDeleteSuccess }: ProposalDetailDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !proposal) {
    return null;
  }

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this proposal? This action cannot be undone.")) {
      return;
    }
    setIsDeleting(true);
    try {
      await deleteProposal(proposal.id);
      onDeleteSuccess(proposal.id);
      onClose(); // Close this dialog after successful deletion
    } catch (error: any) {
      toast.error("Failed to delete proposal", { description: error.message });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl flex flex-col max-h-[90vh]">
        <DialogHeader className="pr-6">
          <DialogTitle className="text-2xl font-bold pr-10">{proposal.proposalName}</DialogTitle>
          <DialogDescription>
            Submitted on {formatDate(proposal.createdAt)}
          </DialogDescription>
          <div className="pt-2">
            <Badge 
              className={cn(
                proposal.status === 'PENDING' && 'bg-amber-100 text-amber-800',
                proposal.status === 'APPROVED' && 'bg-green-100 text-green-800',
                proposal.status === 'REJECTED' && 'bg-red-100 text-red-800'
              )}
            >
              {proposal.status}
            </Badge>
          </div>
        </DialogHeader>

        {/* Scrollable Content Area */}
        <div className="flex-grow overflow-y-auto space-y-6 pr-6 -mr-6 pl-6">
          
          {/* Key Metrics Section */}
          <div className="py-4 border-t border-b">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-6">
                <InfoItem icon={Euro} label="Quotation" value={formatCurrency(proposal.quotation, proposal.currency)} />
                <InfoItem icon={CalendarDays} label="Start Date" value={formatDate(proposal.startDate)} />
                <InfoItem icon={CalendarDays} label="End Date" value={formatDate(proposal.endDate)} />
                <InfoItem icon={Clock} label="Est. Duration" value={`${proposal.estimatedDuration} days`} />
            </div>
          </div>

          {/* Scope of Work Section */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Scope of Work</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{proposal.description}</p>
          </div>
          
          {/* Note to Client Section */}
           {proposal.requestNote && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2"><Info className="h-5 w-5"/>Note to Client</h3>
              <p className="text-muted-foreground italic border-l-4 pl-4">{proposal.requestNote}</p>
            </div>
          )}

          <Separator />

          {/* Terms & Deliverables Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2"><FileText className="h-5 w-5"/>Terms</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-foreground">
                {proposal.terms.map((term, i) => <li key={i}>{term}</li>)}
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2"><ListChecks className="h-5 w-5"/>Deliverables</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-foreground">
                {proposal.deliverables.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-4 border-t flex-shrink-0">
          <div className="w-full flex justify-between items-center">
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              Delete
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>Close</Button>
              <Button onClick={() => onEdit(proposal)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Proposal
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}