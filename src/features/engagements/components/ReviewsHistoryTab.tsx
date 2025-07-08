import React, { useState, useEffect } from 'react';
import { Review } from '../types/engagement-types';
import { Star, CheckCircle, Download } from 'lucide-react';

interface ReviewsHistoryTabProps {
  reviews: Review[];
  engagementId: string;
}

const ReviewsHistoryTab: React.FC<ReviewsHistoryTabProps> = ({ reviews, engagementId }) => {
  const engagementReviews = reviews.filter(r => r.engagementId === engagementId);
  const [engagement, setEngagement] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);
  const [statusHistory, setStatusHistory] = useState<any[]>([]);
  const [historicalEngagements, setHistoricalEngagements] = useState<any[]>([]);

  useEffect(() => {
    const allEngagements = JSON.parse(localStorage.getItem('engagements') || '[]');
    const current = allEngagements.find((e: any) => e.id === engagementId);
    setEngagement(current);
    setPayments(JSON.parse(localStorage.getItem('payments') || '[]'));
    setContracts(JSON.parse(localStorage.getItem('contracts') || '[]'));
    if (current) {
      const history = [];
      history.push({ date: current.startDate, status: 'Planning' });
      if (current.status === 'In Progress' || current.status === 'Under Review') {
        history.push({ date: current.lastActivity, status: 'In Progress' });
      }
      if (current.status === 'Under Review') {
        history.push({ date: new Date().toISOString().slice(0, 10), status: 'Under Review' });
      }
      setStatusHistory(history);
    }
    setHistoricalEngagements(allEngagements.filter((e: any) => e.status === 'Under Review' && e.id !== engagementId));
  }, [engagementId]);

  const handleDownloadArchive = () => {
    const archive = {
      engagement,
      payments,
      contracts,
      reviews: engagementReviews
    };
    const blob = new Blob([JSON.stringify(archive, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-archive-${engagement?.clientName || engagementId}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Client Reviews</h2>
        {engagementReviews.length === 0 ? (
          <div className="text-gray-600 dark:text-gray-300">No reviews for this engagement yet.</div>
        ) : (
          <div className="space-y-4">
            {engagementReviews.map(review => (
              <div key={review.id} className="bg-card dark:bg-card border border-border rounded-lg p-6 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {review.clientName}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="font-bold">{review.rating}/5</span>
                  </div>
                </div>
                <div className="text-gray-700 dark:text-gray-200 mb-2">
                  {review.comment}
                </div>
                <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <span>Communication: {review.aspects.communication}/5</span>
                  <span>Expertise: {review.aspects.expertise}/5</span>
                  <span>Timeliness: {review.aspects.timeliness}/5</span>
                  <span>Overall: {review.aspects.overall}/5</span>
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  {new Date(review.date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Engagement Timeline</h2>
        <div className="bg-card dark:bg-card border border-border rounded-lg p-6 transition-colors">
          {statusHistory.length === 0 ? (
            <div className="text-gray-600 dark:text-gray-300">No timeline data available.</div>
          ) : (
            <ol className="relative border-l border-blue-400 ml-4">
              {statusHistory.map((event, idx) => (
                <li key={idx} className="mb-6 ml-6">
                  <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                    <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </span>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{event.status}</h3>
                  <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">{new Date(event.date).toLocaleDateString()}</time>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Downloadable Audit Archive</h2>
        <div className="bg-card dark:bg-card border border-border rounded-lg p-6 transition-colors flex items-center justify-between">
          <div className="text-gray-600 dark:text-gray-300">Download a full archive of this engagement&apos;s data (JSON).</div>
          <button
            onClick={handleDownloadArchive}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <Download className="h-4 w-4" /> Download Archive
          </button>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Historical Audit Data</h2>
        <div className="bg-card dark:bg-card border border-border rounded-lg p-6 transition-colors">
          {historicalEngagements.length === 0 ? (
            <div className="text-gray-600 dark:text-gray-300">No completed engagements found.</div>
          ) : (
            <ul className="space-y-2">
              {historicalEngagements.map(e => (
                <li key={e.id} className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-foreground">{e.clientName}</span>
                    <span className="ml-2 text-sm text-muted-foreground">({e.type}, {e.framework})</span>
                  </div>
                  <button
                    onClick={() => {
                      const archive = { engagement: e };
                      const blob = new Blob([JSON.stringify(archive, null, 2)], { type: 'application/json' });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `audit-archive-${e.clientName || e.id}.json`;
                      a.click();
                      window.URL.revokeObjectURL(url);
                    }}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-xs font-medium"
                  >
                    <Download className="h-4 w-4" /> Download
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsHistoryTab; 