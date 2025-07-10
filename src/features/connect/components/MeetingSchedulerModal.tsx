import React from 'react';
import { X } from 'lucide-react';
import { NewMeetingForm } from '../types';
import { MEETING_TYPES } from '../constants';

interface MeetingSchedulerModalProps {
  showScheduler: boolean;
  setShowScheduler: (show: boolean) => void;
  newMeetingForm: NewMeetingForm;
  setNewMeetingForm: (form: NewMeetingForm) => void;
  scheduleMeeting: () => void;
}

export const MeetingSchedulerModal: React.FC<MeetingSchedulerModalProps> = ({
  showScheduler,
  setShowScheduler,
  newMeetingForm,
  setNewMeetingForm,
  scheduleMeeting
}) => {
  if (!showScheduler) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card rounded-lg p-6 w-96 border border-border shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Schedule Meeting</h2>
          <button onClick={() => setShowScheduler(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Meeting title"
            value={newMeetingForm.title}
            onChange={(e) => setNewMeetingForm({...newMeetingForm, title: e.target.value})}
            className="w-full bg-secondary text-foreground px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary border border-border"
          />
          <input
            type="date"
            value={newMeetingForm.date}
            onChange={(e) => setNewMeetingForm({...newMeetingForm, date: e.target.value})}
            className="w-full bg-secondary text-foreground px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary border border-border"
          />
          <input
            type="time"
            value={newMeetingForm.time}
            onChange={(e) => setNewMeetingForm({...newMeetingForm, time: e.target.value})}
            className="w-full bg-secondary text-foreground px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary border border-border"
          />
          <input
            type="text"
            placeholder="Participants (comma separated)"
            value={newMeetingForm.participants}
            onChange={(e) => setNewMeetingForm({...newMeetingForm, participants: e.target.value})}
            className="w-full bg-secondary text-foreground px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary border border-border"
          />
          <select 
            value={newMeetingForm.type}
            onChange={(e) => setNewMeetingForm({...newMeetingForm, type: e.target.value})}
            className="w-full bg-secondary text-foreground px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary border border-border"
          >
            {MEETING_TYPES.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowScheduler(false)}
              className="flex-1 bg-muted hover:bg-secondary px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={scheduleMeeting}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg"
            >
              Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 