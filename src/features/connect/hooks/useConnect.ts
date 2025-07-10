import { useState, useEffect, useCallback } from 'react';
import { Chat, Meeting, CallLog, NewMeetingForm, NewChatForm, TabType, FilterType, MessageFilter, FileAttachment } from '../types';
import { STORAGE_KEYS } from '../constants';
import { saveToStorage, loadFromStorage, getInitialData } from '../utils';

export const useConnect = () => {
  const [activeTab, setActiveTab] = useState<TabType>('messages');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Chat[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [showScheduler, setShowScheduler] = useState<boolean>(false);
  const [showNewChatModal, setShowNewChatModal] = useState<boolean>(false);
  const [newChatForm, setNewChatForm] = useState<NewChatForm>({ 
    type: 'project', 
    projectName: '', 
    participants: '' 
  });
  const [newMeetingForm, setNewMeetingForm] = useState<NewMeetingForm>({
    title: '',
    date: '',
    time: '',
    participants: '',
    type: 'zoom'
  });
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [isArchived, setIsArchived] = useState(false);
  const [showChatSettings, setShowChatSettings] = useState(false);
  const [starredMessages, setStarredMessages] = useState<{[chatId:number]: number[]}>({});
  const [pinnedMessages, setPinnedMessages] = useState<{[chatId:number]: number[]}>({});
  const [messageFilter, setMessageFilter] = useState<MessageFilter>('all');
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [editMeeting, setEditMeeting] = useState<Meeting | null>(null);
  const [editMeetingForm, setEditMeetingForm] = useState<NewMeetingForm>({ 
    title: '', 
    date: '', 
    time: '', 
    participants: '', 
    type: 'zoom' 
  });
  const [editMeetingId, setEditMeetingId] = useState<number | null>(null);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState(new Date('2024-01-16'));
  const [currentDate, setCurrentDate] = useState(new Date());

  // Initialize data
  useEffect(() => {
    const { messages: initialMessages, meetings: initialMeetings, callLogs: initialCallLogs } = getInitialData();
    
    if (initialMessages.length > 0) {
      saveToStorage(STORAGE_KEYS.MESSAGES, initialMessages);
      setMessages(initialMessages);
    } else {
      setMessages(loadFromStorage(STORAGE_KEYS.MESSAGES, []));
    }

    if (initialMeetings.length > 0) {
      saveToStorage(STORAGE_KEYS.MEETINGS, initialMeetings);
      setMeetings(initialMeetings);
    } else {
      setMeetings(loadFromStorage(STORAGE_KEYS.MEETINGS, []));
    }

    if (initialCallLogs.length > 0) {
      saveToStorage(STORAGE_KEYS.CALL_LOGS, initialCallLogs);
      setCallLogs(initialCallLogs);
    } else {
      setCallLogs(loadFromStorage(STORAGE_KEYS.CALL_LOGS, []));
    }
  }, []);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files);
  };

  const sendMessage = useCallback(() => {
    if (!newMessage.trim() && !selectedFiles) return;
    if (!selectedChat) return;
    
    const attachments: FileAttachment[] = selectedFiles ? Array.from(selectedFiles).map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      type: file.type,
      url: URL.createObjectURL(file)
    })) : [];
  
    const updatedMessages = messages.map((chat: Chat) => {
      if (chat.id === selectedChat.id) {
        const newMsg = {
          id: Date.now(),
          sender: 'You',
          content: newMessage || (attachments.length > 0 ? `Sent ${attachments.length} file(s)` : ''),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'sent' as const,
          attachments: attachments.length > 0 ? attachments : undefined
        };
        return {
          ...chat,
          messages: [...chat.messages, newMsg],
          lastMessage: newMsg.content,
          timestamp: 'Just now'
        };
      }
      return chat;
    });
    
    setMessages(updatedMessages);
    saveToStorage(STORAGE_KEYS.MESSAGES, updatedMessages);
    setNewMessage('');
    setSelectedFiles(null);
    
    // Update selected chat
    const updatedSelectedChat = updatedMessages.find((chat) => chat.id === selectedChat.id) || null;
    setSelectedChat(updatedSelectedChat);
  }, [newMessage, selectedFiles, selectedChat, messages]);

  const createNewChat = useCallback(() => {
    if (!newChatForm.projectName || !newChatForm.participants) return;
  
    const newChat: Chat = {
      id: Date.now(),
      type: newChatForm.type,
      projectName: newChatForm.projectName,
      participants: newChatForm.participants.split(',').map(p => p.trim()),
      lastMessage: '',
      timestamp: 'Just now',
      unread: 0,
      messages: []
    };
  
    const updatedMessages = [newChat, ...messages];
    setMessages(updatedMessages);
    saveToStorage(STORAGE_KEYS.MESSAGES, updatedMessages);
    setNewChatForm({ type: 'project', projectName: '', participants: '' });
    setShowNewChatModal(false);
  }, [newChatForm, messages]);

  const scheduleMeeting = useCallback(() => {
    if (!newMeetingForm.title || !newMeetingForm.date || !newMeetingForm.time) return;
  
    const newMeeting: Meeting = {
      id: Date.now(),
      title: newMeetingForm.title,
      date: newMeetingForm.date,
      time: newMeetingForm.time,
      participants: newMeetingForm.participants.split(',').map(p => p.trim()),
      type: newMeetingForm.type,
      status: 'upcoming',
      zoomLink: `https://zoom.us/j/${Math.floor(Math.random() * 1000000000)}`
    };
  
    const updatedMeetings = [...meetings, newMeeting];
    setMeetings(updatedMeetings);
    saveToStorage(STORAGE_KEYS.MEETINGS, updatedMeetings);
    setNewMeetingForm({ title: '', date: '', time: '', participants: '', type: 'zoom' });
    setShowScheduler(false);
  }, [newMeetingForm, meetings]);

  const archiveChat = useCallback((chatId: number) => {
    const updatedMessages = messages.map(chat => 
      chat.id === chatId ? { ...chat, archived: true } : chat
    );
    setMessages(updatedMessages);
    saveToStorage(STORAGE_KEYS.MESSAGES, updatedMessages);
    if (selectedChat?.id === chatId) {
      setSelectedChat(null);
    }
  }, [messages, selectedChat]);

  const deleteChat = useCallback((chatId: number) => {
    const updatedMessages = messages.filter(chat => chat.id !== chatId);
    setMessages(updatedMessages);
    saveToStorage(STORAGE_KEYS.MESSAGES, updatedMessages);
    if (selectedChat?.id === chatId) {
      setSelectedChat(null);
    }
  }, [messages, selectedChat]);

  const startCall = useCallback((participant: string, type: 'audio' | 'video' = 'audio') => {
    const newCall: CallLog = {
      id: Date.now(),
      participant,
      type: 'outgoing',
      duration: '0:00',
      timestamp: 'Just now',
      projectName: selectedChat?.projectName
    };
    
    const updatedCallLogs = [newCall, ...callLogs];
    setCallLogs(updatedCallLogs);
    saveToStorage(STORAGE_KEYS.CALL_LOGS, updatedCallLogs);
    
    // Simulate call duration update after 3 seconds
    setTimeout(() => {
      const duration = `${Math.floor(Math.random() * 30 + 5)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`;
      const finalCall = { ...newCall, duration };
      const finalCallLogs = updatedCallLogs.map(call => 
        call.id === newCall.id ? finalCall : call
      );
      setCallLogs(finalCallLogs);
      saveToStorage(STORAGE_KEYS.CALL_LOGS, finalCallLogs);
    }, 3000);
  }, [callLogs, selectedChat]);

  // Filter messages based on search
  const filteredMessages = messages.filter((chat: Chat) => {
    const matchesSearch = chat.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.participants.some((p: string) => p.toLowerCase().includes(searchQuery.toLowerCase())) ||
      chat.messages.some((msg) => msg.content.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = filterType === 'all' || chat.type === filterType;
    const matchesArchived = isArchived ? chat.archived : !chat.archived;
    
    return matchesSearch && matchesFilter && matchesArchived;
  });

  // Mark messages as read
  const markAsRead = useCallback((chatId: number) => {
    const updatedMessages = messages.map(chat => 
      chat.id === chatId ? { ...chat, unread: 0 } : chat
    );
    setMessages(updatedMessages);
    saveToStorage(STORAGE_KEYS.MESSAGES, updatedMessages);
  }, [messages]);

  // Star/Unstar message
  const toggleStarMessage = (chatId: number, messageId: number) => {
    setStarredMessages(prev => {
      const starred = prev[chatId] || [];
      return {
        ...prev,
        [chatId]: starred.includes(messageId)
          ? starred.filter(id => id !== messageId)
          : [...starred, messageId]
      };
    });
  };

  // Pin/Unpin message
  const togglePinMessage = (chatId: number, messageId: number) => {
    setPinnedMessages(prev => {
      const pinned = prev[chatId] || [];
      return {
        ...prev,
        [chatId]: pinned.includes(messageId)
          ? pinned.filter(id => id !== messageId)
          : [...pinned, messageId]
      };
    });
  };

  // Clear chat
  const clearChat = (chatId: number) => {
    const updatedMessages = messages.map(chat =>
      chat.id === chatId ? { ...chat, messages: [], lastMessage: '', unread: 0 } : chat
    );
    setMessages(updatedMessages);
    saveToStorage(STORAGE_KEYS.MESSAGES, updatedMessages);
    setSelectedChat(updatedMessages.find(c => c.id === chatId) || null);
  };

  // Calendar navigation
  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const navigateYear = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(currentDate.getFullYear() + direction);
    setCurrentDate(newDate);
  };

  const handleDateClick = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  // Update meeting
  const updateMeeting = useCallback(() => {
    if (editMeetingId !== null) {
      const updatedMeetings = meetings.map(m => 
        m.id === editMeetingId 
          ? { 
              ...m, 
              ...editMeetingForm, 
              participants: editMeetingForm.participants.split(',').map(p => p.trim()) 
            } 
          : m
      );
      setMeetings(updatedMeetings);
      saveToStorage(STORAGE_KEYS.MEETINGS, updatedMeetings);
      setEditMeeting(null);
    }
  }, [editMeetingId, editMeetingForm, meetings]);

  return {
    // State
    activeTab,
    selectedChat,
    messages,
    newMessage,
    searchQuery,
    meetings,
    showScheduler,
    showNewChatModal,
    newChatForm,
    newMeetingForm,
    selectedFiles,
    callLogs,
    filterType,
    isArchived,
    showChatSettings,
    starredMessages,
    pinnedMessages,
    messageFilter,
    showCalendarModal,
    showFilterModal,
    editMeeting,
    editMeetingForm,
    editMeetingId,
    selectedCalendarDate,
    selectedDate,
    currentDate,
    filteredMessages,

    // Setters
    setActiveTab,
    setSelectedChat,
    setNewMessage,
    setSearchQuery,
    setShowScheduler,
    setShowNewChatModal,
    setNewChatForm,
    setNewMeetingForm,
    setSelectedFiles,
    setFilterType,
    setIsArchived,
    setShowChatSettings,
    setMessageFilter,
    setShowCalendarModal,
    setShowFilterModal,
    setEditMeeting,
    setEditMeetingForm,
    setEditMeetingId,
    setSelectedCalendarDate,
    setSelectedDate,
    setCurrentDate,
    setStarredMessages,
    setPinnedMessages,

    // Actions
    handleFileSelect,
    sendMessage,
    createNewChat,
    scheduleMeeting,
    archiveChat,
    deleteChat,
    startCall,
    markAsRead,
    toggleStarMessage,
    togglePinMessage,
    clearChat,
    navigateMonth,
    navigateYear,
    handleDateClick,
    updateMeeting
  };
}; 