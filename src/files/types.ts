export interface File {
  id: string;
  name: string;
  type: 'file';
  mimeType: string; // <-- Add mimeType (e.g., 'image/jpeg')
  content: string;  // <-- Add content (will be a Base64 data URL)
}

export interface Folder {
  id: string;
  name: string;
  type: 'folder';
  children: FileSystemNode[];
}

export type FileSystemNode = File | Folder;