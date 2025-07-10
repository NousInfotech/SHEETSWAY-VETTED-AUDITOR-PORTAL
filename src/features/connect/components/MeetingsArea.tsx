import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Meeting } from '../types';
import { MONTH_NAMES, DAYS_OF_WEEK } from '../constants';
import { getDaysInMonth, isToday, hasMeetings, getMeetingsForDate } from '../utils';

interface MeetingsAreaProps {
  meetings: Meeting[];
  currentDate: Date;
  selectedDate: Date;
  navigateMonth: (direction: number) => void;
  navigateYear: (direction: number) => void;
  handleDateClick: (date: Date | null) => void;
  setEditMeeting: (meeting: Meeting | null) => void;
  setEditMeetingId: (id: number | null) => void;
  setEditMeetingForm: (form: any) => void;
}

export const MeetingsArea: React.FC<MeetingsAreaProps> = ({
  meetings,
  currentDate,
  selectedDate,
  navigateMonth,
  navigateYear,
  handleDateClick,
  setEditMeeting,
  setEditMeetingId,
  setEditMeetingForm
}) => {
  const days = getDaysInMonth(currentDate);

  const isSelected = (date: Date | null) => {
    return date && selectedDate &&
           date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };

  return (
    <div className="flex-1 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Calendar View</h2>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Has meetings</span>
              </div>
            </div>
          </div>
          <div className="border border-border rounded-lg shadow-sm bg-card">
            {/* Header with navigation */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigateYear(-1)}
                  className="p-1 hover:bg-muted rounded transition-colors"
                  aria-label="Previous year"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => navigateMonth(-1)}
                  className="p-1 hover:bg-muted rounded transition-colors"
                  aria-label="Previous month"
                >
                  <ChevronLeft size={20} />
                </button>
              </div>
              
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground">
                  {MONTH_NAMES[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h3>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigateMonth(1)}
                  className="p-1 hover:bg-muted rounded transition-colors"
                  aria-label="Next month"
                >
                  <ChevronRight size={20} />
                </button>
                <button
                  onClick={() => navigateYear(1)}
                  className="p-1 hover:bg-muted rounded transition-colors"
                  aria-label="Next year"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Calendar grid */}
            <div className="p-4">
              {/* Days of week header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {DAYS_OF_WEEK.map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-1">
                {days.map((date, index) => (
                  <button
                    key={index}
                    onClick={() => handleDateClick(date)}
                    disabled={!date}
                    className={`
                      h-10 w-10 flex items-center justify-center text-sm rounded-md transition-colors relative
                      ${!date ? 'invisible' : 'hover:bg-muted'}
                      ${isSelected(date) ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}
                      ${isToday(date) && !isSelected(date) ? 'bg-accent text-accent-foreground font-semibold' : ''}
                      ${date && !isSelected(date) && !isToday(date) ? 'text-foreground' : ''}
                      ${hasMeetings(date, meetings) && !isSelected(date) ? 'ring-2 ring-green-500 ring-offset-1' : ''}
                    `}
                  >
                    {date ? date.getDate() : ''}
                    {hasMeetings(date, meetings) && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected date display */}
            {selectedDate && (
              <div className="px-4 pb-4">
                <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                  <span className="font-medium">Selected:</span> {selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                  {hasMeetings(selectedDate, meetings) && (
                    <div className="mt-2">
                      <span className="text-xs font-medium text-green-600">📅 Has meetings</span>
                      <div className="mt-1 space-y-1">
                        {getMeetingsForDate(selectedDate, meetings).map((meeting) => (
                          <div key={meeting.id} className="text-xs bg-background p-2 rounded border">
                            <div className="font-medium">{meeting.title}</div>
                            <div className="text-muted-foreground">{meeting.time}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-4">Upcoming Meetings</h2>
          <div className="space-y-4">
            {meetings.map((meeting) => (
              <div key={meeting.id} className="bg-card rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold">{meeting.title}</h3>
                  <span className="text-xs bg-green-600 px-2 py-1 rounded-full">{meeting.status}</span>
                </div>
                <p className="text-muted-foreground mb-2">{meeting.date} at {meeting.time}</p>
                <p className="text-sm text-muted-foreground mb-3">{meeting.participants.join(', ')}</p>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => meeting.zoomLink && window.open(meeting.zoomLink, '_blank')} 
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-2 rounded text-sm"
                  >
                    Join Meeting
                  </button>
                  <button 
                    className="px-3 py-2 bg-secondary hover:bg-muted rounded text-sm" 
                    onClick={() => { 
                      setEditMeeting(meeting); 
                      setEditMeetingId(meeting.id); 
                      setEditMeetingForm({ 
                        title: meeting.title, 
                        date: meeting.date, 
                        time: meeting.time, 
                        participants: meeting.participants.join(', '), 
                        type: meeting.type 
                      }); 
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 