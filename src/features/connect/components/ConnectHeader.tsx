import React from 'react';
import { Search, Plus, Filter as FilterIcon, Archive } from 'lucide-react';
import { FilterType } from '../types';

interface ConnectHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterType: FilterType;
  setFilterType: (type: FilterType) => void;
  isArchived: boolean;
  setIsArchived: (archived: boolean) => void;
  setShowNewChatModal: (show: boolean) => void;
  setShowFilterModal: (show: boolean) => void;
  messages: any[];
}

export const ConnectHeader: React.FC<ConnectHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  isArchived,
  setIsArchived,
  setShowNewChatModal,
  setShowFilterModal,
  messages
}) => {
  return (
    <div className="bg-card border-b border-border p-4 rounded-t-lg">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Messaging & Meetings</h1>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowFilterModal(true)} 
            className="p-2 bg-secondary rounded-lg hover:bg-muted"
          >
            <FilterIcon className="w-4 h-4" />
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-background text-foreground pl-10 pr-4 py-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-primary border border-border"
            />
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as FilterType)}
              className="bg-background text-foreground px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary border border-border"
            >
              <option value="all">All Chats</option>
              <option value="project">Project-Based</option>
              <option value="global">Global</option>
              <option value="admin">Admin Support</option>
            </select>
            <button
              onClick={() => setIsArchived(!isArchived)}
              className={`p-2 rounded-lg ${isArchived ? 'bg-blue-600 text-white' : 'bg-secondary text-foreground'}`}
            >
              <Archive className="w-4 h-4" />
            </button>
          </div>
          <button 
            onClick={() => setShowNewChatModal(true)}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>
        </div>
      </div>
    </div>
  );
}; 