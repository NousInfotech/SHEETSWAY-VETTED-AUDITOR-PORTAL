import React from 'react';
import { Engagement } from '../types/engagement-types';
import { statusConfig } from '../constants/config';
import {
  ArrowLeft,
  Database,
  Banknote,
  FileText,
  History,
  Settings,
  MessageCircle,
  Star
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface EngagementWorkspaceProps {
  engagement: Engagement;
  currentTab: string;
  onTabChange: (tab: string) => void;
  onBack: () => void;
  children: React.ReactNode;
}

const EngagementWorkspace: React.FC<EngagementWorkspaceProps> = ({
  engagement,
  currentTab,
  onTabChange,
  onBack,
  children
}) => {
  const StatusIcon = statusConfig[engagement.status].icon;
  const router = useRouter();

  const Header = () => (
    <header className='bg-card dark:bg-card border-border rounded-t-xl border-b px-6 py-4 transition-colors'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <button
            onClick={onBack}
            className='bg-primary/10 dark:bg-primary/20 hover:bg-primary/20 dark:hover:bg-primary/30 rounded-lg p-2 transition-colors'
            aria-label='Back to engagements'
          >
            <ArrowLeft className='text-foreground h-6 w-6' />
          </button>
          <div>
            <h1 className='text-foreground text-3xl font-bold'>
              {engagement.clientName}
            </h1>
            <div className='mt-1 flex items-center gap-2'>
              <div
                className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${statusConfig[engagement.status].textColor} bg-opacity-10`}
              >
                <StatusIcon className='h-4 w-4' />
                {engagement.status}
              </div>
              <span className='text-muted-foreground text-sm'>
                {engagement.type} • {engagement.framework}
              </span>
            </div>
          </div>
        </div>
        {/* Messages Icon Button */}
        <button
          onClick={() =>
            router.push(`/dashboard/connect?engagementId=${engagement.id}`)
          }
          className='bg-muted hover:bg-muted/70 ml-4 rounded-lg p-2 transition-colors'
          aria-label='Open Messages'
        >
          <MessageCircle className='text-foreground h-6 w-6' />
        </button>
      </div>
    </header>
  );

  const TabNavigation = () => {
    const tabs = [
      { id: 'accounting', label: 'Audit Access', icon: Database },
      { id: 'banking', label: 'Banking Data', icon: Banknote },
      { id: 'payments', label: 'Payments & Escrow', icon: FileText },
      { id: 'reviews', label: 'Milestones', icon: History },
      { id: 'documents', label: 'Documents', icon: FileText },
      { id: 'client documents', label: 'Client Documents', icon: FileText },
      { id: 'settings', label: 'Settings', icon: Settings }
    ];
    return (
      <nav className='bg-card dark:bg-card border-border border-b px-6 transition-colors'>
        <div className='flex space-x-8'>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 border-b-2 px-3 py-4 text-sm font-medium transition-colors ${
                  currentTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                <Icon className='h-4 w-4' />
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>
    );
  };

  return (
    <div className='grid grid-cols-1 overflow-x-auto'>
      <div className='bg-background dark:bg-background min-h-screen min-w-[1280px] transition-colors lg:min-w-full'>
        <Header />
        <TabNavigation />
        <main className='max-h-[calc(100vh-200px)] overflow-y-scroll p-6'>
          {children}
        </main>
      </div>
    </div>
  );
};

export default EngagementWorkspace;
