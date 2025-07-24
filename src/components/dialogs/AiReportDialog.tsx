'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ReportData } from '@/components/ai-mock/flowing-audit-report';
import { AiReportGenerator } from './AiReportGenerator'; // <-- Import the new component

export interface AiReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  reportData: ReportData | null;
}

export function AiReportDialog({ isOpen, onClose, reportData }: AiReportDialogProps) {
  if (!isOpen || !reportData) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl min-h-[500px] max-h-[90vh] flex flex-col">
        
        <DialogHeader className="sr-only">
          <DialogTitle>AI-Generated Audit Readiness Report</DialogTitle>
          <DialogDescription>
            An in-depth analysis of the client request, providing insights and readiness scores.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-grow overflow-y-auto -mx-6 -my-6">
          {/* --- Render the generator instead of the report directly --- */}
          <AiReportGenerator reportData={reportData} />
        </div>

        <DialogFooter className="pt-4 border-t">
           <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}