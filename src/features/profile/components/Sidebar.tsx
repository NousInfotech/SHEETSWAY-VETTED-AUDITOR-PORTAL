import React from 'react';

const Sidebar = ({ sidebarItems, activeSection, setActiveSection, isDark }: any) => (
  <div className={`${isDark ? 'bg-card' : 'bg-white'} rounded-lg shadow-lg p-4 ${isDark ? 'border-gray-800' : 'border-gray-200'} border`}>
    <nav className="space-y-2">
      {sidebarItems.map((item: any) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeSection === item.id
                ? `${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`
                : `${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-300'}`
            }`}
          >
            <Icon size={20} />
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  </div>
);

export default Sidebar; 