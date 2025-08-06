// // --- TYPE DEFINITIONS ---
// type FileData = {
//   id: string;
//   name: string;
//   size: string;
//   creationDate: string;
//   directory: string;
// };

// type Subfolder = {
//   name: string;
//   files: FileData[];
// };

// type Library = {
//   name: string;
//   subfolders: Subfolder[];
// };

// // --- RECOMMENDED DEFAULT LIBRARIES + SUBFOLDERS ---
// const defaultLibrariesData: Library[] = [
//   {
//     name: "1. Planning",
//     subfolders: [
//       { name: "Engagement Letter", files: [] },
//       { name: "Materiality Assessment", files: [] },
//       { name: "Risk Assessment", files: [] },
//       { name: "Team Planning Docs", files: [] },
//     ],
//   },
//   {
//     name: "2. Trial Balance",
//     subfolders: [
//       { name: "TB Excel", files: [] },
//       { name: "Mapping File", files: [] },
//       { name: "Adjustments", files: [] },
//     ],
//   },
//   {
//     name: "3. General Ledger",
//     subfolders: [
//       { name: "Full GL", files: [] },
//       { name: "Monthly Breakdown (optional)", files: [] },
//     ],
//   },
//   {
//     name: "4. Prior Year Files",
//     subfolders: [
//         { name: "Prior FS", files: [] },
//         { name: "Prior Working Papers", files: [] },
//     ]
//   },
//   {
//     name: "5. Audit Procedures",
//     subfolders: [
//       { name: "Cash and Bank", files: [] },
//       { name: "Receivables", files: [] },
//       { name: "Payables", files: [] },
//       { name: "Inventory", files: [] },
//       {
//         name: "PPE",
//         files: Array.from({ length: 7 }, (_, i) => ({
//           id: `ppe-file-${i + 1}`,
//           name: "Engagement Letter.pdf",
//           size: "10.28 KB",
//           creationDate: "29th Feb 2024 10:02 AM",
//           directory: "Audit Procedures/PPE",
//         })),
//       },
//       { name: "Revenue", files: [] },
//       { name: "Expenses", files: [] },
//       { name: "Others", files: [] },
//     ],
//   },
//   {
//     name: "6. Audit Letters & Confirmations",
//     subfolders: [
//       { name: "Bank Confirmations", files: [] },
//       { name: "Legal Letters", files: [] },
//       { name: "Management Rep Letter", files: [] },
//     ],
//   },
//   {
//     name: "7. Final Deliverables",
//     subfolders: [
//       { name: "Signed Financials", files: [] },
//       { name: "Signed Audit Report", files: [] },
//       { name: "Final Management Letter", files: [] },
//     ],
//   },
// ];

// #################################################################################################################

'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Folder,
  File as FileIcon,
  Trash2,
  Plus,
  Search,
  Download,
  ExternalLink,
  Menu,
  MoreVertical,
  FileText,
  Save,
  Upload,
  Settings,
  Library,
  LayoutList
} from 'lucide-react';
import { toast } from 'sonner';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

// TYPE DEFINITIONS
type FileData = {
  id: string;
  name: string;
  size: string;
  creationDate: string;
  directory: string;
};
type Subfolder = { id: string; name: string; files: FileData[] };
type LibraryData = { id: string; name: string; subfolders: Subfolder[] };

