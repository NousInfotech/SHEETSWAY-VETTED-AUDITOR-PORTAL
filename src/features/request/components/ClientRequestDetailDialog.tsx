'use client';

import React from 'react';
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
import { ClientRequest } from '@/lib/services/clientRequestService'; // Import your type
import { formatDate, formatCurrency } from './lib/utils';
import {
  CalendarDays,
  Clock,
  DollarSign,
  Globe,
  Languages,
  Send,
  Building,
} from 'lucide-react';

export interface ClientRequestDetailDialogProps {
  request: ClientRequest | null;
  isOpen: boolean;
  onClose: () => void;
  handleSubmitProposal: (request: ClientRequest) => void;
  // add new one
  onKnowMoreFromAi: (request: ClientRequest) => void;
}

// A small helper component for displaying key-value pairs with icons
const InfoItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: React.ReactNode }) => (
    <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 flex-shrink-0 text-muted-foreground mt-0.5" />
        <div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="font-semibold">{value}</p>
        </div>
    </div>
);

export function ClientRequestDetailDialog({
  request,
  isOpen,
  onClose,
  handleSubmitProposal,
  onKnowMoreFromAi,
}: ClientRequestDetailDialogProps) {
  if (!isOpen || !request) {
    return null;
  }

  // Calculate duration if start and end dates are available
  const getDuration = () => {
    if (request.auditStart && request.auditEnd) {
      const start = new Date(request.auditStart);
      const end = new Date(request.auditEnd);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} days`;
    }
    return 'Not specified';
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl flex flex-col max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{request.title}</DialogTitle>
          <DialogDescription>
            Posted on {formatDate(request.createdAt)}
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Content Area */}
        <div className="flex-grow overflow-y-auto pr-4 space-y-6">
          
          {/* Tags Section */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={request.urgency === 'URGENT' ? 'destructive' : 'secondary'}>
              {request.urgency}
            </Badge>
            <Badge variant="outline">{request.type}</Badge>
            <Badge variant="outline">{request.framework}</Badge>
            {request.specialFlags.map(flag => (
                <Badge key={flag} variant="outline" className="capitalize">{flag}</Badge>
            ))}
          </div>

          {/* Key Metrics Section */}
          <div className="py-4 border-t border-b">
            <h3 className="text-lg font-semibold mb-4">Key Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-6">
                <InfoItem icon={DollarSign} label="Budget" value={formatCurrency(request.budget, 'USD')} />
                <InfoItem icon={CalendarDays} label="Deadline" value={formatDate(request.deadline)} />
                <InfoItem icon={Clock} label="Estimated Duration" value={getDuration()} />
                <InfoItem icon={Building} label="Financial Year" value={formatDate(request.financialYear).split(',')[1]} />
            </div>
          </div>

          {/* Project Details Section */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Project Details</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{request.notes}</p>
          </div>

          {/* Client Preferences Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Client Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InfoItem icon={Languages} label="Preferred Languages" value={request.preferredLanguages.join(', ')} />
                <InfoItem icon={Globe} label="Timezone" value={request.timeZone} />
                <InfoItem icon={Clock} label="Working Hours" value={request.workingHours} />
            </div>
          </div>

        </div>

        <DialogFooter className="pt-4 border-t">
          <Button variant="outline" onClick={() => onKnowMoreFromAi(request)}>
            KNOW More From AI
          </Button>
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button className='hidden' onClick={() => handleSubmitProposal(request)}>
            <Send className="mr-2 h-4 w-4" />
            Submit Proposal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}