// Mock data extracted from profile page

export const defaultFirmData = {
  name: 'Acme Corp Audit Services',
  logo: '',
  description: 'Leading audit firm specializing in financial compliance and risk management solutions for enterprises.',
  specializations: ['Financial Auditing', 'Tax Compliance', 'Risk Assessment', 'Internal Controls'],
  contact: {
    email: 'contact@acmecorp.com',
    phone: '+1 (555) 123-4567',
    address: '123 Business District, City, State 12345',
  },
};

export const defaultTeamMembers = [
  {
    id: 1,
    name: 'John Doe',
    role: 'Senior Auditor',
    email: 'john.doe@acmecorp.com',
    phone: '+1 (555) 123-4567',
    specialization: 'Financial Auditing',
    joinDate: '2023-01-15',
  },
  {
    id: 2,
    name: 'Sarah Wilson',
    role: 'Tax Specialist',
    email: 'sarah.wilson@acmecorp.com',
    phone: '+1 (555) 123-4568',
    specialization: 'Tax Compliance',
    joinDate: '2023-03-20',
  },
  {
    id: 3,
    name: 'Mike Johnson',
    role: 'Risk Analyst',
    email: 'mike.johnson@acmecorp.com',
    phone: '+1 (555) 123-4569',
    specialization: 'Risk Assessment',
    joinDate: '2023-05-10',
  },
];

export const defaultLicenses = [
  {
    id: 1,
    name: 'CPA License',
    type: 'Professional License',
    issueDate: '2023-01-01',
    expiryDate: '2025-01-01',
    status: 'Active',
    file: 'cpa-license.pdf',
  },
  {
    id: 2,
    name: 'Tax Preparation Certificate',
    type: 'Tax Certificate',
    issueDate: '2023-02-15',
    expiryDate: '2024-12-31',
    status: 'Expiring Soon',
    file: 'tax-cert.pdf',
  },
  {
    id: 3,
    name: 'Business License',
    type: 'Business License',
    issueDate: '2022-06-01',
    expiryDate: '2024-06-01',
    status: 'Expiring Soon',
    file: 'business-license.pdf',
  },
]; 