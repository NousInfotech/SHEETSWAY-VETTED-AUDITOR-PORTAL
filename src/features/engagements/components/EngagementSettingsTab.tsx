import React, { useState } from 'react';
import { Engagement } from '../types/engagement-types';
import { Save } from 'lucide-react';

interface EngagementSettingsTabProps {
  engagement: Engagement;
  onUpdate: (engagement: Engagement) => void;
}

const EngagementSettingsTab: React.FC<EngagementSettingsTabProps> = ({ engagement, onUpdate }) => {
  const [form, setForm] = useState({
    status: engagement.status,
    visibility: engagement.visibility || 'Private',
    emailAlerts: engagement.notificationSettings?.emailAlerts ?? false,
    milestoneReminders: engagement.notificationSettings?.milestoneReminders ?? false,
    deadlineWarnings: engagement.notificationSettings?.deadlineWarnings ?? false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let checked = false;
    if (type === 'checkbox') {
      checked = (e.target as HTMLInputElement).checked;
    }
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    onUpdate({
      ...engagement,
      status: form.status as Engagement['status'],
      visibility: form.visibility as Engagement['visibility'],
      notificationSettings: {
        emailAlerts: form.emailAlerts,
        milestoneReminders: form.milestoneReminders,
        deadlineWarnings: form.deadlineWarnings
      }
    });
  };

  return (
    <div className="max-w-xl mx-auto bg-card dark:bg-card border border-border rounded-lg p-6 transition-colors space-y-6">
      <h2 className="text-xl font-semibold text-foreground mb-4">Engagement Settings</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
          >
            <option value="Planning">Planning</option>
            <option value="In Progress">In Progress</option>
            <option value="Under Review">Under Review</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Visibility</label>
          <select
            name="visibility"
            value={form.visibility}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
          >
            <option value="Private">Private</option>
            <option value="Team">Team</option>
            <option value="Public">Public</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notification Preferences</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="emailAlerts"
                checked={form.emailAlerts}
                onChange={handleChange}
                className="form-checkbox"
              />
              Email Alerts
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="milestoneReminders"
                checked={form.milestoneReminders}
                onChange={handleChange}
                className="form-checkbox"
              />
              Milestone Reminders
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="deadlineWarnings"
                checked={form.deadlineWarnings}
                onChange={handleChange}
                className="form-checkbox"
              />
              Deadline Warnings
            </label>
          </div>
        </div>
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
        >
          <Save className="h-4 w-4" />
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default EngagementSettingsTab; 