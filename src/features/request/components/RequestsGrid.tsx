import React, { useCallback, useEffect, useState } from 'react';
import { EngagementRequest } from '../types/request';
import { getUrgencyColor, formatDate, downloadAllAttachments } from '../utils';

// Import icons for a more visual and intuitive UI
import {
  Bookmark,
  DollarSign,
  CalendarDays,
  Briefcase,
  Paperclip,
  UserCircle,
  Eye,
  Send,
  CheckCircle,
  FileSearch,
  File,
  Download,
  MapPin
} from 'lucide-react';

import { ClientRequest } from '@/lib/services/clientRequestService';
import { ClientRequestDetailDialog } from './ClientRequestDetailDialog';
import SubmitProposalDialog from './SubmitProposalDialog';



interface RequestsGridProps {
  clientRequests: ClientRequest[];
  requests: EngagementRequest[];
  bookmarkedRequests: number[];
  onToggleBookmark: (id: number) => void;
  onPreview: (request: EngagementRequest) => void;
  onSubmitProposal: (request: EngagementRequest) => void;
  isProposalSubmitted: (id: number) => boolean;
}



const RequestsGrid: React.FC<RequestsGridProps> = ({
  clientRequests,
  requests,
  bookmarkedRequests,
  onToggleBookmark,
  onPreview,
  onSubmitProposal,
  isProposalSubmitted
}) => {
  const [selectedClientRequest, setSelectedClientRequest] =
    useState<ClientRequest | null>(null);

    const [isopen, setIsopen] = useState(false)
    const [isSubmitModelOpen, setIsSubmitModelOpen] = useState(false)

  const onClose = () => {
    setSelectedClientRequest(null);
  };
  const onCloseSubmitModel = () => {
    setIsSubmitModelOpen(false)
  };

  
  const handleSubmitProposal = () => {

  }

  if (requests.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center px-6 py-20 text-center'>
        <FileSearch
          className='text-muted-foreground/50 mb-6 h-20 w-20'
          strokeWidth={1}
        />
        <h3 className='text-foreground mb-2 text-xl font-semibold'>
          No Requests Found
        </h3>
        <p className='text-muted-foreground max-w-sm'>
          There are currently no engagement requests that match your criteria.
          Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {requests.map((request) => {
        const isBookmarked = bookmarkedRequests.includes(request.id);
        const hasSubmitted = isProposalSubmitted(request.id);

        return (
          <div
            key={request.id}
            className='bg-card text-card-foreground rounded-xl border shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg'
          >
            <div className='p-5 sm:p-6'>
              {/* --- Card Header --- */}
              <div className='mb-4 flex items-start justify-between'>
                <div className='flex-1'>
                  {/* Tags and Badges */}
                  <div className='mb-3 flex flex-wrap items-center gap-2'>
                    <span className='bg-primary/10 text-primary inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold'>
                      {request.type}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getUrgencyColor(request.urgency)}`}
                    >
                      {request.urgency}
                    </span>
                    {request.tags.map((tag, index) => (
                      <span
                        key={index}
                        className='inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Main Title */}
                  <h3 className='text-foreground text-lg font-bold sm:text-xl'>
                    {request.industry} - {request.size} Business
                  </h3>
                  <p className='text-muted-foreground mt-1 text-sm'>
                    Framework: {request.framework} • Submitted:{' '}
                    {formatDate(request.submittedDate)}
                  </p>
                </div>

                {/* Bookmark Button with Icon */}
                <button
                  onClick={() => onToggleBookmark(request.id)}
                  className='text-muted-foreground hover:bg-muted hover:text-primary ml-4 rounded-full p-2 transition-colors'
                  aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                >
                  <Bookmark
                    size={22}
                    className={`transition-all duration-200 ${isBookmarked ? 'fill-primary text-primary' : 'fill-transparent'}`}
                  />
                </button>
              </div>

              {/* --- Key Information Section with Icons --- */}
              <div className='border-border my-5 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-b py-4 text-sm md:grid-cols-4'>
                <div className='text-foreground flex items-center gap-2'>
                  <DollarSign className='text-muted-foreground h-4 w-4' />
                  <span className='font-medium'>{request.budget}</span>
                </div>
                <div className='text-foreground flex items-center gap-2'>
                  <CalendarDays className='text-muted-foreground h-4 w-4' />
                  <span>Due: {formatDate(request.deadline)}</span>
                </div>
                <div className='text-foreground flex items-center gap-2'>
                  <Briefcase className='text-muted-foreground h-4 w-4' />
                  <span>{request.industry}</span>
                </div>
                <div className='text-foreground flex items-center gap-2'>
                  <Paperclip className='text-muted-foreground h-4 w-4' />
                  <span>
                    {request.attachments.length} attachment
                    {request.attachments.length > 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Project Notes */}
              <div>
                <h4 className='text-foreground mb-2 font-semibold'>
                  Project Notes
                </h4>
                <p className='text-muted-foreground line-clamp-3 text-sm'>
                  {request.notes}
                </p>
              </div>

              {request.attachments.length > 0 && (
                <div className='mt-5'>
                  <h4 className='text-foreground mb-3 font-semibold'>
                    Attachments
                  </h4>
                  <div className='flex flex-col gap-2'>
                    <div className='flex flex-wrap gap-2'>
                      {request.attachments.map((attachment, index) => (
                        <div
                          key={index}
                          className='bg-muted/70 text-muted-foreground flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm font-medium'
                        >
                          <File size={14} className='flex-shrink-0' />
                          <span className='truncate'>{attachment}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() =>
                        downloadAllAttachments(request.attachments)
                      }
                      className='text-primary hover:bg-primary/10 mt-2 inline-flex items-center gap-2 self-start rounded-lg border border-transparent px-3 py-1.5 text-sm font-medium transition-colors'
                    >
                      <Download size={14} />
                      Download All
                    </button>
                  </div>
                </div>
              )}

              {/* --- Card Footer: Client Info & Actions --- */}
              <div className='border-border mt-5 flex flex-col items-start justify-between gap-4 border-t pt-5 sm:flex-row sm:items-center'>
                {/* Client Info */}
                <div className='flex items-center gap-3'>
                  {request.anonymous ? (
                    <>
                      <UserCircle className='text-muted-foreground/80 h-9 w-9' />
                      <div className='text-sm'>
                        <span className='text-foreground font-semibold'>
                          Anonymous Client
                        </span>
                        <p className='text-muted-foreground'>
                          Identity protected
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className='bg-primary/10 ring-primary/20 flex h-9 w-9 items-center justify-center rounded-full ring-2'>
                        <span className='text-primary text-sm font-bold'>
                          {request.clientName
                            ?.split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </span>
                      </div>
                      <div className='text-sm'>
                        <span className='text-foreground font-semibold'>
                          {request.clientName}
                        </span>
                        <p className='text-muted-foreground'>Verified Client</p>
                      </div>
                    </>
                  )}
                </div>

                {/* Action Buttons */}
                <div className='flex w-full items-center gap-3 sm:w-auto'>
                  <button
                    onClick={() => onPreview(request)}
                    className='border-border hover:bg-muted bg-card text-foreground flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors sm:flex-none'
                  >
                    <Eye size={16} />
                    Preview
                  </button>
                  <button
                    onClick={() => {
                      onSubmitProposal(request);
                    }}
                    disabled={hasSubmitted}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors sm:flex-none ${
                      hasSubmitted
                        ? 'cursor-default bg-green-600/90 text-white'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    }`}
                  >
                    {hasSubmitted ? (
                      <CheckCircle size={16} />
                    ) : (
                      <Send size={16} />
                    )}
                    {hasSubmitted ? 'Submitted' : 'Submit Proposal'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}





      {/* original */}

      {clientRequests.map((request: any) => {
        const isBookmarked = bookmarkedRequests.includes(request.id);
        const hasSubmitted = isProposalSubmitted(request.id);

        return (
          <div
            key={request.id}
            className='bg-card text-card-foreground rounded-xl border shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg'
          >
            <div className='p-5 sm:p-6'>
              {/* --- Card Header --- */}
              <div className='mb-4 flex items-start justify-between'>
                <div className='flex-1'>
                  {/* Tags and Badges */}
                  <div className='mb-3 flex flex-wrap items-center gap-2'>
                    <span className='bg-primary/10 text-primary inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold'>
                      {request.type}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getUrgencyColor(request.urgency)}`}
                    >
                      {request.urgency}
                    </span>
                  </div>

                  {/* Main Title */}
                  <h3 className='text-foreground text-lg font-bold sm:text-xl'>
                    {request.title}
                  </h3>
                  <p className='text-muted-foreground mt-1 text-sm'>
                    Framework: {request.framework} • Submitted:{' '}
                    {formatDate(request.auditEnd)}
                  </p>
                </div>

                {/* Bookmark Button with Icon */}
                <button
                  onClick={() => onToggleBookmark(request.id)}
                  className='text-muted-foreground hover:bg-muted hover:text-primary ml-4 rounded-full p-2 transition-colors'
                  aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                >
                  <Bookmark
                    size={22}
                    className={`transition-all duration-200 ${isBookmarked ? 'fill-primary text-primary' : 'fill-transparent'}`}
                  />
                </button>
              </div>

              {/* --- Key Information Section with Icons --- */}
              <div className='border-border my-5 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-b py-4 text-sm md:grid-cols-4'>
                <div className='text-foreground flex items-center gap-2'>
                  <DollarSign className='text-muted-foreground h-4 w-4' />
                  <span className='font-medium'>{request.budget}</span>
                </div>
                <div className='text-foreground flex items-center gap-2'>
                  <CalendarDays className='text-muted-foreground h-4 w-4' />
                  <span>Due: {formatDate(request.deadline)}</span>
                </div>
                <div className='text-foreground flex items-center gap-2'>
                  <MapPin className='text-muted-foreground h-4 w-4' />

                  <span>{request.timeZone}</span>
                </div>
                <div className='text-foreground flex items-center gap-2'>
                  <Paperclip className='text-muted-foreground h-4 w-4' />
                  <span>
                    {request.specialFlags.map(
                      (element: string, index: number) => (
                        <p key={index}>{element}</p>
                      )
                    )}
                  </span>
                </div>
              </div>

              {/* Project Notes */}
              <div>
                <h4 className='text-foreground mb-2 font-semibold'>
                  Project Notes
                </h4>
                <p className='text-muted-foreground line-clamp-3 text-sm'>
                  {request.notes}
                </p>
              </div>

              {request.specialFlags.length > 0 && (
                <div className='mt-5'>
                  <h4 className='text-foreground mb-3 font-semibold'>
                    Attachments
                  </h4>
                </div>
              )}

              {/* --- Card Footer: Client Info & Actions --- */}
              <div className='border-border mt-5 flex flex-col items-start justify-between gap-4 border-t pt-5 sm:flex-row sm:items-center'>
                {/* Client Info */}
                <div className='flex items-center gap-3'>
                  {request.anonymous ? (
                    <>
                      <UserCircle className='text-muted-foreground/80 h-9 w-9' />
                      <div className='text-sm'>
                        <span className='text-foreground font-semibold'>
                          Anonymous Client
                        </span>
                        <p className='text-muted-foreground'>
                          Identity protected
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className='text-sm'>
                        <div className='flex items-end gap-5'>
                          <div className='flex-col'>
                            <span className='text-foreground font-semibold'>
                              {request.timeZone}
                            </span>
                            <p className='text-muted-foreground'>
                              Verified Client
                            </p>
                          </div>
                          <p>Available on:&nbsp;{request.workingHours}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Action Buttons */}
                <div className='flex w-full items-center gap-3 sm:w-auto'>
                  <button
                    onClick={() => setSelectedClientRequest(request)}
                    className='border-border hover:bg-muted bg-card text-foreground flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors sm:flex-none'
                  >
                    <Eye size={16} />
                    Preview
                  </button>
                  <button
                    onClick={() => {
                      setSelectedClientRequest(request)
                      setIsSubmitModelOpen(true)
                    }}
                    disabled={hasSubmitted}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors sm:flex-none ${
                      hasSubmitted
                        ? 'cursor-default bg-green-600/90 text-white'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    }`}
                  >
                    {hasSubmitted ? (
                      <CheckCircle size={16} />
                    ) : (
                      <Send size={16} />
                    )}
                    {hasSubmitted ? 'Submitted' : 'Submit Proposal'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      
        <ClientRequestDetailDialog
          request={selectedClientRequest}
          isOpen={!!selectedClientRequest}
          onClose={onClose}
          handleSubmitProposal={handleSubmitProposal}
         />


        <SubmitProposalDialog
          request={selectedClientRequest}
          isOpen={!!isSubmitModelOpen}
          onClose={onCloseSubmitModel}
          handleSubmitProposal={handleSubmitProposal}
         />
         
      
    </div>
  );
};

export default RequestsGrid;
