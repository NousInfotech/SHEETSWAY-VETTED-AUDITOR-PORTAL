'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';
import { Loader2, FileUp, FileCheck, X, FileText } from 'lucide-react';
import { StartButton } from '@/features/engagements/components/StartButton';

import SignedDocumentsUpload from './SignedDocumentsUpload';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { makeEngaementToStart } from '@/api/engagement';

// This is the SignatureModal from the previous step
const SignatureModal = dynamic(
  () =>
    import('@/features/engagements/components/SignatureModal').then(
      (mod) => mod.SignatureModal
    ),
  {
    ssr: false,
    loading: () => (
      <div className='bg-opacity-60 fixed inset-0 z-50 flex items-center justify-center bg-black backdrop-blur-sm'>
        <div className='flex items-center gap-3 rounded-lg bg-slate-800 p-4 text-lg text-white shadow-2xl'>
          <Loader2 className='h-6 w-6 animate-spin' />
          <span>Loading Signature Pad...</span>
        </div>
      </div>
    )
  }
);

const demoFiles = [
  { title: 'Sample Agreement', path: '/demo-pdfs/sample-agreement.pdf' },
  {
    title: 'Non-Disclosure-Agreement',
    path: '/demo-pdfs/Non-Disclosure-Agreement.pdf'
  },
  { title: 'Engagement Letter', path: '/demo-pdfs/Engagement Letter.pdf' }
];

interface signingFlowComponentProps {
  selectedEngagement: any | null;
  handleUploadSuccess: () => void;
}

