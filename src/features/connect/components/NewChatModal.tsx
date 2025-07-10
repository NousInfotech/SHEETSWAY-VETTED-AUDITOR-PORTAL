import React from 'react';
import { X } from 'lucide-react';
import { NewChatForm } from '../types';
import { CHAT_TYPES } from '../constants';

interface NewChatModalProps {
  showNewChatModal: boolean;
  setShowNewChatModal: (show: boolean) => void;
  newChatForm: NewChatForm;
  setNewChatForm: (form: NewChatForm) => void;
  createNewChat: () => void;
}

export const NewChatModal: React.FC<NewChatModalProps> = ({
  showNewChatModal,
  setShowNewChatModal,
  newChatForm,
  setNewChatForm,
  createNewChat
}) => {
  if (!showNewChatModal) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card rounded-lg p-6 w-96 border border-border shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">New Chat</h2>
          <button onClick={() => setShowNewChatModal(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Chat Type</label>
            <select 
              value={newChatForm.type}
              onChange={(e) => setNewChatForm({...newChatForm, type: e.target.value as any})}
              className="w-full bg-secondary text-foreground px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary border border-border"
            >
              {CHAT_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          <input
            type="text"
            placeholder="Project/Chat name"
            value={newChatForm.projectName}
            onChange={(e) => setNewChatForm({...newChatForm, projectName: e.target.value})}
            className="w-full bg-secondary text-foreground px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary border border-border"
          />
          <input
            type="text"
            placeholder="Participants (comma separated)"
            value={newChatForm.participants}
            onChange={(e) => setNewChatForm({...newChatForm, participants: e.target.value})}
            className="w-full bg-secondary text-foreground px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary border border-border"
          />
          <div className="flex space-x-3">
            <button
              onClick={() => setShowNewChatModal(false)}
              className="flex-1 bg-muted hover:bg-secondary px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={createNewChat}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg"
            >
              Create Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 