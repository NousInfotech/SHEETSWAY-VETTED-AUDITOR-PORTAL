'use client';

import { File } from '@/files/types';
import { X } from 'lucide-react';
import { useMemo } from 'react';

interface FileViewerProps {
  file: File;
  onClose: () => void;
}

// Helper to decode Base64 content for text files
const decodeTextContent = (dataUrl: string) => {
  try {
    const base64 = dataUrl.split(',')[1];
    return atob(base64);
  } catch (e) {
    console.error('Failed to decode Base64 content:', e);
    return 'Error: Could not display file content.';
  }
};

export default function FileViewer({ file, onClose }: FileViewerProps) {
  const textContent = useMemo(() => {
    if (file.mimeType.startsWith('text/')) {
      return decodeTextContent(file.content);
    }
    return '';
  }, [file]);

  const renderContent = () => {
    if (file.mimeType.startsWith('image/')) {
      return (
        <img
          src={file.content}
          alt={file.name}
          className="max-w-full max-h-full object-contain"
        />
      );
    }

    if (file.mimeType === 'application/pdf') {
      return (
        <iframe
          src={file.content}
          title={file.name}
          className="w-full h-full"
          frameBorder="0"
        />
      );
    }
    
    if (file.mimeType.startsWith('text/')) {
      return (
        <pre className="w-full h-full p-4 bg-gray-100 dark:bg-gray-800 rounded-md overflow-auto whitespace-pre-wrap">
          <code>{textContent}</code>
        </pre>
      );
    }
    
    // Fallback for unsupported types
    return (
      <div className="text-center p-10">
        <p className="text-lg font-medium">Preview not available</p>
        <p className="text-sm text-gray-500">{`Cannot display files of type "${file.mimeType}".`}</p>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-card rounded-lg shadow-2xl w-11/12 h-5/6 lg:w-4/5 lg:h-5/6 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold truncate" title={file.name}>{file.name}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Close viewer"
          >
            <X size={24} />
          </button>
        </header>
        <main className="flex-grow p-4 overflow-hidden">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}