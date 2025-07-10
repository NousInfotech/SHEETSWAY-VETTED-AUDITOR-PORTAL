import React from 'react';

const ReminderModal = ({ reminderEdit, setReminderEdit, setReminders, toast, isDark }: any) => (
  reminderEdit.licenseId !== null && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${isDark ? 'bg-card' : 'bg-white'} rounded-lg p-6 w-full max-w-md mx-4`}>
        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
          {reminderEdit.editIdx !== undefined ? 'Edit Reminder' : 'Add Reminder'}
        </h3>
        <input
          type="number"
          min="1"
          placeholder="Days before expiry"
          value={reminderEdit.days}
          onChange={e => setReminderEdit((r: any) => ({ ...r, days: e.target.value }))}
          className={`w-full px-3 py-2 rounded-lg ${isDark ? 'bg-secondary text-foreground border-border' : 'bg-white text-gray-900 border-gray-200'} border focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4`}
        />
        <div className="flex justify-end gap-3">
          <button onClick={() => setReminderEdit({ licenseId: null, days: '' })} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg">Cancel</button>
          <button onClick={() => {
            const daysNum = parseInt(reminderEdit.days);
            if (reminderEdit.licenseId !== null && daysNum > 0) {
              setReminders((r: any) => {
                const prevRaw = reminderEdit.licenseId !== null ? r[reminderEdit.licenseId] : [];
                const prev = Array.isArray(prevRaw) ? prevRaw : typeof prevRaw === 'number' ? [prevRaw] : [];
                let updated: number[];
                if (reminderEdit.editIdx !== undefined) {
                  updated = [...prev];
                  updated[reminderEdit.editIdx] = daysNum;
                } else {
                  updated = [...prev, daysNum];
                }
                // Remove duplicates and sort
                updated = Array.from(new Set(updated)).sort((a, b) => a - b);
                return reminderEdit.licenseId !== null ? { ...r, [reminderEdit.licenseId]: updated } : r;
              });
              toast(reminderEdit.editIdx !== undefined ? 'Reminder updated!' : 'Reminder added!');
              setReminderEdit({ licenseId: null, days: '' });
            }
          }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Save</button>
        </div>
      </div>
    </div>
  )
);

export default ReminderModal; 