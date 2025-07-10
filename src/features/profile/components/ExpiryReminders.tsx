import React from 'react';
import { Bell, Check, X } from 'lucide-react';

const ExpiryReminders = ({
  licenses,
  reminders,
  setReminderEdit,
  isDark,
  renderReminderModal
}: any) => (
  <div className={`${isDark ? 'bg-card' : 'bg-white'} rounded-lg shadow-lg p-6 ${isDark ? 'border-border' : 'border-gray-200'} border`}>
    <div className="flex items-center justify-between mb-6">
      <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
        <Bell size={24} />
        Expiry Reminders & Alerts
      </h2>
    </div>
    <div className="space-y-4">
      <div className={`${isDark ? 'bg-card' : 'bg-white'} rounded-lg p-4 ${isDark ? 'border-border' : 'border-gray-200'} border`}>
        <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>Active Reminders</h3>
        <div className="space-y-3">
          {licenses.map((license: any) => (
            <div key={license.id} className="flex flex-col gap-1 border-b border-border pb-2 mb-2 last:border-0 last:pb-0 last:mb-0">
              <div className="flex items-center gap-3">
                <Bell size={16} className={license.status === 'Expired' ? 'text-red-500' : 'text-yellow-500'} />
                <span className={`${isDark ? 'text-white' : 'text-gray-900'} text-sm font-medium`}>{license.name}</span>
                {reminders[Number(license.id)] && reminders[Number(license.id)].length > 0 && (
                  <span className="text-xs text-muted-foreground ml-2">Remind {reminders[Number(license.id)].join(', ')} day(s) before expiry</span>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mt-1">
                {reminders[Number(license.id)] && reminders[Number(license.id)].length > 0 ? (
                  reminders[Number(license.id)].map((days: number, idx: number) => (
                    <div key={idx} className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      <span>{days} days</span>
                      <button
                        className="ml-1 text-blue-600 hover:text-blue-800"
                        title="Edit"
                        onClick={() => setReminderEdit({ licenseId: Number(license.id), days: days.toString(), editIdx: idx })}
                      >
                        Edit
                      </button>
                      <button
                        className="ml-1 text-red-500 hover:text-red-700"
                        title="Remove"
                        onClick={() => {
                          setReminderEdit((r: any) => {
                            const updated = (reminders[Number(license.id)] || []).filter((_: number, i: number) => i !== idx);
                            return { ...r, [Number(license.id)]: updated };
                          });
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">No reminders set.</span>
                )}
                <button
                  className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded"
                  onClick={() => setReminderEdit({ licenseId: Number(license.id), days: '' })}
                >
                  Add Reminder
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    {renderReminderModal()}
  </div>
);

export default ExpiryReminders; 