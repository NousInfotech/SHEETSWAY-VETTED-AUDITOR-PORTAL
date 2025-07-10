import React, { useState } from 'react';
import { Engagement, Filters } from '../types/engagement-types';
import { statusConfig, priorityConfig } from '../constants/config';
import { Search, Grid, List, FileText, Building, Tag, Play, ArrowRight, Calendar, Clock, AlertCircle, User } from 'lucide-react';
import { Icons } from '@/components/icons';

interface ActiveEngagementsProps {
  engagements: Engagement[];
  onEnterWorkspace: (engagement: Engagement) => void;
  onRefresh?: () => void;
}

const ActiveEngagements: React.FC<ActiveEngagementsProps> = ({ engagements, onEnterWorkspace, onRefresh }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<Filters>({
    search: '',
    status: '',
    type: '',
    framework: ''
  });
  const [sortOption, setSortOption] = useState<'clientName' | 'status' | 'startDate' | 'deadline' | 'progress'>('clientName');

  const sortEngagements = (list: Engagement[]) => {
    switch (sortOption) {
      case 'clientName':
        return [...list].sort((a, b) => a.clientName.localeCompare(b.clientName));
      case 'status':
        return [...list].sort((a, b) => a.status.localeCompare(b.status));
      case 'startDate':
        return [...list].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
      case 'deadline':
        return [...list].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
      case 'progress':
        return [...list].sort((a, b) => b.progress - a.progress);
      default:
        return list;
    }
  };

  const filteredEngagements = sortEngagements(engagements.filter((engagement) => {
    const matchesSearch = engagement.clientName.toLowerCase().includes(filters.search.toLowerCase()) ||
                         engagement.description.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus = !filters.status || engagement.status === filters.status;
    const matchesType = !filters.type || engagement.type === filters.type;
    const matchesFramework = !filters.framework || engagement.framework === filters.framework;
    return matchesSearch && matchesStatus && matchesType && matchesFramework;
  }));

  const Header = () => (
    <header className="bg-card dark:bg-card border-b border-border px-6 py-4 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {typeof onRefresh === 'function' && (
            <button
              onClick={onRefresh}
              className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground"
              title="Refresh engagements"
              aria-label="Refresh engagements"
            >
              <Icons.refresh className="h-5 w-5" />
            </button>
          )}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Active Engagements</h1>
            <p className="text-muted-foreground mt-1">Manage and track your ongoing projects</p>
          </div>
        </div>
      </div>
    </header>
  );

  const FilterBar = () => {
    const totalEngagements = engagements.length;
    const activeEngagements = engagements.filter(e => e.status === 'In Progress').length;
    const pendingReview = engagements.filter(e => e.status === 'Under Review').length;
    return (
      <div className="bg-card dark:bg-card border-b border-border px-6 py-4 transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search engagements..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground placeholder-muted-foreground"
              />
            </div>
            <select
              value={sortOption}
              onChange={e => setSortOption(e.target.value as typeof sortOption)}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500"
            >
              <option value="clientName">Sort: Client Name</option>
              <option value="status">Sort: Status</option>
              <option value="startDate">Sort: Start Date</option>
              <option value="deadline">Sort: Deadline</option>
              <option value="progress">Sort: Progress</option>
            </select>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as Filters['status'] }))}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="Under Review">Under Review</option>
            </select>
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as Filters['type'] }))}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="Audit">Audit</option>
              <option value="Tax">Tax</option>
            </select>
            <select
              value={filters.framework}
              onChange={(e) => setFilters(prev => ({ ...prev, framework: e.target.value as Filters['framework'] }))}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Frameworks</option>
              <option value="IFRS">IFRS</option>
              <option value="GAPSME">GAPSME</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <span>Total: {totalEngagements}</span>
              <span>Active: {activeEngagements}</span>
              <span>Review: {pendingReview}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const EngagementCard = ({ engagement }: { engagement: Engagement }) => {
    const StatusIcon = statusConfig[engagement.status].icon;
    const isOverdue = new Date(engagement.deadline) < new Date();
    return (
      <div className="bg-card dark:bg-card border border-border rounded-lg hover:shadow-lg transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-600">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-1">
                {engagement.clientName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                {engagement.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Building className="h-4 w-4" />
                  <span>{engagement.type}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  <span>{engagement.framework}</span>
                </div>
              </div>
            </div>
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${priorityConfig[engagement.priority].textColor} bg-opacity-10`}>
              <span className={`w-2 h-2 rounded-full ${priorityConfig[engagement.priority].color}`}></span>
              {engagement.priority}
            </div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusConfig[engagement.status].textColor} bg-opacity-10`}>
              <StatusIcon className="h-4 w-4" />
              {engagement.status}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {engagement.progress}% Complete
            </div>
          </div>
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
              <span>Progress</span>
              <span>{engagement.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${engagement.progress}%` }}
              ></div>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Start: {new Date(engagement.startDate).toLocaleDateString()}</span>
            </div>
            <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 dark:text-red-400' : ''}`}>
              <Clock className="h-4 w-4" />
              <span>Due: {new Date(engagement.deadline).toLocaleDateString()}</span>
              {isOverdue && <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {engagement.teamMembers.length} member{engagement.teamMembers.length !== 1 ? 's' : ''}
              </span>
            </div>
            <button
              onClick={() => onEnterWorkspace(engagement)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <Play className="h-4 w-4" />
              Enter Workspace
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const EngagementListItem = ({ engagement }: { engagement: Engagement }) => {
    const StatusIcon = statusConfig[engagement.status].icon;
    const isOverdue = new Date(engagement.deadline) < new Date();
    return (
      <div className="bg-card dark:bg-card border border-border rounded-lg hover:shadow-lg transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-600">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground">
                    {engagement.clientName}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                    {engagement.description}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Building className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">{engagement.type}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Tag className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">{engagement.framework}</span>
                  </div>
                </div>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusConfig[engagement.status].textColor} bg-opacity-10`}>
                  <StatusIcon className="h-4 w-4" />
                  {engagement.status}
                </div>
                <div className="w-32">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                    <span>Progress</span>
                    <span>{engagement.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${engagement.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className={`text-sm ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-300'}`}>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{new Date(engagement.deadline).toLocaleDateString()}</span>
                    {isOverdue && <AlertCircle className="h-4 w-4" />}
                  </div>
                </div>
                <button
                  onClick={() => onEnterWorkspace(engagement)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <Play className="h-4 w-4" />
                  Enter Workspace
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-6 mb-4">
        <FileText className="h-12 w-12 text-gray-500 dark:text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        No Active Engagements
      </h3>
      <p className="text-gray-600 dark:text-gray-300 max-w-md">
        You don&apos;t have any active engagements matching your current filters. Try adjusting your search criteria or create a new engagement.
      </p>
    </div>
  );

  return (
    <div className="bg-background dark:bg-background min-h-screen w-full transition-colors">
      <Header />
      <FilterBar />
      <main className="p-6 overflow-y-scroll max-h-[calc(100vh-280px)]">
        {filteredEngagements.length === 0 ? (
          <EmptyState />
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
              : 'space-y-4'
          }>
            {filteredEngagements.map((engagement) => (
              viewMode === 'grid' ? (
                <EngagementCard key={engagement.id} engagement={engagement} />
              ) : (
                <EngagementListItem key={engagement.id} engagement={engagement} />
              )
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ActiveEngagements; 