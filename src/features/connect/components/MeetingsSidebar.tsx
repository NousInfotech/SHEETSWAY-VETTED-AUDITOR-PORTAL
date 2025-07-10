import React from 'react';
import { Meeting } from '../types';

interface MeetingsSidebarProps {
  meetings: Meeting[];
}

export const MeetingsSidebar: React.FC<MeetingsSidebarProps> = ({ meetings }) => {
  return (
    <div className="w-80 bg-card border-r border-border overflow-y-auto max-h-full">
      <div className="p-4">
        <div className="space-y-3">
          {meetings.map((meeting) => (
            <div key={meeting.id} className="p-3 bg-secondary rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{meeting.title}</h3>
                <span className="text-xs bg-green-600 px-2 py-1 rounded-full">
                  {meeting.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{meeting.date} at {meeting.time}</p>
              <p className="text-sm text-muted-foreground">{meeting.participants.join(', ')}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 