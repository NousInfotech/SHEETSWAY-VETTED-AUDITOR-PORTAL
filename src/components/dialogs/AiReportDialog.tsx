'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ReportData } from '@/components/ai-mock/flowing-audit-report';
import { AiReportGenerator } from './AiReportGenerator';

export interface AiReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  reportData: ReportData | null;
}

export function AiReportDialog({
  isOpen,
  onClose,
  reportData
}: AiReportDialogProps) {
  const [currentPhase, setCurrentPhase] = useState<
    'LOADING' | 'ANALYZING' | 'RENDERING'
  >('LOADING');

  if (!isOpen || !reportData) {
    return null;
  }

  const isCenteringPhase =
    currentPhase === 'LOADING' || currentPhase === 'ANALYZING';

  const contentWrapperClasses = `
    flex-grow
    overflow-y-auto
    -mx-6 -my-6
    ${isCenteringPhase ? 'flex items-center justify-center' : ''}
  `;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
          setCurrentPhase('LOADING');
        }
      }}
    >
      <DialogContent className='flex max-h-[90vh] min-h-[500px] flex-col sm:max-w-4xl'>
        <DialogHeader className='sr-only'>
          <DialogTitle>AI-Generated Audit Readiness Report</DialogTitle>
          <DialogDescription>
            An in-depth analysis of the client request, providing insights and
            readiness scores.
          </DialogDescription>
        </DialogHeader>

        <div className={contentWrapperClasses}>
          <AiReportGenerator
            reportData={reportData}
            onPhaseChange={setCurrentPhase}
          />
        </div>

        <DialogFooter className='border-t pt-4'>
          <Button variant='outline' onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
