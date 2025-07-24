'use client';

import { useState, useRef, useEffect } from 'react';
import { Folder, File } from 'lucide-react';

interface InlineInputProps {
  type: 'file' | 'folder';
  onConfirm: (name: string) => void;
  onCancel: () => void;
}

export default function InlineInput({
  type,
  onConfirm,
  onCancel
}: InlineInputProps) {
  const [name, setName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input field when the component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      // Prevent form submission if it's inside a form
      e.preventDefault();
      if (name.trim()) {
        onConfirm(name.trim());
      }
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  const handleBlur = () => {
    // Cancel if the user clicks away
    onCancel();
  };

  return (
    <div className='flex items-center space-x-2 p-2'>
      {type === 'folder' ? <Folder size={24} /> : <File size={24} />}
      <input
        ref={inputRef}
        type='text'
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className='rounded border border-blue-400 px-2 py-1 text-sm outline-none'
        placeholder={`New ${type} name`}
      />
    </div>
  );
}
