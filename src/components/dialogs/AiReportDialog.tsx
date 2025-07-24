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
import { FlowingAuditReport } from '@/components/ai-mock/flowing-audit-report'; // Adjust path if you placed this elsewhere
import { ReportData } from '@/components/ai-mock/flowing-audit-report'; // Adjust path if you placed this elsewhere

export interface AiReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  reportData: ReportData | null; // The data for the report
}

export function AiReportDialog({ isOpen, onClose, reportData }: AiReportDialogProps) {
  // If the dialog isn't open or there's no data, render nothing.
  if (!isOpen || !reportData) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
        
        {/*
          This header is visually hidden using the "sr-only" class but is
          required for screen reader accessibility, as mandated by Radix UI.
          It provides context to visually impaired users without affecting the layout.
        */}
        <DialogHeader className="sr-only">
          <DialogTitle>AI-Generated Audit Readiness Report</DialogTitle>
          <DialogDescription>
            An in-depth analysis of the client request, providing insights and readiness scores.
          </DialogDescription>
        </DialogHeader>

        {/* 
          This is the main scrollable area for the report.
          The negative margins allow the content to bleed to the edges of the dialog content area,
          creating a seamless, full-component look.
        */}
        <div className="flex-grow overflow-y-auto -mx-6 -my-6">
          <FlowingAuditReport data={reportData} />
        </div>

        <DialogFooter className="pt-4 border-t">
           <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}