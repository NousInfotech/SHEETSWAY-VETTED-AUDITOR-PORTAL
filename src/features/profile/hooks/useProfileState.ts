"use client";
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { normalizeReminders } from '../utils';
import { defaultFirmData, defaultTeamMembers, defaultLicenses } from '../data/mock-data';
import { TeamMember, License, NewMember, NewLicense } from '../types';

export function useProfileState() {
  // Theme
  const [isDark, setIsDark] = useState(false); // Should be set from useTheme in main component

  // Section
  const [activeSection, setActiveSection] = useState('details');

  // Firm
  const [isEditingFirm, setIsEditingFirm] = useState(false);
  const [logoPreview, setLogoPreview] = useState('');
  const [newSpecialization, setNewSpecialization] = useState('');
  const [firmError, setFirmError] = useState('');
  const [firmData, setFirmData] = useState(() => {
    const stored = localStorage.getItem('firmData');
    return stored ? JSON.parse(stored) : defaultFirmData;
  });
  useEffect(() => { setLogoPreview(firmData.logo || ''); }, [firmData.logo]);

  // Team
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    const stored = localStorage.getItem('teamMembers');
    return stored ? JSON.parse(stored) : defaultTeamMembers;
  });
  const [showAddMember, setShowAddMember] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [newMember, setNewMember] = useState<NewMember>({ name: '', role: '', email: '', phone: '', specialization: '' });

  // Licenses
  const [licenses, setLicenses] = useState<License[]>(() => {
    const stored = localStorage.getItem('licenses');
    return stored ? JSON.parse(stored) : defaultLicenses;
  });
  const [showAddLicense, setShowAddLicense] = useState(false);
  const [newLicense, setNewLicense] = useState<NewLicense>({ name: '', type: '', issueDate: '', expiryDate: '', file: null });

  // Alerts & Reminders
  const [alertPrefs, setAlertPrefs] = useState(() => {
    const stored = localStorage.getItem('compliance_alert_prefs');
    return stored ? JSON.parse(stored) : { email: true, sms: false, dashboard: true };
  });
  const [reminders, setReminders] = useState<{ [licenseId: number]: number[] }>(() => {
    const stored = localStorage.getItem('license_reminders');
    return stored ? normalizeReminders(JSON.parse(stored)) : {};
  });
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [renewingLicense, setRenewingLicense] = useState<License | null>(null);
  const [renewDate, setRenewDate] = useState('');
  const [reminderEdit, setReminderEdit] = useState<{ licenseId: number | null, days: string, editIdx?: number }>({ licenseId: null, days: '' });

  // Persist to localStorage
  useEffect(() => { localStorage.setItem('compliance_alert_prefs', JSON.stringify(alertPrefs)); }, [alertPrefs]);
  useEffect(() => { localStorage.setItem('license_reminders', JSON.stringify(reminders)); }, [reminders]);
  useEffect(() => { localStorage.setItem('licenses', JSON.stringify(licenses)); }, [licenses]);

  // --- Team Members CRUD ---
  const handleAddMember = () => {
    if (newMember.name && newMember.role && newMember.email) {
      const member: TeamMember = {
        id: Date.now(),
        ...newMember,
        joinDate: new Date().toISOString().split('T')[0]
      };
      setTeamMembers([...teamMembers, member]);
      setNewMember({ name: '', role: '', email: '', phone: '', specialization: '' });
      setShowAddMember(false);
      toast('Team member added!', { icon: '✅' });
    }
  };
  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member);
    setNewMember({ ...member });
    setShowAddMember(true);
  };
  const handleUpdateMember = () => {
    if (editingMember) {
      setTeamMembers(teamMembers.map((m) =>
        m.id === editingMember.id ? { ...editingMember, ...newMember, id: editingMember.id, joinDate: editingMember.joinDate } : m
      ));
      setEditingMember(null);
      setNewMember({ name: '', role: '', email: '', phone: '', specialization: '' });
      setShowAddMember(false);
      toast('Team member updated!', { icon: '✅' });
    }
  };
  const handleRemoveMember = (id: number) => {
    setTeamMembers(teamMembers.filter(m => m.id !== id));
    toast('Team member removed!', { icon: '✅' });
  };

  // --- Licenses CRUD ---
  const handleAddLicense = () => {
    if (newLicense.name && newLicense.type && newLicense.expiryDate) {
      const license: License = {
        id: Date.now(),
        name: newLicense.name,
        type: newLicense.type,
        issueDate: newLicense.issueDate,
        expiryDate: newLicense.expiryDate,
        status: 'Active',
        file: typeof newLicense.file === 'string' ? newLicense.file : newLicense.file ? newLicense.file.name : 'uploaded-file.pdf',
      };
      setLicenses([...licenses, license]);
      setNewLicense({ name: '', type: '', issueDate: '', expiryDate: '', file: null });
      setShowAddLicense(false);
      toast('License added!', { icon: '✅' });
    }
  };
  const handleRemoveLicense = (id: number) => {
    setLicenses(licenses.filter(l => l.id !== id));
    toast('License removed!', { icon: '✅' });
  };

  return {
    isDark,
    setIsDark,
    activeSection,
    setActiveSection,
    isEditingFirm,
    setIsEditingFirm,
    logoPreview,
    setLogoPreview,
    newSpecialization,
    setNewSpecialization,
    firmError,
    setFirmError,
    firmData,
    setFirmData,
    teamMembers,
    setTeamMembers,
    showAddMember,
    setShowAddMember,
    editingMember,
    setEditingMember,
    newMember,
    setNewMember,
    licenses,
    setLicenses,
    showAddLicense,
    setShowAddLicense,
    newLicense,
    setNewLicense,
    alertPrefs,
    setAlertPrefs,
    reminders,
    setReminders,
    showAlertModal,
    setShowAlertModal,
    renewingLicense,
    setRenewingLicense,
    renewDate,
    setRenewDate,
    reminderEdit,
    setReminderEdit,
    toast,
    handleAddMember,
    handleEditMember,
    handleUpdateMember,
    handleRemoveMember,
    handleAddLicense,
    handleRemoveLicense
  };
} 