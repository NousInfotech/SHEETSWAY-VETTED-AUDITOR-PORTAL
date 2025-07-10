import { STORAGE_KEYS, INITIAL_MESSAGES, INITIAL_MEETINGS, INITIAL_CALL_LOGS } from '../constants';
import { Chat, Meeting, CallLog } from '../types';

export const saveToStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const loadFromStorage = (key: string, defaultValue: any = []) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
};

export const getInitialData = () => {
  const storedMessages = loadFromStorage(STORAGE_KEYS.MESSAGES);
  const storedMeetings = loadFromStorage(STORAGE_KEYS.MEETINGS);
  const storedCallLogs = loadFromStorage(STORAGE_KEYS.CALL_LOGS);

  return {
    messages: storedMessages.length === 0 ? INITIAL_MESSAGES : storedMessages,
    meetings: storedMeetings.length === 0 ? INITIAL_MEETINGS : storedMeetings,
    callLogs: storedCallLogs.length === 0 ? INITIAL_CALL_LOGS : storedCallLogs
  };
};

export const getFileIcon = (type: string) => {
  if (type.includes('image')) return 'image';
  return 'file';
};

export const formatFileSize = (bytes: number) => {
  return `${(bytes / 1024).toFixed(1)} KB`;
};

export const getTabIcon = (tab: 'messages' | 'meetings' | 'calls') => {
  switch (tab) {
    case 'messages': return 'message-circle';
    case 'meetings': return 'calendar';
    case 'calls': return 'video';
    default: return 'message-circle';
  }
};

export const getDaysInMonth = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const days = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  
  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }
  
  return days;
};

export const isToday = (date: Date | null) => {
  const today = new Date();
  return date && 
         date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
};

export const hasMeetings = (date: Date | null, meetings: Meeting[]) => {
  if (!date) return false;
  const dateString = date.toISOString().split('T')[0];
  return meetings.some(meeting => meeting.date === dateString);
};

export const getMeetingsForDate = (date: Date | null, meetings: Meeting[]) => {
  if (!date) return [];
  const dateString = date.toISOString().split('T')[0];
  return meetings.filter(meeting => meeting.date === dateString);
};
