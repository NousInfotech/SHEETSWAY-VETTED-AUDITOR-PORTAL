import React, { useEffect } from 'react';
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
  const my_profile = JSON.parse(localStorage.getItem('userProfile')!);
  useEffect(() => {
    if (my_profile.role === 'JUNIOR') {
      setActiveTab('meetings');
    }
  }, []);

  const getTabIcon = (tab: TabType) => {
    switch (tab) {
      case 'messages':
        return <MessageCircle className='h-5 w-5' />;
      case 'meetings':
        return <Calendar className='h-5 w-5' />;
      case 'calls':
        return <Video className='h-5 w-5' />;
      default:
        return <MessageCircle className='h-5 w-5' />;
    }
  };

  return (
    <div className='bg-card border-border border-b'>
      <div className='flex space-x-6 px-4'>
        {(['messages', 'meetings', 'calls'] as TabType[]).map((tab) => (
          <button
            key={tab}
            disabled={
              tab === 'messages' && ['JUNIOR'].includes(my_profile.role)
            }
            onClick={() => setActiveTab(tab)}
            className={`flex items-center space-x-2 border-b-2 px-4 py-3 transition-colors disabled:hidden disabled:cursor-not-allowed ${
              activeTab === tab
                ? 'border-blue-500 text-blue-400'
                : 'text-muted-foreground hover:text-foreground border-transparent'
            }`}
          >
            {getTabIcon(tab)}
            <span className='capitalize'>{tab}</span>
            {tab === 'messages' && (
              <span className='rounded-full bg-blue-600 px-2 py-1 text-xs'>
                {messages.reduce((acc, chat) => acc + chat.unread, 0)}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
