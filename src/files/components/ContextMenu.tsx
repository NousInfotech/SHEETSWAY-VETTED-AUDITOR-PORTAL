interface ContextMenuProps {
  x: number;
  y: number;
  nodeType: 'file' | 'folder';
  onClose: () => void;
  onCreateFolder?: () => void;
  onCreateFile?: () => void;
  onUploadFile?: () => void;
  onUploadFolder?: () => void;
  onDownload: () => void;
}

export default function ContextMenu({
  x,
  y,
  nodeType,
  onClose,
  onCreateFolder,
  onCreateFile,
  onUploadFile,
  onUploadFolder,
  onDownload
}: ContextMenuProps) {
  return (
    <div
      id='context-menu'
      
      className='fixed z-50 rounded-md border-3 border-gray-300 bg-white text-sm text-gray-800 shadow-lg'
      style={{ top: y, left: x }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Download is always the first option */}
      <div
        className='cursor-pointer px-4 py-2 hover:bg-blue-500 hover:text-white'
        onClick={() => {
          onDownload();
          onClose();
        }}
      >
        Download
      </div>

      {/* Show other options only for folders */}
      {nodeType === 'folder' && (
        <>
          <div className='my-1 border-t border-gray-200'></div>
          <div
            className='cursor-pointer px-4 py-2 hover:bg-blue-500 hover:text-white'
            onClick={() => {
              onCreateFolder?.();
              onClose();
            }}
          >
            New Folder
          </div>
          <div
            className='cursor-pointer px-4 py-2 hover:bg-blue-500 hover:text-white'
            onClick={() => {
              onCreateFile?.();
              onClose();
            }}
          >
            New File
          </div>
          <div className='my-1 border-t border-gray-200'></div>
          <div
            className='cursor-pointer px-4 py-2 hover:bg-blue-500 hover:text-white'
            onClick={() => {
              onUploadFile?.();
              onClose();
            }}
          >
            Upload Files
          </div>
          <div
            className='cursor-pointer px-4 py-2 hover:bg-blue-500 hover:text-white'
            onClick={() => {
              onUploadFolder?.();
              onClose();
            }}
          >
            Upload Folder
          </div>
        </>
      )}
    </div>
  );
}