// Renamed from SigningPage to SigningFlowComponent to reflect its new role
export function SigningFlowComponent({
  selectedEngagement,
  handleUploadSuccess
}: signingFlowComponentProps) {
  // 'idle' | 'signing' | 'uploading'
  const [flowState, setFlowState] = useState('signing');

  const [isStarted, setIsStarted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [documentToSign, setDocumentToSign] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoadingDemo, setIsLoadingDemo] = useState(false);
  const [isSignedUploads, setIsSignedUploads] = useState(false);

  useEffect(() => {
    if (documentToSign) {
      setIsModalOpen(true);
    }
  }, [documentToSign]);

  // inside the useEffect call the function makeEngagementToStart

  const processFile = (file: File | null | undefined) => {
    if (file && file.type === 'application/pdf') {
      toast.success(`"${file.name}" selected.`);
      setDocumentToSign(file);
    } else {
      toast.error('Please select a valid PDF file.');
      setDocumentToSign(null);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    processFile(event.target.files?.[0]);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    processFile(event.dataTransfer.files?.[0]);
  };

  const handleDemoFileClick = async (filePath: string, fileName: string) => {
    setIsLoadingDemo(true);
    toast.info(`Loading "${fileName}"...`);
    try {
      const response = await fetch(filePath);
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      const file = new File([blob], fileName, { type: 'application/pdf' });
      setDocumentToSign(file);
    } catch (error) {
      console.error('Failed to fetch demo PDF:', error);
      toast.error(`Could not load "${fileName}". Please check the file path.`);
    } finally {
      setIsLoadingDemo(false);
    }
  };

  const handleSignatureComplete = (signedFile: Blob) => {
    console.log('Signed file received!', signedFile);
    toast.success(
      'Process complete! Check the console for the signed file blob.'
    );
    setIsModalOpen(false);
    setDocumentToSign(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setDocumentToSign(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (flowState === 'uploading') {
    return <SignedDocumentsUpload engagement={selectedEngagement} handleUploadSuccess={handleUploadSuccess} />;
  }

  if (flowState === 'signing') {
    return (
      <>
        {/* The root element is now simpler, without 'min-h-screen',
        as it will live inside the modal. */}
        <div className='relative w-full bg-slate-50 dark:bg-slate-900'>
          {/* --- LAYER 1: E-SIGNATURE PORTAL (Always rendered) --- */}
          <div
            className={`flex min-h-[85vh] w-full flex-col items-center justify-center gap-8 p-4 text-slate-800 transition-all duration-500 dark:text-slate-200 ${!isStarted ? 'scale-105 blur-md' : 'blur-0 scale-100'}`}
          >
            {' '}
            <div className='flex flex-col'>
              <Button onClick={() => setFlowState('uploading')}>
                UPLOAD SIGNED DOCUMENTS
              </Button>
              <p className='flex items-center text-red-500'>
                <span className='text-xs'>
                  uploading signed documents is mandatory to start service
                </span>
                <span className='px-1'>
                  <Info size={10} />
                </span>
              </p>
            </div>
            <div className='w-full max-w-2xl text-center'>
              <h1 className='text-4xl font-bold tracking-tight text-slate-900 dark:text-white'>
                E-Signature Portal
              </h1>
              <p className='mt-2 text-lg text-slate-600 dark:text-slate-400'>
                Select a document or upload your own PDF to be signed.
              </p>
            </div>
            {/* ... (rest of your JSX for file selection, etc.) ... */}
            <div className='w-full max-w-lg'>
              <h2 className='mb-3 text-center text-sm font-semibold text-slate-500 uppercase'>
                PLEASE SIGN YOUR DOCUMENTS GIVEN BELOW
              </h2>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
                {demoFiles.map((file) => (
                  <button
                    key={file.path}
                    onClick={() => handleDemoFileClick(file.path, file.title)}
                    disabled={isLoadingDemo}
                    className='flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-700'
                  >
                    <FileText className='h-4 w-4' />
                    <span className='text-sm font-medium'>{file.title}</span>
                  </button>
                ))}
              </div>
              <div className='my-6 flex items-center'>
                <div className='flex-grow border-t border-slate-300 dark:border-slate-700'></div>
                <span className='mx-4 flex-shrink text-xs font-semibold text-slate-400 uppercase'>
                  Or
                </span>
                <div className='flex-grow border-t border-slate-300 dark:border-slate-700'></div>
              </div>
            </div>
            <div className='w-full max-w-lg'>
              {!documentToSign ? (
                <div
                  onDragEnter={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDragging(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDragging(false);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={handleDrop}
                  className={`relative flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed bg-white p-12 text-center transition-colors duration-300 dark:bg-slate-800 ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-300 hover:border-slate-400 dark:border-slate-600 dark:hover:border-slate-500'}`}
                >
                  <label
                    htmlFor='file-upload'
                    className='flex h-full w-full cursor-pointer flex-col items-center justify-center'
                  >
                    <FileUp
                      className={`mb-4 h-12 w-12 transition-colors ${isDragging ? 'text-blue-500' : 'text-slate-400'}`}
                    />
                    <h3 className='font-semibold text-slate-700 lg:text-lg dark:text-slate-300'>
                      Drag & drop your own PDF
                    </h3>
                    <p className='text-sm text-slate-500 dark:text-slate-400'>
                      or click to browse
                    </p>
                    <input
                      id='file-upload'
                      type='file'
                      accept='application/pdf'
                      onChange={handleFileChange}
                      className='sr-only'
                    />
                  </label>
                </div>
              ) : (
                <div className='flex w-full items-center justify-between rounded-xl border-2 border-green-500 bg-green-50 p-4 text-green-800 dark:bg-green-900/20 dark:text-green-300'>
                  <div className='flex items-center gap-3'>
                    <FileCheck className='h-8 w-8' />
                    <div>
                      <p className='font-semibold'>{documentToSign.name}</p>
                      <p className='text-sm'>
                        {formatFileSize(documentToSign.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setDocumentToSign(null)}
                    className='rounded-full p-1 text-green-700 transition-colors hover:bg-green-200 dark:text-green-300 dark:hover:bg-green-700'
                    aria-label='Remove file'
                  >
                    <X className='h-5 w-5' />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* --- LAYER 2: START SCREEN OVERLAY --- */}
          {!isStarted && (
            <div className='animate-fade-in absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/20 p-4 text-center backdrop-blur-sm transition-opacity duration-500'>
              <div className='animate-fade-in-up'>
                <h1 className='text-4xl font-bold tracking-tight text-white drop-shadow-lg sm:text-5xl'>
                  Start Your Engagement
                </h1>
                <p className='mt-4 text-lg text-slate-200 drop-shadow-md'>
                  Click the button below to start signing documents.
                </p>
                <div className='mt-8'>
                  <StartButton
                    text='Start Signing'
                    onClick={() => setIsStarted(true)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* The SignatureModal is triggered by state and will appear on top of the SigningFlowComponent */}
          {isModalOpen && documentToSign && (
            <SignatureModal
              file={documentToSign}
              onClose={handleModalClose}
              onSign={handleSignatureComplete}
            />
          )}
        </div>
      </>
    );
  }

  // This is the new "idle" state, the initial choice screen.
  // return (
  //   <div className='flex min-h-[85vh] flex-col items-center justify-center bg-slate-50 p-4 dark:bg-slate-900'>
  //     <div className='text-center'>
  //       <h1 className='text-4xl font-bold tracking-tight text-slate-900 dark:text-white'>
  //         Choose Your Action
  //       </h1>
  //       <p className='mt-2 text-lg text-slate-600 dark:text-slate-400'>
  //         How would you like to proceed with your documents?
  //       </p>
  //       <div className='mt-8 flex flex-col gap-4 sm:flex-row'>
  //         <StartButton
  //           text='E-Sign Documents'
  //           onClick={() => setFlowState('signing')}
  //         />
  //         <StartButton
  //           text='Upload Signed Documents'
  //           onClick={() => setFlowState('uploading')}
  //         />
  //       </div>
  //     </div>
  //   </div>
  // );
}
