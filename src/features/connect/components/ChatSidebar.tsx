import React from 'react';
import { Archive, X } from 'lucide-react';
import { Chat } from '../types';

interface ChatSidebarProps {
  filteredMessages: Chat[];
  selectedChat: Chat | null;
  setSelectedChat: (chat: Chat | null) => void;
  markAsRead: (chatId: number) => void;
  archiveChat: (chatId: number) => void;
  deleteChat: (chatId: number) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  filteredMessages,
  selectedChat,
  setSelectedChat,
  markAsRead,
  archiveChat,
  deleteChat
}) => {
  return (
    <div className="w-80 bg-card border-r border-border overflow-y-auto max-h-full">
      <div className="p-4">
        <div className="space-y-2">
          {filteredMessages.map((chat) => (
            <div
              key={chat.id}
              className={`group p-3 rounded-lg cursor-pointer transition-colors ${
                selectedChat?.id === chat.id ? 'bg-secondary' : 'hover:bg-secondary'
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  onClick={() => {
                    setSelectedChat(chat);
                    markAsRead(chat.id);
                  }}
                  className="flex items-center space-x-3 flex-1"
                >
                  <div className={`w-3 h-3 rounded-full ${
                    chat.type === 'project' ? 'bg-blue-500' : 
                    chat.type === 'admin' ? 'bg-green-500' : 'bg-gray-500'
                  }`} />
                  <div>
                    <h3 className="font-medium truncate">{chat.projectName}</h3>
                    <p className="text-sm text-muted-foreground truncate">{chat.participants.join(', ')}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{chat.timestamp}</p>
                    {chat.unread > 0 && (
                      <span className="bg-blue-600 text-xs px-2 py-1 rounded-full mt-1 inline-block">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 flex space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        archiveChat(chat.id);
                      }}
                      className="p-1 hover:bg-muted rounded"
                    >
                      <Archive className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChat(chat.id);
                      }}
                      className="p-1 hover:bg-muted rounded text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-1 truncate">{chat.lastMessage}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 