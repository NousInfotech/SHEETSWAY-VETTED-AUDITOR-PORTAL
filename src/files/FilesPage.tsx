'use client';

import { useState, useEffect, MouseEvent, useMemo, useRef } from 'react';
import { File, Folder, FileSystemNode } from '@/files/types';
import FolderItem from '@/files/components/FolderItem';
import FileItem from '@/files/components/FileItem';
import ContextMenu from '@/files/components/ContextMenu';
import InlineInput from '@/files/components/InlineInput';
import FileViewer from '@/files/components/FileViewer'; // <-- Import the new FileViewer
import { Folder as FolderIcon, File as FileIcon, Save, Download } from 'lucide-react';
import JSZip from 'jszip';

const initialFileSystem: FileSystemNode[] = [
  { id: 'root', name: 'My Drive', type: 'folder', children: [] },
];

const initialExpandedIds: string[] = ['root'];

export default function HomePage() {
  // --- STATE MANAGEMENT ---
  const [fileSystem, setFileSystem] = useState<FileSystemNode[]>(initialFileSystem);
  const [expandedFolderIds, setExpandedFolderIds] = useState<Set<string>>(
    new Set(initialExpandedIds)
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; nodeId: string } | null>(null);
  const [creatingNode, setCreatingNode] = useState<{ parentId: string | null; type: 'file' | 'folder' } | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [uploadTargetFolderId, setUploadTargetFolderId] = useState<string | null>(null);
  const [viewingFile, setViewingFile] = useState<File | null>(null); // <-- NEW: State for file viewer

  // --- REFS FOR HIDDEN INPUTS ---
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  // --- HYDRATION-SAFE LOADING ---
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('fileSystemState');
      if (savedState) {
        const { fileSystem: loadedFileSystem, expandedFolderIds: loadedExpandedIds } = JSON.parse(savedState);
        setFileSystem(loadedFileSystem);
        setExpandedFolderIds(new Set(loadedExpandedIds));
      }
    } catch (error) {
      console.error('Error reading from local storage', error);
    }
  }, []);

  // --- HELPER FUNCTIONS ---
  const findNodeById = (nodes: FileSystemNode[], id: string): FileSystemNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.type === 'folder') {
        const found = findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const creationParentId = useMemo(() => {
    if (!selectedNodeId) return null;
    const selectedNode = findNodeById(fileSystem, selectedNodeId);
    if (!selectedNode) return null;
    return selectedNode.type === 'folder' ? selectedNode.id : null;
  }, [selectedNodeId, fileSystem]);

  // --- EFFECT FOR CLOSING CONTEXT MENU ---
  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (contextMenu && !(event.target as Element).closest('#context-menu')) setContextMenu(null);
    };
    if (contextMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [contextMenu]);

  // --- CORE EVENT HANDLERS ---
  const handleNodeClick = (nodeId: string) => setSelectedNodeId(nodeId);

  const handleFolderClick = (folderId: string) => {
    handleNodeClick(folderId);
    setExpandedFolderIds((prev) => {
      const newExpanded = new Set(prev);
      newExpanded.has(folderId) ? newExpanded.delete(folderId) : newExpanded.add(folderId);
      return newExpanded;
    });
  };

  const handleContextMenu = (e: MouseEvent, nodeId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedNodeId(nodeId);
    setContextMenu({ x: e.clientX, y: e.clientY, nodeId });
  };

  const handleDeselect = () => {
    setSelectedNodeId(null);
    setContextMenu(null);
  };

  // --- NEW: HANDLER FOR OPENING FILE ---
  const handleOpenFile = (fileId: string) => {
    const node = findNodeById(fileSystem, fileId);
    if (node && node.type === 'file') {
      setViewingFile(node);
    }
  };

  // --- (Create, Upload, Save, and Download handlers remain the same) ---
  const handleInitiateCreateNode = (parentId: string | null, type: 'file' | 'folder') => {
    setCreatingNode({ parentId, type });
    if (parentId) setExpandedFolderIds((prev) => new Set(prev).add(parentId));
    setContextMenu(null);
  };
  const handleConfirmCreateNode = (name: string) => {
    if (!creatingNode) return;
    const { parentId, type } = creatingNode;
    const newNode: FileSystemNode = type === 'file'
      ? { id: Date.now().toString(), name, type: 'file', mimeType: 'text/plain', content: 'data:text/plain;base64,' }
      : { id: Date.now().toString(), name, type: 'folder', children: [] };
    if (parentId === null) {
      setFileSystem((prev) => [...prev, newNode]);
    } else {
      const addNodeToTree = (nodes: FileSystemNode[]): FileSystemNode[] => nodes.map((node) => {
        if (node.type === 'folder' && node.id === parentId) {
          return { ...node, children: [...node.children, newNode] };
        } else if (node.type === 'folder') {
          return { ...node, children: addNodeToTree(node.children) };
        }
        return node;
      });
      setFileSystem(addNodeToTree);
    }
    setCreatingNode(null);
  };
  const handleCancelCreateNode = () => setCreatingNode(null);
  const readFileAsDataURL = (file: globalThis.File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };
  const handleInitiateFileUpload = (targetFolderId: string) => {
    setUploadTargetFolderId(targetFolderId);
    fileInputRef.current?.click();
  };
  const handleInitiateFolderUpload = (targetFolderId: string) => {
    setUploadTargetFolderId(targetFolderId);
    folderInputRef.current?.click();
  };
  const addNodesToTarget = (newNodes: FileSystemNode[]) => {
    if (!uploadTargetFolderId) return;
    const add = (nodes: FileSystemNode[]): FileSystemNode[] => {
      return nodes.map((node) => {
        if (node.type === 'folder') {
          if (node.id === uploadTargetFolderId) {
            return { ...node, children: [...node.children, ...newNodes] };
          }
          return { ...node, children: add(node.children) };
        }
        return node;
      });
    };
    setFileSystem(add);
    setExpandedFolderIds((prev) => new Set(prev).add(uploadTargetFolderId!));
    setUploadTargetFolderId(null);
  };
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    const newFileNodes: File[] = [];
    for (const file of Array.from(files)) {
      const content = await readFileAsDataURL(file);
      newFileNodes.push({ id: `${Date.now()}-${file.name}`, name: file.name, type: 'file', mimeType: file.type || 'application/octet-stream', content });
    }
    addNodesToTarget(newFileNodes);
    event.target.value = '';
  };
  const handleFolderChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    const rootNodes: FileSystemNode[] = [];
    const dirMap = new Map<string, Folder>();
    for (const file of Array.from(files)) {
      if (!file.webkitRelativePath) continue;
      const content = await readFileAsDataURL(file);
      const pathParts = file.webkitRelativePath.split('/');
      const fileName = pathParts.pop()!;
      let currentLevel: FileSystemNode[] = rootNodes;
      let currentPath = '';
      pathParts.forEach((part, index) => {
        currentPath += (index > 0 ? '/' : '') + part;
        let folder = dirMap.get(currentPath);
        if (!folder) {
          folder = { id: `${Date.now()}-${currentPath}`, name: part, type: 'folder', children: [] };
          dirMap.set(currentPath, folder);
          const parentPath = pathParts.slice(0, index).join('/');
          const parentFolder = dirMap.get(parentPath);
          if (parentFolder) {
            parentFolder.children.push(folder);
          } else {
            rootNodes.push(folder);
          }
        }
        currentLevel = folder.children;
      });
      currentLevel.push({ id: `${Date.now()}-${fileName}`, name: fileName, type: 'file', mimeType: file.type || 'application/octet-stream', content });
    }
    addNodesToTarget(rootNodes);
    event.target.value = '';
  };
  const handleSave = () => {
    setSaveStatus('saving');
    try {
      const stateToSave = { fileSystem, expandedFolderIds: Array.from(expandedFolderIds) };
      localStorage.setItem('fileSystemState', JSON.stringify(stateToSave));
      setSaveStatus('saved');
    } catch (error) {
      console.error('Error saving to local storage', error);
      setSaveStatus('error');
    } finally {
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };
  const triggerDownload = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  const handleDownloadFile = (node: File) => {
    triggerDownload(node.content, node.name);
  };
  const addFolderToZip = async (currentFolder: Folder, zipFolder: JSZip) => {
    for (const child of currentFolder.children) {
      if (child.type === 'file') {
        const response = await fetch(child.content);
        const blob = await response.blob();
        zipFolder.file(child.name, blob);
      } else {
        const subZipFolder = zipFolder.folder(child.name);
        if (subZipFolder) {
          await addFolderToZip(child, subZipFolder);
        }
      }
    }
  };
  const handleDownloadFolder = async (node: Folder) => {
    const zip = new JSZip();
    const topLevelZipFolder = zip.folder(node.name);
    if (topLevelZipFolder) {
      await addFolderToZip(node, topLevelZipFolder);
    }
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = window.URL.createObjectURL(zipBlob);
    triggerDownload(url, `${node.name}.zip`);
    window.URL.revokeObjectURL(url);
  };
  const handleDownload = () => {
    if (!contextMenu?.nodeId) return;
    const node = findNodeById(fileSystem, contextMenu.nodeId);
    if (!node) return;
    if (node.type === 'file') {
      handleDownloadFile(node);
    } else {
      handleDownloadFolder(node);
    }
  };
  const handleDownloadAll = async () => {
    setIsDownloadingAll(true);
    const zip = new JSZip();
    try {
      for (const node of fileSystem) {
        if (node.type === 'file') {
          const response = await fetch(node.content);
          const blob = await response.blob();
          zip.file(node.name, blob);
        } else {
          const folderZip = zip.folder(node.name);
          if (folderZip) {
            await addFolderToZip(node, folderZip);
          }
        }
      }
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(zipBlob);
      triggerDownload(url, 'file-manager-backup.zip');
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to create the master zip archive:", error);
    } finally {
      setIsDownloadingAll(false);
    }
  };

  // --- RENDER LOGIC ---
  const renderNodes = (nodes: FileSystemNode[], isRoot: boolean = false) => {
    return nodes.map((node) => (
      <div key={node.id} className={isRoot ? '' : 'ml-4'}>
        {node.type === 'folder' ? (
          <div>
            <FolderItem folder={node as Folder} isExpanded={expandedFolderIds.has(node.id)} isSelected={selectedNodeId === node.id} onClick={handleFolderClick} onContextMenu={(e) => handleContextMenu(e, node.id)} />
            {expandedFolderIds.has(node.id) && (
              <div className="pl-4 border-l border-gray-300">
                {renderNodes((node as Folder).children)}
                {creatingNode?.parentId === node.id && (
                  <InlineInput type={creatingNode.type} onConfirm={handleConfirmCreateNode} onCancel={handleCancelCreateNode} />
                )}
              </div>
            )}
          </div>
        ) : (
          // Pass the new onDoubleClick handler to FileItem
          <FileItem
            file={node as File}
            isSelected={selectedNodeId === node.id}
            onClick={handleNodeClick}
            onContextMenu={(e) => handleContextMenu(e, node.id)}
            onDoubleClick={handleOpenFile}
          />
        )}
      </div>
    ));
  };

  const contextMenuNode = contextMenu ? findNodeById(fileSystem, contextMenu.nodeId) : null;

  return (
    <div className="container mx-auto p-4 min-h-screen" onClick={handleDeselect}>
      <input type="file" multiple ref={fileInputRef} onChange={handleFileChange} className="hidden" />
      <input type="file" ref={folderInputRef} onChange={handleFolderChange} className="hidden" webkitdirectory="" />

      <div>
        <p className='text-red-500'>please save it, once uploaded or created files and folders. Then only you can view the files by double clicking on selected file </p>
      </div>
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Documents</h1>
        <div className="flex items-center space-x-2">
          <button onClick={handleDownloadAll} disabled={isDownloadingAll} className="hidden items-center bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:bg-gray-400">
            <Download size={16} className="mr-2" />
            {isDownloadingAll ? 'Zipping...' : 'Download All'}
          </button>
          {saveStatus === 'saved' && <span className="text-green-500 text-sm">Saved!</span>}
          {saveStatus === 'error' && <span className="text-red-500 text-sm">Error!</span>}
          <button onClick={handleSave} disabled={saveStatus === 'saving'} className="flex items-center bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 disabled:bg-gray-400">
            <Save size={16} className="mr-2" />
            {saveStatus === 'saving' ? 'Saving...' : 'Save'}
          </button>
        </div>
      </header>

      <div className="flex space-x-2 mb-4" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => handleInitiateCreateNode(creationParentId, 'folder')} className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          <FolderIcon className="mr-2" /> New Folder
        </button>
        <button onClick={() => handleInitiateCreateNode(creationParentId, 'file')} className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          <FileIcon className="mr-2" /> New File
        </button>
      </div>

      <div className="mt-4" onClick={(e) => e.stopPropagation()}>
        {renderNodes(fileSystem, true)}
        {creatingNode?.parentId === null && (
          <div><InlineInput type={creatingNode.type} onConfirm={handleConfirmCreateNode} onCancel={handleCancelCreateNode} /></div>
        )}
      </div>

      {contextMenu && contextMenuNode && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          nodeType={contextMenuNode.type}
          onClose={() => setContextMenu(null)}
          onDownload={handleDownload}
          {...(contextMenuNode.type === 'folder' && {
            onCreateFolder: () => handleInitiateCreateNode(contextMenu.nodeId, 'folder'),
            onCreateFile: () => handleInitiateCreateNode(contextMenu.nodeId, 'file'),
            onUploadFile: () => handleInitiateFileUpload(contextMenu.nodeId),
            onUploadFolder: () => handleInitiateFolderUpload(contextMenu.nodeId),
          })}
        />
      )}

      {/* NEW: Render the FileViewer when a file is being viewed */}
      {viewingFile && (
        <FileViewer file={viewingFile} onClose={() => setViewingFile(null)} />
      )}
    </div>
  );
}