import React from 'react';

const AlertModal = ({ showAlertModal, alertPrefs, setAlertPrefs, setShowAlertModal, isDark }: any) => (
  showAlertModal && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${isDark ? 'bg-card' : 'bg-white'} rounded-lg p-6 w-full max-w-md mx-4`}>
        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>Configure Alerts</h3>
        <div className="space-y-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={alertPrefs.email} onChange={e => setAlertPrefs((p: any) => ({ ...p, email: e.target.checked }))} />
            Email Alerts
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={alertPrefs.sms} onChange={e => setAlertPrefs((p: any) => ({ ...p, sms: e.target.checked }))} />
            SMS Alerts
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={alertPrefs.dashboard} onChange={e => setAlertPrefs((p: any) => ({ ...p, dashboard: e.target.checked }))} />
            Dashboard Alerts
          </label>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setShowAlertModal(false)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Close</button>
        </div>
      </div>
    </div>
  )
);

export default AlertModal; 