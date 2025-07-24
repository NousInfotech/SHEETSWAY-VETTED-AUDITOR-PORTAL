// src/files/components/FolderItem.tsx
import { Folder } from '@/files/types';
import FolderIcon from './FolderIcon';
import { ChevronRight } from 'lucide-react';

interface FolderItemProps {
  folder: Folder;
  isExpanded: boolean;
  isSelected: boolean;
  onClick: (folderId: string) => void;
  onContextMenu: (e: React.MouseEvent, folder: Folder) => void;
}

export default function FolderItem({
  folder,
  isExpanded,
  isSelected,
  onClick,
  onContextMenu
}: FolderItemProps) {
  
  const itemClasses = `inline-flex items-center space-x-2 p-2 rounded cursor-pointer ${
    isSelected ? 'text-green-500' : 'text-orange-400 hover:text-green-900'
  }`;

  const handleContextMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    onContextMenu(e, folder);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(folder.id);
  };

  return (
    <div
      className={itemClasses}
      onContextMenu={handleContextMenu}
      onClick={handleClick}
    >
      <ChevronRight
        size={16}
        className={`transform transition-transform duration-200 ${
          isExpanded ? 'rotate-90' : 'rotate-0'
        }`}
      />
      <FolderIcon />
      <span>{folder.name}</span>
    </div>
  );
}