// HELPER TO GENERATE INITIAL DATA WITH IDs
const createInitialData = (): LibraryData[] => [
  {
    id: crypto.randomUUID(),
    name: '1. Planning',
    subfolders: [
      { id: crypto.randomUUID(), name: 'Engagement Letter', files: [] },
      { id: crypto.randomUUID(), name: 'Risk Assessment', files: [] }
    ]
  },
  {
    id: crypto.randomUUID(),
    name: '2. Trial Balance',
    subfolders: [
      { id: crypto.randomUUID(), name: 'TB Excel', files: [] },
      { id: crypto.randomUUID(), name: 'Adjustments', files: [] }
    ]
  },
  {
    id: crypto.randomUUID(),
    name: '3. General Ledger',
    subfolders: [{ id: crypto.randomUUID(), name: 'Full GL', files: [] }]
  },
  {
    id: crypto.randomUUID(),
    name: '4. Prior Year Files',
    subfolders: [
      { id: crypto.randomUUID(), name: 'Prior FS', files: [] },
      { id: crypto.randomUUID(), name: 'Prior Working Papers', files: [] }
    ]
  },
  {
    id: crypto.randomUUID(),
    name: '5. Audit Procedures',
    subfolders: [
      { id: crypto.randomUUID(), name: 'Cash and Bank', files: [] },
      { id: crypto.randomUUID(), name: 'Receivables', files: [] },
      {
        id: crypto.randomUUID(),
        name: 'PPE',
        files: Array.from({ length: 7 }, (_, i) => ({
          id: `ppe-file-${i + 1}`,
          name: 'Engagement Letter.pdf',
          size: '10.28 KB',
          creationDate: '29th Feb 2024 10:02 AM',
          directory: 'Audit Procedures/PPE'
        }))
      },
      { id: crypto.randomUUID(), name: 'Revenue', files: [] }
    ]
  },
  {
    id: crypto.randomUUID(),
    name: '6. Audit Letters & Confirmations',
    subfolders: [
      { id: crypto.randomUUID(), name: 'Bank Confirmations', files: [] }
    ]
  },
  {
    id: crypto.randomUUID(),
    name: '7. Final Deliverables',
    subfolders: [
      { id: crypto.randomUUID(), name: 'Signed Financials', files: [] }
    ]
  }
];

const ALL_DOCUMENTS_ID = '__ALL_DOCUMENTS__';
const CLICK_DELAY = 250; // ms

