import React from 'react';

import { PreviewModalProps } from '../types/request';
import { formatDate, downloadAllAttachments } from '../utils';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';

import { File, Download } from 'lucide-react';

const InfoItem: React.FC<{
  label: string;
  value: string | React.ReactNode;
}> = ({ label, value }) => (
  <div>
    <p className='text-muted-foreground text-sm font-medium'>{label}</p>
    <p className='text-foreground text-base'>{value}</p>
  </div>
);

const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  request
}) => {
  if (!isOpen || !request) {
    return null;
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className='flex max-h-[90vh] flex-col sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle className='text-foreground text-2xl font-bold'>
            Request Details
          </DialogTitle>
          <DialogDescription>
            {request.industry} - {request.size} Business
          </DialogDescription>
        </DialogHeader>

        {/* This container will hold the scrollable content */}
        <div className='-mx-6 flex-grow overflow-y-auto px-6'>
          <div className='space-y-6 py-4'>
            <div className='grid grid-cols-1 gap-x-6 gap-y-5 border-y py-4 sm:grid-cols-2'>
              <InfoItem label='Type' value={request.type} />
              <InfoItem label='Framework' value={request.framework} />
              <InfoItem label='Budget Range' value={request.budget} />
              <InfoItem label='Deadline' value={formatDate(request.deadline)} />
            </div>

            {/* Detailed Notes Section */}
            <div>
              <h4 className='text-foreground mb-2 font-semibold'>
                Detailed Notes
              </h4>
              <p className='text-muted-foreground text-sm whitespace-pre-wrap'>
                {request.notes}
              </p>
            </div>

            {/* Attachments Section */}
            {request.attachments.length > 0 && (
              <div>
                <h4 className='text-foreground mb-3 font-semibold'>
                  Attachments
                </h4>
                <div className='space-y-3'>
                  <div className='flex flex-wrap gap-2'>
                    {request.attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className='bg-muted text-muted-foreground flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm font-medium'
                      >
                        <File size={14} className='flex-shrink-0' />
                        <span className='truncate'>{attachment}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='text-primary hover:bg-primary/10 hover:text-primary'
                    onClick={() => downloadAllAttachments(request.attachments)}
                  >
                    <Download className='mr-2 h-4 w-4' />
                    Download All
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className='border-t pt-4'>
          {/* Using a standard button for the close action */}
          <Button type='button' variant='outline' onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewModal;
