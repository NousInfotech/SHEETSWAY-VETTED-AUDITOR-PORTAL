import React from 'react';
import { CallLog } from '../types';

interface CallsSidebarProps {
  callLogs: CallLog[];
}

export const CallsSidebar: React.FC<CallsSidebarProps> = ({ callLogs }) => {
  return (
    <div className="w-80 bg-card border-r border-border overflow-y-auto max-h-full">
      <div className="p-4">
        <div className="space-y-3">
          {callLogs.map((call) => (
            <div key={call.id} className="p-3 bg-secondary rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    call.type === 'incoming' ? 'bg-green-500' : 
                    call.type === 'outgoing' ? 'bg-blue-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <h3 className="font-medium">{call.participant}</h3>
                    <p className="text-sm text-muted-foreground">{call.projectName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{call.duration}</p>
                  <p className="text-xs text-muted-foreground">{call.timestamp}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 