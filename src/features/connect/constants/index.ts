import { Chat, Meeting, CallLog } from '../types';

export const STORAGE_KEYS = {
  MESSAGES: 'sheetsway_messages',
  MEETINGS: 'sheetsway_meetings',
  CALL_LOGS: 'sheetsway_call_logs'
};

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const MEETING_TYPES = [
  { value: 'zoom', label: 'Zoom Meeting' },
  { value: 'teams', label: 'Teams Meeting' },
  { value: 'meet', label: 'Google Meet' }
];

export const CHAT_TYPES = [
  { value: 'project', label: 'Project-Based' },
  { value: 'global', label: 'Global Chat' },
  { value: 'admin', label: 'Admin Support' }
];

export const FILTER_TYPES = [
  { value: 'all', label: 'All Chats' },
  { value: 'project', label: 'Project-Based' },
  { value: 'global', label: 'Global' },
  { value: 'admin', label: 'Admin Support' }
];

// Initial data
export const INITIAL_MESSAGES: Chat[] = [
  {
    id: 1,
    type: 'project',
    projectName: 'Acme Corp Q2 Audit',
    participants: ['John Doe', 'Sarah Wilson'],
    lastMessage: 'The financial statements are ready for review.',
    timestamp: '2 hours ago',
    unread: 3,
    messages: [
      { id: 1, sender: 'John Doe', content: 'Hi Sarah, can you review the Q2 statements?', timestamp: '10:30 AM', type: 'received' },
      { id: 2, sender: 'You', content: 'Sure, I\'ll take a look this afternoon.', timestamp: '10:45 AM', type: 'sent' },
      { id: 3, sender: 'John Doe', content: 'The financial statements are ready for review.', timestamp: '2:15 PM', type: 'received' }
    ]
  },
  {
    id: 2,
    type: 'global',
    projectName: 'General Discussion',
    participants: ['Team Admin', 'Support'],
    lastMessage: 'Your compliance documents have been updated.',
    timestamp: '1 day ago',
    unread: 1,
    messages: [
      { id: 1, sender: 'Team Admin', content: 'Your compliance documents have been updated.', timestamp: 'Yesterday', type: 'received' }
    ]
  },
  {
    id: 3,
    type: 'admin',
    projectName: 'Admin Support',
    participants: ['Support Team'],
    lastMessage: 'How can we help you today?',
    timestamp: '3 days ago',
    unread: 0,
    messages: [
      { id: 1, sender: 'Support Team', content: 'How can we help you today?', timestamp: '3 days ago', type: 'received' }
    ]
  }
];

export const INITIAL_MEETINGS: Meeting[] = [
  {
    id: 1,
    title: 'Q2 Audit Review',
    date: '2024-07-15',
    time: '10:00 AM',
    participants: ['John Doe', 'Sarah Wilson'],
    type: 'zoom',
    status: 'upcoming',
    zoomLink: 'https://zoom.us/j/123456789'
  },
  {
    id: 2,
    title: 'Tax Filing Discussion',
    date: '2024-07-20',
    time: '2:00 PM',
    participants: ['Beta Ltd Team'],
    type: 'zoom',
    status: 'upcoming',
    zoomLink: 'https://zoom.us/j/987654321'
  }
];

export const INITIAL_CALL_LOGS: CallLog[] = [
  {
    id: 1,
    participant: 'John Doe',
    type: 'incoming',
    duration: '15:30',
    timestamp: '2 hours ago',
    projectName: 'Acme Corp Q2 Audit'
  },
  {
    id: 2,
    participant: 'Support Team',
    type: 'outgoing',
    duration: '8:45',
    timestamp: '1 day ago',
    projectName: 'Admin Support'
  },
  {
    id: 3,
    participant: 'Sarah Wilson',
    type: 'missed',
    duration: '0:00',
    timestamp: '3 days ago',
    projectName: 'Beta Ltd Tax Filing'
  }
];
