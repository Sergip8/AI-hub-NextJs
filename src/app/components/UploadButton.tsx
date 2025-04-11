import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { Upload } from 'lucide-react';

type UploadButtonWithDropdownProps = {
  children: ReactNode;
  disabled: boolean // Permitir pasar contenido personalizado
};

const UploadButton: React.FC<UploadButtonWithDropdownProps> = ({ children, disabled }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    setOpen(!open);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
      disabled={disabled}
        onClick={handleSendMessage}
        className="p-2 rounded-full 
          bg-orange-200 dark:bg-gray-700 
          hover:bg-orange-300 dark:hover:bg-gray-600 
          transition-all"
      >
        <Upload className="w-6 h-6" />
      </button>

      {open && (
        <div className="absolute bottom-12 right-0 mb-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
          <ul className="py-2">
            {children}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UploadButton;