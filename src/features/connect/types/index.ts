export interface FileAttachment {
  id: number;
  name: string;
  size: string;
  type: string;
  url: string;
}

export interface ChatMessage {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
  type: 'sent' | 'received';
  attachments?: FileAttachment[];
}

export interface Chat {
  id: number;
  type: 'project' | 'global' | 'admin';
  projectName: string;
  participants: string[];
  lastMessage: string;
  timestamp: string;
  unread: number;
  messages: ChatMessage[];
  archived?: boolean;
}

export interface Meeting {
  id: number;
  title: string;
  date: string;
  time: string;
  participants: string[];
  type: string;
  status: string;
  zoomLink?: string;
}

export interface NewMeetingForm {
  title: string;
  date: string;
  time: string;
  participants: string;
  type: string;
}

export interface CallLog {
  id: number;
  participant: string;
  type: 'incoming' | 'outgoing' | 'missed';
  duration: string;
  timestamp: string;
  projectName?: string;
}

export interface NewChatForm {
  type: 'project' | 'global' | 'admin';
  projectName: string;
  participants: string;
}

export type TabType = 'messages' | 'meetings' | 'calls';
export type FilterType = 'all' | 'project' | 'global' | 'admin';
export type MessageFilter = 'all' | 'pinned' | 'starred';
