// utils/index.ts
import { EngagementRequest } from '../types/request';

export const mockRequests: EngagementRequest[] = [
  {
    id: 1,
    type: 'Audit',
    industry: 'Manufacturing',
    size: 'Medium',
    framework: 'IFRS',
    urgency: 'Normal',
    budget: '€15,000 - €20,000',
    deadline: '2025-09-15',
    notes: 'Annual audit for manufacturing company with subsidiaries in EU. Complex inventory valuation required.',
    attachments: ['Trial Balance.xlsx', 'Previous Year Audit.pdf'],
    anonymous: true,
    submittedDate: '2025-07-05',
    tags: ['International', 'Complex']
  },
  {
    id: 2,
    type: 'Tax',
    industry: 'Technology',
    size: 'Small',
    framework: 'GAPSME',
    urgency: 'Urgent',
    budget: '€5,000 - €8,000',
    deadline: '2025-08-01',
    notes: 'VAT compliance and corporate tax preparation for tech startup.',
    attachments: ['Bank Statements.pdf', 'Invoices.zip'],
    anonymous: false,
    clientName: 'TechStart Solutions',
    submittedDate: '2025-07-07',
    tags: ['Startup', 'VAT']
  },
  {
    id: 3,
    type: 'Audit',
    industry: 'Retail',
    size: 'Large',
    framework: 'IFRS',
    urgency: 'Normal',
    budget: '€25,000 - €35,000',
    deadline: '2025-10-30',
    notes: 'Multi-location retail chain audit with revenue recognition complexities.',
    attachments: ['Consolidated TB.xlsx', 'Location Details.pdf', 'Revenue Analysis.xlsx'],
    anonymous: true,
    submittedDate: '2025-07-06',
    tags: ['Multi-location', 'Revenue Recognition']
  },
  {
    id: 4,
    type: 'Tax',
    industry: 'Healthcare',
    size: 'Medium',
    framework: 'GAPSME',
    urgency: 'Normal',
    budget: '€8,000 - €12,000',
    deadline: '2025-08-20',
    notes: 'Medical practice tax optimization and compliance review.',
    attachments: ['Financial Statements.pdf'],
    anonymous: false,
    clientName: 'Healthcare Partners Ltd',
    submittedDate: '2025-07-08',
    tags: ['Healthcare', 'Optimization']
  },
  {
    id: 5,
    type: 'Audit',
    industry: 'Construction',
    size: 'Large',
    framework: 'IFRS',
    urgency: 'Urgent',
    budget: '€30,000 - €45,000',
    deadline: '2025-08-15',
    notes: 'Construction company audit with complex project accounting and long-term contracts.',
    attachments: ['Project Reports.pdf', 'Contract Details.xlsx'],
    anonymous: true,
    submittedDate: '2025-07-03',
    tags: ['Construction', 'Long-term Contracts']
  },
  {
    id: 6,
    type: 'Tax',
    industry: 'E-commerce',
    size: 'Small',
    framework: 'GAPSME',
    urgency: 'Normal',
    budget: '€3,000 - €5,000',
    deadline: '2025-09-01',
    notes: 'E-commerce platform tax compliance across multiple EU jurisdictions.',
    attachments: ['Sales Reports.csv', 'VAT Returns.pdf'],
    anonymous: false,
    clientName: 'OnlineStore EU',
    submittedDate: '2025-07-04',
    tags: ['E-commerce', 'Multi-jurisdiction']
  }
];

export function downloadFile(url: string, filename: string) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadAllAttachments(attachments: string[]) {
  attachments.forEach(filename => {
    // Assume files are served from /files/{filename}
    downloadFile(`/files/${encodeURIComponent(filename)}`, filename);
  });
}

export function getUrgencyColor(urgency: string) {
  return urgency === 'Urgent' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800';
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function filterRequests(requests: EngagementRequest[], searchTerm: string, filters: any) {
  return requests.filter((request) => {
    const matchesSearch = searchTerm === '' || 
      request.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.size.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilters = 
      (filters.type === '' || request.type === filters.type) &&
      (filters.size === '' || request.size === filters.size) &&
      (filters.framework === '' || request.framework === filters.framework) &&
      (filters.urgency === '' || request.urgency === filters.urgency);

    return matchesSearch && matchesFilters;
  });
}