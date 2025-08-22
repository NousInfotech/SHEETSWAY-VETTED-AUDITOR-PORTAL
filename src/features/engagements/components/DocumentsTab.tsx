import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUploader } from '@/components/file-uploader';
import { Download, Trash2 } from 'lucide-react';

import FilesPage from '@/files/FilesPage';
import PageContainer from '@/components/layout/page-container';

// Mock data for uploaded and delivered documents
const mockClientFiles = [
  { name: 'Internal_Report_Q1.pdf', size: '1.2MB', uploadedAt: '2024-07-20' },
  { name: 'Bank_Statement.xlsx', size: '800KB', uploadedAt: '2024-07-18' }
];
const mockAuditorFiles = [
  { name: 'Audit_Working_Paper.pdf', size: '2.1MB', deliveredAt: '2024-07-21' },
  { name: 'Final_Audit_Report.pdf', size: '1.8MB', deliveredAt: '2024-07-22' }
];

const DocumentsTab: React.FC = () => {
  const [clientFiles] = useState(mockClientFiles); // Read-only for auditor
  const [auditorFiles, setAuditorFiles] = useState(mockAuditorFiles);

  const handleUpload = async (files: File[]) => {
    // TODO: Integrate with backend API
    // For now, just add to mock list
    const newFiles = files.map((file) => ({
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(1)}MB`,
      deliveredAt: new Date().toISOString().slice(0, 10)
    }));
    setAuditorFiles((prev) => [...newFiles, ...prev]);
  };

  const handleDelete = (name: string) => {
    setAuditorFiles((prev) => prev.filter((file) => file.name !== name));
  };

  return (
    <>
      <FilesPage />
    </>
  );
};

export default DocumentsTab;
