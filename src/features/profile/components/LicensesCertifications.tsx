import React from 'react';
import { Shield, Plus, FileText, Trash2, Upload, Check, X } from 'lucide-react';

const LicensesCertifications = ({
  licenses,
  showAddLicense,
  newLicense,
  isDark,
  setShowAddLicense,
  setNewLicense,
  handleAddLicense,
  handleRemoveLicense,
  toast
}: any) => (
  <div className={`${isDark ? 'bg-card' : 'bg-white'} rounded-lg shadow-lg p-6 ${isDark ? 'border-border' : 'border-gray-200'} border`}>
    <div className="flex items-center justify-between mb-6">
      <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
        <Shield size={24} />
        Licenses & Certifications
      </h2>
      <button
        onClick={() => setShowAddLicense(true)}
        className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2`}
      >
        <Plus size={16} />
        Add License
      </button>
    </div>
    <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
      {licenses.map((license: any) => (
        <div key={license.id} className={`${isDark ? 'bg-card' : 'bg-white'} rounded-lg p-4 ${isDark ? 'border-border' : 'border-gray-200'} border`}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <FileText size={20} className={isDark ? 'text-muted-foreground' : 'text-gray-600'} />
                <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{license.name}</h3>
                <span className={`px-2 py-1 text-xs rounded-full bg-opacity-20`}>
                  {license.status}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className={`${isDark ? 'text-muted-foreground' : 'text-gray-600'}`}>Type: </span>
                  <span className={`${isDark ? 'text-white' : 'text-gray-900'}`}>{license.type}</span>
                </div>
                <div>
                  <span className={`${isDark ? 'text-muted-foreground' : 'text-gray-600'}`}>Issue Date: </span>
                  <span className={`${isDark ? 'text-white' : 'text-gray-900'}`}>{license.issueDate}</span>
                </div>
                <div>
                  <span className={`${isDark ? 'text-muted-foreground' : 'text-gray-600'}`}>Expiry Date: </span>
                  <span className={`${isDark ? 'text-white' : 'text-gray-900'}`}>{license.expiryDate}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {license.file && (
                <button
                  className={`p-2 ${isDark ? 'bg-secondary hover:bg-muted' : 'bg-gray-200 hover:bg-gray-300'} rounded`}
                  onClick={() => {
                    if (typeof license.file === 'string') {
                      const a = document.createElement('a');
                      a.href = license.file;
                      a.download = license.name + '.' + (license.file.split(';')[0].split('/')[1] || 'pdf');
                      a.click();
                    } else if (license.file && typeof license.file !== 'string' && 'name' in license.file) {
                      alert('File: ' + (license.file as File).name);
                    } else {
                      alert('File: ' + license.file);
                    }
                  }}
                >
                  <FileText size={16} />
                </button>
              )}
              <button
                onClick={() => handleRemoveLicense(license.id)}
                className="p-2 bg-red-500 text-white rounded"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
    {showAddLicense && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className={`${isDark ? 'bg-card' : 'bg-white'} rounded-lg p-6 w-full max-w-md mx-4`}>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>Add New License</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="License Name"
              value={newLicense.name}
              onChange={(e) => setNewLicense({ ...newLicense, name: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg ${isDark ? 'bg-secondary text-foreground border-border' : 'bg-white text-gray-900 border-gray-200'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <select
              value={newLicense.type}
              onChange={(e) => setNewLicense({ ...newLicense, type: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg ${isDark ? 'bg-secondary text-foreground border-border' : 'bg-white text-gray-900 border-gray-200'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="">Select Type</option>
              <option value="Professional License">Professional License</option>
              <option value="Tax Certificate">Tax Certificate</option>
              <option value="Business License">Business License</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="date"
              placeholder="Issue Date"
              value={newLicense.issueDate}
              onChange={(e) => setNewLicense({ ...newLicense, issueDate: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg ${isDark ? 'bg-secondary text-foreground border-border' : 'bg-white text-gray-900 border-gray-200'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <input
              type="date"
              placeholder="Expiry Date"
              value={newLicense.expiryDate}
              onChange={(e) => setNewLicense({ ...newLicense, expiryDate: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg ${isDark ? 'bg-secondary text-foreground border-border' : 'bg-white text-gray-900 border-gray-200'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <div className={`border-2 border-dashed ${isDark ? 'border-border' : 'border-gray-200'} rounded-lg p-4 text-center`}>
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => setNewLicense({ ...newLicense, file: ev.target?.result as string });
                    reader.readAsDataURL(file);
                  } else {
                    setNewLicense({ ...newLicense, file: null });
                  }
                }}
                className="hidden"
                id="license-file"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <label htmlFor="license-file" className="cursor-pointer">
                <Upload size={24} className={`mx-auto ${isDark ? 'text-muted-foreground' : 'text-gray-600'} mb-2`} />
                <p className={`text-sm ${isDark ? 'text-muted-foreground' : 'text-gray-600'}`}>Upload License File</p>
                {typeof newLicense.file === 'string' && (
                  <span className="block mt-2 text-xs break-all">File selected</span>
                )}
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => {
                setShowAddLicense(false);
                setNewLicense({ name: '', type: '', issueDate: '', expiryDate: '', file: null });
              }}
              className={`px-4 py-2 ${isDark ? 'bg-secondary hover:bg-muted' : 'bg-gray-200 hover:bg-gray-300'} ${isDark ? 'text-white' : 'text-gray-900'} rounded-lg`}
            >
              Cancel
            </button>
            <button
              onClick={handleAddLicense}
              className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg`}
            >
              Add License
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);

export default LicensesCertifications; 