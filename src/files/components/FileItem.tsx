import { File } from '@/files/types';
import FileIcon from './FileIcon';

interface FileItemProps {
  file: File;
  isSelected: boolean;
  onClick: (fileId: string) => void;
  onContextMenu: (e: React.MouseEvent, nodeId: string) => void;
  onDoubleClick: (fileId: string) => void; // <-- Add double-click handler prop
}

export default function FileItem({ file, isSelected, onClick, onContextMenu, onDoubleClick }: FileItemProps) {
  const itemClasses = `inline-flex items-center space-x-2 p-2 rounded cursor-pointer ${
    isSelected
      ? 'text-blue-500'
      : 'text-gray-700 hover:text-blue-500'
  }`;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(file.id);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onContextMenu(e, file.id);
  }

  return (
    <div
      className={itemClasses}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onDoubleClick={() => onDoubleClick(file.id)} // <-- Attach handler
    >
      <FileIcon />
      <span>{file.name}</span>
    </div>
  );
}