// MAIN COMPONENT
export default function FilesandDocuments() {
  const [libraries, setLibraries] = useState<LibraryData[]>(createInitialData);
  const [selectedLibraryId, setSelectedLibraryId] = useState<string>(
    libraries[4].id
  );
  const [selectedSubfolderId, setSelectedSubfolderId] = useState<string | null>(
    libraries[4].subfolders[2].id
  );

  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [folderSearchTerm, setFolderSearchTerm] = useState('');
  const [fileSearchTerm, setFileSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAllFilesInLibrary, setShowAllFilesInLibrary] = useState(false);

  const [renamingInfo, setRenamingInfo] = useState<{
    id: string;
    type: 'library' | 'subfolder';
  } | null>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (renamingInfo) {
      renameInputRef.current?.focus();
      renameInputRef.current?.select();
    }
  }, [renamingInfo]);

  useEffect(() => {
    return () => {
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
      }
    };
  }, []);

  const handleSingleClick = (action: () => void) => {
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
    }
    clickTimerRef.current = setTimeout(() => {
      action();
      clickTimerRef.current = null;
    }, CLICK_DELAY);
  };

  const handleDoubleClick = (renameAction: () => void) => {
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
    }
    renameAction();
  };

  const handleLibrarySelect = (libraryId: string) => {
    if (renamingInfo) return;
    setSelectedLibraryId(libraryId);
    setSelectedSubfolderId(null);
    setShowAllFilesInLibrary(false);
    setFolderSearchTerm('');
    setFileSearchTerm('');
    setSelectedFiles([]);
    if (isSidebarOpen) setIsSidebarOpen(false);
  };

  const handleSubfolderSelect = (subfolderId: string) => {
    if (renamingInfo) return;
    setSelectedSubfolderId(subfolderId);
    setShowAllFilesInLibrary(false);
    setFileSearchTerm('');
    setSelectedFiles([]);
  };

  const handleAddLibrary = () => {
    const newLibraryName = prompt('Enter the name for the new library:');
    if (newLibraryName && newLibraryName.trim()) {
      const newLibrary: LibraryData = {
        id: crypto.randomUUID(),
        name: newLibraryName.trim(),
        subfolders: []
      };
      setLibraries((prev) => [...prev, newLibrary]);
      toast.success(`Library "${newLibraryName.trim()}" created.`);
    }
  };

  const handleRename = (newName: string) => {
    if (!renamingInfo || !newName.trim()) {
      setRenamingInfo(null);
      return;
    }
    setLibraries((prev) =>
      prev.map((lib) => {
        if (renamingInfo.type === 'library' && lib.id === renamingInfo.id) {
          toast.success(`Library renamed to "${newName}"`);
          return { ...lib, name: newName };
        }
        if (renamingInfo.type === 'subfolder' && lib.id === selectedLibraryId) {
          return {
            ...lib,
            subfolders: lib.subfolders.map((sub) =>
              sub.id === renamingInfo.id ? { ...sub, name: newName } : sub
            )
          };
        }
        return lib;
      })
    );
    setRenamingInfo(null);
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleRename(e.currentTarget.value);
    if (e.key === 'Escape') setRenamingInfo(null);
  };

  const handleFileSelect = (fileId: string) => {
    setSelectedFiles((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    );
  };

  const selectedLibrary = useMemo(
    () => libraries.find((lib) => lib.id === selectedLibraryId),
    [libraries, selectedLibraryId]
  );
  const allFilesInSystem = useMemo(
    () =>
      libraries.flatMap((lib) => lib.subfolders.flatMap((sub) => sub.files)),
    [libraries]
  );
  const allFilesInSelectedLibrary = useMemo(
    () => selectedLibrary?.subfolders.flatMap((sub) => sub.files) || [],
    [selectedLibrary]
  );
  const selectedSubfolder = useMemo(
    () =>
      selectedLibrary?.subfolders.find((sub) => sub.id === selectedSubfolderId),
    [selectedLibrary, selectedSubfolderId]
  );
  const filesForCurrentView = useMemo(() => {
    if (selectedLibraryId === ALL_DOCUMENTS_ID) return allFilesInSystem;
    if (showAllFilesInLibrary) return allFilesInSelectedLibrary;
    if (selectedSubfolder) return selectedSubfolder.files;
    return [];
  }, [
    selectedLibraryId,
    showAllFilesInLibrary,
    selectedSubfolder,
    allFilesInSystem,
    allFilesInSelectedLibrary
  ]);
  const filteredFiles = useMemo(
    () =>
      filesForCurrentView.filter((file) =>
        file.name.toLowerCase().includes(fileSearchTerm.toLowerCase())
      ),
    [filesForCurrentView, fileSearchTerm]
  );
  const handleSelectAllFiles = (isChecked: boolean) =>
    setSelectedFiles(isChecked ? filteredFiles.map((file) => file.id) : []);
  const handleDeleteFiles = () => {
    if (selectedFiles.length === 0) {
      toast.error('You must select files first to delete.');
      return;
    }
    toast.success(`${selectedFiles.length} file(s) would be deleted.`);
  };
  const filteredSubfolders = useMemo(
    () =>
      selectedLibrary?.subfolders.filter((subfolder) =>
        subfolder.name.toLowerCase().includes(folderSearchTerm.toLowerCase())
      ) || [],
    [selectedLibrary, folderSearchTerm]
  );

  const SidebarContent = () => (
    <div className='flex h-full flex-col not-dark:bg-slate-50/50'>
      <div className='border-b p-4'>
        <h2 className='flex items-center text-xl font-semibold'>
          <LayoutList className='mr-3 h-6 w-6 text-orange-600' /> Libraries
        </h2>
      </div>
      <nav className='flex-1 space-y-1 overflow-y-auto px-2 py-4'>
        <button
          onClick={() => handleLibrarySelect(ALL_DOCUMENTS_ID)}
          className={`flex w-full items-center rounded-md p-2 text-left text-sm font-medium transition-colors ${selectedLibraryId === ALL_DOCUMENTS_ID ? 'border-l-4 border-orange-500 bg-orange-100 font-bold text-orange-600' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          <Folder className='mr-3 h-5 w-5 flex-shrink-0' /> All Documents
        </button>
        <div className='pt-2'></div>
        {libraries.map((library) => (
          <div
            key={library.id}
            className={`flex w-full cursor-pointer items-center justify-between rounded-md p-2 text-left text-sm font-medium transition-colors ${selectedLibraryId === library.id ? 'border-l-4 border-orange-500 bg-orange-100 font-bold text-orange-600' : 'text-gray-700 hover:bg-gray-100'}`}
            onClick={() =>
              handleSingleClick(() => handleLibrarySelect(library.id))
            }
            onDoubleClick={() =>
              handleDoubleClick(() =>
                setRenamingInfo({ id: library.id, type: 'library' })
              )
            }
          >
            {renamingInfo?.id === library.id ? (
              <Input
                defaultValue={library.name}
                ref={renameInputRef}
                onBlur={(e) => handleRename(e.target.value)}
                onKeyDown={handleRenameKeyDown}
                className='h-8'
                onClick={(e) => e.stopPropagation()}
                onDoubleClick={(e) => e.stopPropagation()}
              />
            ) : (
              <>
                <span className='flex items-center truncate'>
                  <Folder className='mr-3 h-5 w-5 flex-shrink-0' />
                  <span className='truncate'>{library.name}</span>
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-6 w-6 flex-shrink-0'
                    >
                      <MoreVertical className='h-4 w-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                    <DropdownMenuItem
                      className='text-red-500 focus:bg-red-50 focus:text-red-500'
                      onClick={() => toast.error('Delete not implemented.')}
                    >
                      <Trash2 className='mr-2 h-4 w-4' /> Delete Library
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        ))}
        <Button
          variant='ghost'
          className='mt-2 w-full justify-start text-gray-600'
          onClick={handleAddLibrary}
        >
          <Plus className='mr-2 h-4 w-4' /> Add Library
        </Button>
      </nav>
      <div className='space-y-2 border-t p-3'>
        <div className='flex items-center p-2 text-sm font-semibold text-gray-600'>
          <Settings className='mr-2 h-4 w-4' /> Library Settings
        </div>
        <Button
          variant='ghost'
          className='w-full justify-start text-gray-600'
          onClick={() => toast.info('Saving structure...')}
        >
          <Save className='mr-2 h-4 w-4' /> Save Library Structure
        </Button>
        <Button
          variant='ghost'
          className='w-full justify-start text-gray-600'
          onClick={() => toast.info('Importing structure...')}
        >
          <Upload className='mr-2 h-4 w-4' /> Import Library Structure
        </Button>
      </div>
    </div>
  );

  const SubfolderView = () => (
    <section className='mb-8' aria-labelledby='subfolders-heading'>
      <div className='mb-4 flex flex-col justify-between gap-2 md:flex-row md:items-center'>
        <div className='flex flex-wrap items-center gap-2'>
          <Button
            variant='outline'
            onClick={() => toast.info('Add new folder...')}
          >
            <Plus className='mr-2 h-4 w-4' /> Add Folder
          </Button>
          <Button
            variant='outline'
            onClick={() => setShowAllFilesInLibrary(true)}
          >
            <FileText className='mr-2 h-4 w-4' /> Show all documents
          </Button>
          <Button variant='outline' disabled>
            <Trash2 className='mr-2 h-4 w-4' /> Delete Folder
          </Button>
        </div>
        <div className='relative w-full md:w-64'>
          <Search className='absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400' />
          <Input
            placeholder='Search folders...'
            className='pl-10'
            value={folderSearchTerm}
            onChange={(e) => setFolderSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'>
        {filteredSubfolders.map((subfolder) => (
          <div
            key={subfolder.id}
            className={`cursor-pointer rounded-lg border p-3 text-center transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${selectedSubfolder?.id === subfolder.id && !showAllFilesInLibrary ? 'border-b-5 border-b-blue-500 shadow-sm not-dark:bg-blue-100' : 'border border-transparent not-dark:bg-gray-100 hover:bg-gray-200'}`}
            onClick={() =>
              handleSingleClick(() => handleSubfolderSelect(subfolder.id))
            }
            onDoubleClick={() =>
              handleDoubleClick(() =>
                setRenamingInfo({ id: subfolder.id, type: 'subfolder' })
              )
            }
          >
            {/* <Folder
              className={`mx-auto h-12 w-12 ${selectedSubfolder?.id === subfolder.id ? 'text-blue-600' : 'text-blue-500'}`}
            /> */}
            <img
              src='/assets/file-icons/open-folder.png'
              alt=''
              className={`mx-auto h-12 w-12 ${selectedSubfolder?.id === subfolder.id ? '' : ''}`}
            />

            {renamingInfo?.id === subfolder.id ? (
              <Input
                defaultValue={subfolder.name}
                ref={renameInputRef}
                onBlur={(e) => handleRename(e.target.value)}
                onKeyDown={handleRenameKeyDown}
                className='mt-2 h-8'
                onClick={(e) => e.stopPropagation()}
                onDoubleClick={(e) => e.stopPropagation()}
              />
            ) : (
              <p className='mt-2 truncate text-sm font-medium text-gray-700'>
                {subfolder.name}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );

  const FileListView = () => {
    let heading = 'Files';
    if (selectedLibraryId === ALL_DOCUMENTS_ID)
      heading = 'All Documents in System';
    else if (showAllFilesInLibrary)
      heading = `All Files in ${selectedLibrary?.name}`;
    else if (selectedSubfolder) heading = selectedSubfolder.name;
    return (
      <section aria-labelledby='files-heading'>
        <div className='mb-4 flex flex-col justify-between gap-2 md:flex-row md:items-center'>
          <h2
            id='files-heading'
            className='text-xl font-semibold text-gray-800'
          >
            {heading}
          </h2>
          <div className='flex flex-wrap items-center gap-2'>
            <Button
              variant='outline'
              onClick={() => toast.info('Add new document...')}
            >
              <Plus className='mr-2 h-4 w-4' /> Add Document
            </Button>
            <Button variant='outline' onClick={handleDeleteFiles}>
              <Trash2 className='mr-2 h-4 w-4' /> Delete Files
            </Button>
            <div className='relative w-full md:w-64'>
              <Search className='absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400' />
              <Input
                placeholder='Search files...'
                className='pl-10'
                value={fileSearchTerm}
                onChange={(e) => setFileSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className='overflow-x-auto rounded-lg border'>
          <Table>
            <TableHeader className='not-dark:bg-gray-50'>
              <TableRow>
                <TableHead className='w-[50px] px-4'>
                  <Checkbox
                    checked={
                      selectedFiles.length === filteredFiles.length &&
                      filteredFiles.length > 0
                    }
                    onCheckedChange={(checked) =>
                      handleSelectAllFiles(Boolean(checked))
                    }
                    aria-label='Select all files'
                  />
                </TableHead>
                <TableHead className='w-[50px]'>File</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Creation Date</TableHead>
                <TableHead>Directory</TableHead>
                <TableHead className='pr-4 text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFiles.length > 0 ? (
                filteredFiles.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell className='px-4'>
                      <Checkbox
                        checked={selectedFiles.includes(file.id)}
                        onCheckedChange={() => handleFileSelect(file.id)}
                        aria-label={`Select file ${file.name}`}
                      />
                    </TableCell>
                    <TableCell>
                      <FileIcon className='h-5 w-5 text-red-500' />
                    </TableCell>
                    <TableCell className='font-medium text-gray-800'>
                      {file.name}
                    </TableCell>
                    <TableCell className='text-gray-600'>{file.size}</TableCell>
                    <TableCell className='text-gray-600'>
                      {file.creationDate}
                    </TableCell>
                    <TableCell className='text-gray-600'>
                      {file.directory}
                    </TableCell>
                    <TableCell className='pr-4 text-right'>
                      <div className='flex items-center justify-end gap-1'>
                        <Button
                          variant='ghost'
                          size='icon'
                          aria-label={`Download ${file.name}`}
                        >
                          <Download className='h-5 w-5' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='icon'
                          aria-label={`Open ${file.name} in new tab`}
                        >
                          <ExternalLink className='h-5 w-5' />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className='h-24 text-center text-gray-500'
                  >
                    No documents found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    );
  };

  return (
    <div className='flex h-auto rounded-md border font-sans not-dark:bg-white'>
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side='left' className='w-80 p-0 md:hidden'>
          <SheetHeader>
            <SheetTitle className='sr-only'>Libraries</SheetTitle>
          </SheetHeader>
          <SidebarContent />
        </SheetContent>
      </Sheet>

      <aside className='hidden md:flex md:w-80 md:flex-col md:border-r'>
        <SidebarContent />
      </aside>

      <main className='flex flex-1 flex-col p-4 md:p-6'>
        <header className='mb-6 flex items-center justify-between'>
          <h1 className='truncate pr-4 text-2xl font-bold text-gray-800'>
            {(selectedLibraryId === ALL_DOCUMENTS_ID
              ? 'All Documents'
              : selectedLibrary?.name) || 'Select a Library'}
          </h1>
          <div className='md:hidden'>
            <Button
              variant='outline'
              size='icon'
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className='h-6 w-6' />
            </Button>
          </div>
        </header>
        {selectedLibraryId !== ALL_DOCUMENTS_ID && <SubfolderView />}
        {(selectedSubfolder ||
          showAllFilesInLibrary ||
          selectedLibraryId === ALL_DOCUMENTS_ID) && <FileListView />}
      </main>
    </div>
  );
}