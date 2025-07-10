import React from 'react';
import { Phone, Video, Settings, Paperclip, Send, Image, Download } from 'lucide-react';
import { Chat, MessageFilter } from '../types';
import { getFileIcon } from '../utils';

interface ChatAreaProps {
  selectedChat: Chat | null;
  messageFilter: MessageFilter;
  setMessageFilter: (filter: MessageFilter) => void;
  starredMessages: {[chatId:number]: number[]};
  pinnedMessages: {[chatId:number]: number[]};
  toggleStarMessage: (chatId: number, messageId: number) => void;
  togglePinMessage: (chatId: number, messageId: number) => void;
  startCall: (participant: string, type: 'audio' | 'video') => void;
  setShowChatSettings: (show: boolean) => void;
  newMessage: string;
  setNewMessage: (message: string) => void;
  selectedFiles: FileList | null;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  sendMessage: () => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  selectedChat,
  messageFilter,
  setMessageFilter,
  starredMessages,
  pinnedMessages,
  toggleStarMessage,
  togglePinMessage,
  startCall,
  setShowChatSettings,
  newMessage,
  setNewMessage,
  selectedFiles,
  handleFileSelect,
  sendMessage
}) => {
  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Select a conversation to start messaging</p>
        </div>
      </div>
    );
  }

  const getFileIconComponent = (type: string) => {
    if (type.includes('image')) return <Image className="w-4 h-4" />;
    return <div className="w-4 h-4" />;
  };

  return (
    <>
      {/* Chat Header */}
      <div className="bg-card border-b border-border p-4 flex items-center justify-between">
        <div>
          <h2 className="font-bold">{selectedChat.projectName}</h2>
          <p className="text-sm text-muted-foreground">{selectedChat.participants.join(', ')}</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => startCall(selectedChat.participants[0], 'audio')}
            className="p-2 bg-secondary rounded-lg hover:bg-muted"
          >
            <Phone className="w-4 h-4" />
          </button>
          <button 
            onClick={() => startCall(selectedChat.participants[0], 'video')}
            className="p-2 bg-secondary rounded-lg hover:bg-muted"
          >
            <Video className="w-4 h-4" />
          </button>
          <button 
            className="p-2 bg-secondary rounded-lg hover:bg-muted" 
            onClick={() => setShowChatSettings(true)}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Message Filters */}
      <div className="flex space-x-2 px-4 pt-2">
        <button 
          onClick={() => setMessageFilter('all')} 
          className={`px-3 py-1 rounded ${messageFilter==='all' ? 'bg-blue-600 text-white' : 'bg-secondary'}`}
        >
          All
        </button>
        <button 
          onClick={() => setMessageFilter('pinned')} 
          className={`px-3 py-1 rounded ${messageFilter==='pinned' ? 'bg-blue-600 text-white' : 'bg-secondary'}`}
        >
          Pinned
        </button>
        <button 
          onClick={() => setMessageFilter('starred')} 
          className={`px-3 py-1 rounded ${messageFilter==='starred' ? 'bg-blue-600 text-white' : 'bg-secondary'}`}
        >
          Starred
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {(selectedChat.messages.filter(message => {
          if (messageFilter === 'all') return true;
          if (messageFilter === 'pinned') return (pinnedMessages[selectedChat.id]||[]).includes(message.id);
          if (messageFilter === 'starred') return (starredMessages[selectedChat.id]||[]).includes(message.id);
          return true;
        })).map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg relative group ${
              message.type === 'sent' 
                ? 'bg-blue-600 text-white' 
                : 'bg-secondary text-foreground'
            }`}>
              {message.type === 'received' && (
                <p className="text-xs text-muted-foreground mb-1">{message.sender}</p>
              )}
              <p>{message.content}</p>
              {message.attachments && (
                <div className="mt-2 space-y-1">
                  {message.attachments.map((file) => (
                    <div key={file.id} className="flex items-center space-x-2 bg-muted rounded p-2">
                      {getFileIconComponent(file.type)}
                      <span className="text-xs flex-1 truncate">{file.name}</span>
                      <span className="text-xs text-muted-foreground">{file.size}</span>
                      <button className="text-xs hover:text-blue-300">
                        <Download className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs mt-1 opacity-70">{message.timestamp}</p>
              <div className="absolute top-1 right-1 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => toggleStarMessage(selectedChat.id, message.id)} 
                  className={starredMessages[selectedChat.id]?.includes(message.id) ? 'text-yellow-400' : 'text-muted-foreground'} 
                  title="Star"
                >
                  ★
                </button>
                <button 
                  onClick={() => togglePinMessage(selectedChat.id, message.id)} 
                  className={pinnedMessages[selectedChat.id]?.includes(message.id) ? 'text-blue-400' : 'text-muted-foreground'} 
                  title="Pin"
                >
                  📌
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="bg-card border-t border-border p-4">
        {selectedFiles && (
          <div className="mb-2 p-2 bg-secondary rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Selected files:</p>
            {Array.from(selectedFiles).map((file, index) => (
              <div key={index} className="flex items-center space-x-2">
                {getFileIconComponent(file.type)}
                <span className="text-xs">{file.name}</span>
                <span className="text-xs text-muted-foreground">({(file.size / 1024).toFixed(1)} KB)</span>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center space-x-2">
          <input
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="file-input"
          />
          <label htmlFor="file-input" className="p-2 bg-secondary rounded-lg hover:bg-muted cursor-pointer">
            <Paperclip className="w-4 h-4" />
          </label>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-secondary text-foreground px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="p-2 bg-primary rounded-lg hover:bg-primary/90 text-primary-foreground"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}; 