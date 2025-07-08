import React from 'react';
import { EngagementRequest } from '../types/request';
import { getUrgencyColor, formatDate, downloadAllAttachments } from '../utils';

interface RequestsGridProps {
  requests: EngagementRequest[];
  bookmarkedRequests: number[];
  onToggleBookmark: (id: number) => void;
  onPreview: (request: EngagementRequest) => void;
  onSubmitProposal: (request: EngagementRequest) => void;
  isProposalSubmitted: (id: number) => boolean;
}

const RequestsGrid: React.FC<RequestsGridProps> = ({
  requests,
  bookmarkedRequests,
  onToggleBookmark,
  onPreview,
  onSubmitProposal,
  isProposalSubmitted
}) => {
  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="block text-lg font-medium text-foreground mb-2">No requests found</span>
        <span className="text-muted-foreground">Try adjusting your search criteria or filters</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {requests.map((request) => (
        <div key={request.id} className="bg-card rounded-lg border border-border hover:shadow-lg transition-shadow">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-muted text-foreground rounded-full text-sm font-medium">
                    {request.type}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getUrgencyColor(request.urgency)}`}>
                    {request.urgency}
                  </span>
                  {request.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {request.industry} - {request.size} Business
                </h3>
                <p className="text-muted-foreground mb-4">
                  Framework: {request.framework} • Submitted: {formatDate(request.submittedDate)}
                </p>
              </div>
              <button
                onClick={() => onToggleBookmark(request.id)}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {bookmarkedRequests.includes(request.id) ? (
                  <span className="text-primary">★</span>
                ) : (
                  <span>☆</span>
                )}
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-foreground">{request.budget}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-foreground">Due: {formatDate(request.deadline)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-foreground">{request.attachments.length} attachments</span>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">Project Notes:</h4>
                <p className="text-muted-foreground text-sm">{request.notes}</p>
              </div>

              {request.attachments.length > 0 && (
                <div>
                  <h4 className="font-medium text-foreground mb-2">Attachments:</h4>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {request.attachments.map((attachment, index) => (
                      <span key={index} className="px-2 py-1 bg-muted text-foreground rounded text-sm">
                        {attachment}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => downloadAllAttachments(request.attachments)}
                    className="px-3 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors text-sm font-medium"
                  >
                    Download All Attachments
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  {request.anonymous ? (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full text-sm">
                      Anonymous Request
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-medium text-sm">
                          {request.clientName?.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="text-foreground font-medium">{request.clientName}</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => onPreview(request)}
                    className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors bg-card text-foreground"
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => onSubmitProposal(request)}
                    disabled={isProposalSubmitted(request.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isProposalSubmitted(request.id)
                        ? 'bg-muted text-muted-foreground cursor-not-allowed'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    }`}
                  >
                    {isProposalSubmitted(request.id) ? 'Submitted' : 'Submit Proposal'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RequestsGrid; 