import React from 'react';
import { Video } from 'lucide-react';

export const CallsArea: React.FC = () => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <Video className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground text-lg">Call History</p>
        <p className="text-muted-foreground text-sm mt-2">Recent calls and call logs will appear here</p>
      </div>
    </div>
  );
}; 