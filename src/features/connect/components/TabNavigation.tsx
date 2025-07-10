import React from 'react';
import { MessageCircle, Calendar, Video } from 'lucide-react';
import { TabType } from '../types';

interface TabNavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  messages: any[];
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  setActiveTab,
  messages
}) => {
  const getTabIcon = (tab: TabType) => {
    switch (tab) {
      case 'messages': return <MessageCircle className="w-5 h-5" />;
      case 'meetings': return <Calendar className="w-5 h-5" />;
      case 'calls': return <Video className="w-5 h-5" />;
      default: return <MessageCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-card border-b border-border">
      <div className="flex space-x-6 px-4">
        {(['messages', 'meetings', 'calls'] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 px-4 flex items-center space-x-2 border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {getTabIcon(tab)}
            <span className="capitalize">{tab}</span>
            {tab === 'messages' && (
              <span className="bg-blue-600 text-xs px-2 py-1 rounded-full">
                {messages.reduce((acc, chat) => acc + chat.unread, 0)}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}; 