'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import { sidebarItems } from './constants';
import { useProfileState } from './hooks/useProfileState';
import AuditFirmDetails from './components/AuditFirmDetails';
import TeamMembers from './components/TeamMembers';
import LicensesCertifications from './components/LicensesCertifications';
import ComplianceTracker from './components/ComplianceTracker';
import ExpiryReminders from './components/ExpiryReminders';
import Sidebar from './components/Sidebar';
import AlertModal from './components/AlertModal';
import RenewModal from './components/RenewModal';
import ReminderModal from './components/ReminderModal';

const ProfileCompliancePage = () => {
  const { resolvedTheme } = useTheme();
  const state = useProfileState();
  React.useEffect(() => {
    state.setIsDark(resolvedTheme === 'dark');
  }, [resolvedTheme]);

  const renderContent = () => {
    switch (state.activeSection) {
      case 'details':
        return <AuditFirmDetails {...state} />;
      case 'team':
        return <TeamMembers {...state} />;
      case 'licenses':
        return <LicensesCertifications {...state} />;
      case 'compliance':
        return <ComplianceTracker {...state} />;
      case 'reminders':
        return <ExpiryReminders {...state} renderReminderModal={() => <ReminderModal {...state} />} />;
      default:
        return <AuditFirmDetails {...state} />;
    }
  };

  return (
    <div className={`min-h-screen ${state.isDark ? 'bg-black' : 'bg-white'} transition-colors duration-200 min-h-[calc(100vh-100px)]`}>
      {/* Header */}
      <div className={`${state.isDark ? 'bg-card' : 'bg-white'} shadow-sm ${state.isDark ? 'border-gray-800' : 'border-gray-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className={`text-xl font-semibold ${state.isDark ? 'text-white' : 'text-gray-900'}`}>Profile & Compliance Settings</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-140px)]">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <Sidebar sidebarItems={sidebarItems} activeSection={state.activeSection} setActiveSection={state.setActiveSection} isDark={state.isDark} />
          </div>
          {/* Main Content */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            {renderContent()}
          </div>
        </div>
      </div>
      <AlertModal {...state} />
      <RenewModal {...state} />
      <ReminderModal {...state} />
      {/* Toast notifications handled globally by <Toaster /> in app layout */}
    </div>
  );
};

export default ProfileCompliancePage; 