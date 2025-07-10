import React from 'react';
import { Users, Edit2, Trash2, Plus, Mail, Phone, Award, Calendar, X } from 'lucide-react';

const TeamMembers = ({
  teamMembers,
  showAddMember,
  editingMember,
  newMember,
  isDark,
  firmData,
  setShowAddMember,
  setEditingMember,
  setNewMember,
  handleEditMember,
  handleRemoveMember,
  handleAddMember,
  handleUpdateMember,
  toast
}: any) => (
  <div className={`${isDark ? 'bg-card' : 'bg-white'} rounded-lg shadow-lg p-6 ${isDark ? 'border-border' : 'border-gray-200'} border`}>
    <div className="flex items-center justify-between mb-6">
      <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
        <Users size={24} />
        Team Members
      </h2>
      <button
        onClick={() => setShowAddMember(true)}
        className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2`}
      >
        <Plus size={16} />
        Add Member
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
      {teamMembers.map((member: any) => (
        <div
          key={member.id}
          className={`relative group rounded-xl p-5 border-l-4 ${isDark ? 'bg-card border-blue-700 hover:border-blue-500' : 'bg-white border-blue-600 hover:border-blue-500'} shadow transition-all duration-200 hover:shadow-lg flex flex-col gap-3`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold ${isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700'}`}> 
                {member.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
              </div>
              <div>
                <h3 className={`font-semibold text-lg ${isDark ? 'text-foreground' : 'text-gray-900'}`}>{member.name}</h3>
                <p className={`text-sm ${isDark ? 'text-blue-400' : 'text-blue-700'} font-medium`}>{member.role}</p>
              </div>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => handleEditMember(member)}
                className={`p-2 ${isDark ? 'bg-secondary hover:bg-muted' : 'bg-gray-100 hover:bg-gray-200'} rounded-full transition`}
                title="Edit"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => handleRemoveMember(member.id)}
                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition"
                title="Remove"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-2 pl-2 border-l border-border">
            <div className="flex items-center gap-2">
              <Mail size={15} className="text-blue-400" />
              <span className="text-sm break-all text-muted-foreground">{member.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={15} className="text-blue-400" />
              <span className="text-sm text-muted-foreground">{member.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Award size={15} className="text-blue-400" />
              <span className="text-sm text-muted-foreground">{member.specialization}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={15} className="text-blue-400" />
              <span className="text-xs text-muted-foreground">Joined: {member.joinDate}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
    {showAddMember && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className={`${isDark ? 'bg-card' : 'bg-white'} rounded-lg p-6 w-full max-w-md mx-4`}>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
            {editingMember ? 'Edit Member' : 'Add New Member'}
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={newMember.name}
              onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg ${isDark ? 'bg-secondary text-foreground border-border' : 'bg-white text-gray-900 border-gray-200'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <input
              type="text"
              placeholder="Role"
              value={newMember.role}
              onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg ${isDark ? 'bg-secondary text-foreground border-border' : 'bg-white text-gray-900 border-gray-200'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <input
              type="email"
              placeholder="Email"
              value={newMember.email}
              onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg ${isDark ? 'bg-secondary text-foreground border-border' : 'bg-white text-gray-900 border-gray-200'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <input
              type="tel"
              placeholder="Phone"
              value={newMember.phone}
              onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg ${isDark ? 'bg-secondary text-foreground border-border' : 'bg-white text-gray-900 border-gray-200'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <select
              value={newMember.specialization}
              onChange={(e) => setNewMember({ ...newMember, specialization: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg ${isDark ? 'bg-secondary text-foreground border-border' : 'bg-white text-gray-900 border-gray-200'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="">Select Specialization</option>
              {firmData.specializations.map((spec: string) => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => {
                setShowAddMember(false);
                setEditingMember(null);
                setNewMember({ name: '', role: '', email: '', phone: '', specialization: '' });
              }}
              className={`px-4 py-2 ${isDark ? 'bg-secondary hover:bg-muted' : 'bg-gray-200 hover:bg-gray-300'} ${isDark ? 'text-white' : 'text-gray-900'} rounded-lg`}
            >
              Cancel
            </button>
            <button
              onClick={editingMember ? handleUpdateMember : handleAddMember}
              className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg`}
            >
              {editingMember ? 'Update' : 'Add'} Member
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);

export default TeamMembers; 