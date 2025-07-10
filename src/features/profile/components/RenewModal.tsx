import React from 'react';

const RenewModal = ({ renewingLicense, renewDate, setRenewingLicense, setRenewDate, setLicenses, licenses, isDark, toast }: any) => (
  renewingLicense && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${isDark ? 'bg-card' : 'bg-white'} rounded-lg p-6 w-full max-w-md mx-4`}>
        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>Renew License</h3>
        <input type="date" value={renewDate} onChange={e => setRenewDate(e.target.value)} className={`w-full px-3 py-2 rounded-lg ${isDark ? 'bg-secondary text-foreground border-border' : 'bg-white text-gray-900 border-gray-200'} border focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4`} />
        <div className="flex justify-end gap-3">
          <button onClick={() => { setRenewingLicense(null); setRenewDate(''); }} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg">Cancel</button>
          <button onClick={() => {
            if (renewDate) {
              setLicenses(licenses.map((l: any) => l.id === renewingLicense.id ? { ...l, expiryDate: renewDate, status: 'Active' } : l));
              setRenewingLicense(null); setRenewDate('');
              toast('License renewed!');
            }
          }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Renew</button>
        </div>
      </div>
    </div>
  )
);

export default RenewModal; 