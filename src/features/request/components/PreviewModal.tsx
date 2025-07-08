// components/PreviewModal.tsx
import React from 'react';
import { X } from 'lucide-react';
import { PreviewModalProps } from '../types/request';
import { formatDate } from '../utils';

const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose, request }) => {
  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/70">
      <div className="bg-card text-foreground rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-blue-500 scrollbar-track-blue-100 dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-900">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Request Details</h2>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="text-muted-foreground mt-1">
            {request.industry} - {request.size} Business
          </p>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Type</label>
              <p className="text-sm text-foreground">{request.type}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Framework</label>
              <p className="text-sm text-foreground">{request.framework}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Budget Range</label>
              <p className="text-sm text-foreground">{request.budget}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Deadline</label>
              <p className="text-sm text-foreground">{formatDate(request.deadline)}</p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Detailed Notes</label>
            <p className="text-sm text-foreground">{request.notes}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Attachments</label>
            <div className="flex flex-wrap gap-2">
              {request.attachments.map((attachment, index) => (
                <span key={index} className="px-2 py-1 bg-muted text-foreground rounded text-sm">
                  {attachment}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;