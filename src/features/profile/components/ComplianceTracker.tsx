import React from 'react';
import { Calendar, Check, AlertTriangle, X, Settings } from 'lucide-react';

const ComplianceTracker = ({
  licenses,
  reminders,
  setShowAlertModal,
  setRenewingLicense,
  setRenewDate,
  setReminderEdit,
  isDark
}: any) => {
  const getExpiryStatus = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntilExpiry < 0) return 'Expired';
    if (daysUntilExpiry <= 30) return 'Expiring Soon';
    return 'Active';
  };
  const expiringLicenses = licenses.filter((l: any) => getExpiryStatus(l.expiryDate) === 'Expiring Soon');
  const expiredLicenses = licenses.filter((l: any) => getExpiryStatus(l.expiryDate) === 'Expired');
  const activeLicenses = licenses.filter((l: any) => getExpiryStatus(l.expiryDate) === 'Active');
  return (
    <div className={`${isDark ? 'bg-card' : 'bg-white'} rounded-lg shadow-lg p-6 ${isDark ? 'border-border' : 'border-gray-200'} border`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
          <Calendar size={24} />
          Compliance Status Tracker
        </h2>
        <button className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2`} onClick={() => setShowAlertModal(true)}>
          <Settings size={16} />
          Configure Alerts
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className={`${isDark ? 'bg-card' : 'bg-white'} rounded-lg p-4 ${isDark ? 'border-border' : 'border-gray-200'} border`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Active Licenses</h3>
            <Check size={20} className="text-green-500" />
          </div>
          <p className={`text-2xl font-bold text-green-500`}>{activeLicenses.length}</p>
        </div>
        <div className={`${isDark ? 'bg-card' : 'bg-white'} rounded-lg p-4 ${isDark ? 'border-border' : 'border-gray-200'} border`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Expiring Soon</h3>
            <AlertTriangle size={20} className="text-yellow-500" />
          </div>
          <p className={`text-2xl font-bold text-yellow-500`}>{expiringLicenses.length}</p>
        </div>
        <div className={`${isDark ? 'bg-card' : 'bg-white'} rounded-lg p-4 ${isDark ? 'border-border' : 'border-gray-200'} border`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Expired</h3>
            <X size={20} className="text-red-500" />
          </div>
          <p className={`text-2xl font-bold text-red-500`}>{expiredLicenses.length}</p>
        </div>
      </div>
      <div className="space-y-4">
        <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>Upcoming Expirations</h3>
        {[...expiringLicenses, ...expiredLicenses].map((license: any) => (
          <div key={license.id} className={`${isDark ? 'bg-card' : 'bg-white'} rounded-lg p-4 ${isDark ? 'border-border' : 'border-gray-200'} border flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <AlertTriangle size={20} className={getExpiryStatus(license.expiryDate) === 'Expired' ? 'text-red-500' : 'text-yellow-500'} />
              <div>
                <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{license.name}</h4>
                <p className={`text-sm ${isDark ? 'text-muted-foreground' : 'text-gray-600'}`}>
                  Expires: {license.expiryDate} ({getExpiryStatus(license.expiryDate)})
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className={`px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm`} onClick={() => { setRenewingLicense(license); setRenewDate(''); }}>
                Renew
              </button>
              <button className={`px-3 py-1 ${isDark ? 'bg-secondary hover:bg-muted' : 'bg-gray-200 hover:bg-gray-300'} ${isDark ? 'text-white' : 'text-gray-900'} rounded text-sm`} onClick={() => setReminderEdit({ licenseId: license.id, days: reminders[license.id]?.join(', ') || '' })}>
                Set Reminder
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComplianceTracker; 