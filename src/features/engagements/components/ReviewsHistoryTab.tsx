import React, { useState, useEffect } from 'react';
import { Review } from '../types/engagement-types';
import { Star, CheckCircle, Download, Edit2 } from 'lucide-react';

interface ReviewsHistoryTabProps {
  reviews: Review[];
  engagementId: string;
}

const ReviewsHistoryTab: React.FC<ReviewsHistoryTabProps> = ({ reviews, engagementId }) => {
  // Mock milestones for demonstration
  const [milestones, setMilestones] = useState([
    { id: 1, title: 'Kickoff Meeting', completed: false, note: '' },
    { id: 2, title: 'Document Collection', completed: false, note: '' },
    { id: 3, title: 'Fieldwork', completed: false, note: '' },
    { id: 4, title: 'Draft Report', completed: false, note: '' },
    { id: 5, title: 'Final Report', completed: false, note: '' },
  ]);

  const handleToggleComplete = (id: number) => {
    setMilestones(prev => prev.map(m => m.id === id ? { ...m, completed: !m.completed } : m));
  };
  const handleNoteChange = (id: number, value: string) => {
    setMilestones(prev => prev.map(m => m.id === id ? { ...m, note: value } : m));
  };

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
        <h2 className="text-xl font-semibold text-foreground mb-4">Milestones</h2>
        <div className="bg-card dark:bg-card border border-border rounded-lg p-6 transition-colors">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left px-4 py-2">Milestone</th>
                <th className="text-center px-4 py-2">Completed</th>
                <th className="text-left px-4 py-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              {milestones.map(milestone => (
                <tr key={milestone.id}>
                  <td className="px-4 py-2">{milestone.title}</td>
                  <td className="text-center px-4 py-2">
                    <input
                      type="checkbox"
                      checked={milestone.completed}
                      onChange={() => handleToggleComplete(milestone.id)}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={milestone.note}
                        onChange={e => handleNoteChange(milestone.id, e.target.value)}
                        className="w-full px-2 py-1 border border-border rounded-lg bg-background text-foreground"
                        placeholder="Add note..."
                      />
                      <Edit2 className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
      {/* Removed Historical Audit Data (History) section as per requirements */}
    </div>
  );
};

export default ReviewsHistoryTab; 