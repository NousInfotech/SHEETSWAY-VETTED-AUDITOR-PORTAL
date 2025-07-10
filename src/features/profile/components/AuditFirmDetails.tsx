import React from 'react';
import { Building2, Edit2, X, Save, Upload, Plus } from 'lucide-react';

const AuditFirmDetails = ({
  firmData,
  isEditingFirm,
  logoPreview,
  newSpecialization,
  firmError,
  isDark,
  setIsEditingFirm,
  setFirmError,
  setLogoPreview,
  setFirmData,
  setNewSpecialization
}: any) => (
  <div className={`${isDark ? 'bg-card' : 'bg-white'} rounded-lg shadow-lg p-6 ${isDark ? 'border-border' : 'border-gray-200'} border`}>
    <div className="flex items-center justify-between mb-6">
      <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
        <Building2 size={24} />
        Audit Firm Details
      </h2>
      {isEditingFirm ? (
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 ${isDark ? 'bg-secondary hover:bg-muted' : 'bg-gray-200 hover:bg-gray-300'} ${isDark ? 'text-white' : 'text-gray-900'} rounded-lg flex items-center gap-2`}
            onClick={() => {
              setIsEditingFirm(false);
              setFirmError('');
              setLogoPreview(firmData.logo || '');
            }}
          >
            <X size={16} /> Cancel
          </button>
          <button
            className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2`}
            onClick={() => {
              if (!firmData.name || !firmData.contact.email) {
                setFirmError('Firm name and email are required.');
                return;
              }
              setIsEditingFirm(false);
              setFirmError('');
              setFirmData((prev: any) => ({ ...prev, logo: logoPreview }));
            }}
          >
            <Save size={16} /> Save
          </button>
        </div>
      ) : (
        <button className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2`} onClick={() => setIsEditingFirm(true)}>
          <Edit2 size={16} />
          Edit Details
        </button>
      )}
    </div>
    {firmError && <div className="text-red-500 mb-4">{firmError}</div>}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className={`block text-sm font-medium ${isDark ? 'text-muted-foreground' : 'text-gray-600'} mb-2`}>
          Firm Name
        </label>
        <input
          type="text"
          value={firmData.name}
          disabled={!isEditingFirm}
          onChange={(e) => setFirmData({ ...firmData, name: e.target.value })}
          className={`w-full px-3 py-2 rounded-lg ${isDark ? 'bg-secondary text-foreground border-border' : 'bg-white text-gray-900 border-gray-200'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
      </div>
      <div>
        <label className={`block text-sm font-medium ${isDark ? 'text-muted-foreground' : 'text-gray-600'} mb-2`}>
          Logo Upload
        </label>
        <div className={`border-2 border-dashed ${isDark ? 'border-border' : 'border-gray-200'} rounded-lg p-4 text-center relative`}>
          {logoPreview && <img src={logoPreview} alt="Logo Preview" className="mx-auto mb-2 h-16 object-contain" />}
          {isEditingFirm ? (
            <>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="firm-logo-upload"
                onChange={(e) => {
                  const file = e.target.files && e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => setLogoPreview(ev.target?.result as string);
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <label htmlFor="firm-logo-upload" className="cursor-pointer block">
                <Upload size={24} className={`mx-auto ${isDark ? 'text-muted-foreground' : 'text-gray-600'} mb-2`} />
                <p className={`text-sm ${isDark ? 'text-muted-foreground' : 'text-gray-600'}`}>Click to upload logo</p>
              </label>
            </>
          ) : (
            <>
              <Upload size={24} className={`mx-auto ${isDark ? 'text-muted-foreground' : 'text-gray-600'} mb-2`} />
              <p className={`text-sm ${isDark ? 'text-muted-foreground' : 'text-gray-600'}`}>Logo preview</p>
            </>
          )}
        </div>
      </div>
      <div className="md:col-span-2">
        <label className={`block text-sm font-medium ${isDark ? 'text-muted-foreground' : 'text-gray-600'} mb-2`}>
          Description
        </label>
        <textarea
          value={firmData.description}
          disabled={!isEditingFirm}
          onChange={(e) => setFirmData({ ...firmData, description: e.target.value })}
          rows={4}
          className={`w-full px-3 py-2 rounded-lg ${isDark ? 'bg-secondary text-foreground border-border' : 'bg-white text-gray-900 border-gray-200'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
      </div>
      <div>
        <label className={`block text-sm font-medium ${isDark ? 'text-muted-foreground' : 'text-gray-600'} mb-2`}>
          Email
        </label>
        <input
          type="email"
          value={firmData.contact.email}
          disabled={!isEditingFirm}
          onChange={(e) => setFirmData({ ...firmData, contact: { ...firmData.contact, email: e.target.value } })}
          className={`w-full px-3 py-2 rounded-lg ${isDark ? 'bg-secondary text-foreground border-border' : 'bg-white text-gray-900 border-gray-200'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
      </div>
      <div>
        <label className={`block text-sm font-medium ${isDark ? 'text-muted-foreground' : 'text-gray-600'} mb-2`}>
          Phone
        </label>
        <input
          type="tel"
          value={firmData.contact.phone}
          disabled={!isEditingFirm}
          onChange={(e) => setFirmData({ ...firmData, contact: { ...firmData.contact, phone: e.target.value } })}
          className={`w-full px-3 py-2 rounded-lg ${isDark ? 'bg-secondary text-foreground border-border' : 'bg-white text-gray-900 border-gray-200'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
      </div>
      <div className="md:col-span-2">
        <label className={`block text-sm font-medium ${isDark ? 'text-muted-foreground' : 'text-gray-600'} mb-2`}>
          Address
        </label>
        <input
          type="text"
          value={firmData.contact.address}
          disabled={!isEditingFirm}
          onChange={(e) => setFirmData({ ...firmData, contact: { ...firmData.contact, address: e.target.value } })}
          className={`w-full px-3 py-2 rounded-lg ${isDark ? 'bg-secondary text-foreground border-border' : 'bg-white text-gray-900 border-gray-200'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
      </div>
    </div>
    <div className="mt-6">
      <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>Areas of Specialization</h3>
      <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-2">
        {firmData.specializations.map((spec: string, index: number) => (
          <span
            key={index}
            className={`px-3 py-1 ${isDark ? 'bg-secondary hover:bg-muted' : 'bg-gray-200 hover:bg-gray-300'} ${isDark ? 'text-white' : 'text-gray-900'} rounded-full text-sm flex items-center gap-2`}
          >
            {spec}
            {isEditingFirm && (
              <X size={14} className="cursor-pointer" onClick={() => setFirmData({ ...firmData, specializations: firmData.specializations.filter((_: string, i: number) => i !== index) })} />
            )}
          </span>
        ))}
        {isEditingFirm && (
          <>
            <input
              type="text"
              value={newSpecialization}
              onChange={(e) => setNewSpecialization(e.target.value)}
              placeholder="Add Specialization"
              className={`px-3 py-1 rounded-full text-sm border ${isDark ? 'bg-secondary text-foreground border-border' : 'bg-white text-gray-900 border-gray-200'}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newSpecialization.trim()) {
                  setFirmData({ ...firmData, specializations: [...firmData.specializations, newSpecialization.trim()] });
                  setNewSpecialization('');
                }
              }}
            />
            <button
              className={`px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm flex items-center gap-2`}
              onClick={() => {
                if (newSpecialization.trim()) {
                  setFirmData({ ...firmData, specializations: [...firmData.specializations, newSpecialization.trim()] });
                  setNewSpecialization('');
                }
              }}
            >
              <Plus size={14} /> Add
            </button>
          </>
        )}
      </div>
    </div>
  </div>
);

export default AuditFirmDetails; 