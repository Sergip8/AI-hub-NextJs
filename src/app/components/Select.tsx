import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';

// Type definitions
type Option = {
  value: string;
  label: string;
};

type MultiSelectProps = {
  options: Option[];
  onChange?: (selected: Option[]) => void;
  placeholder?: string;
  maxSelected?: number;
  searchPlaceholder?: string;
};

const MultiSelect: React.FC<MultiSelectProps> = ({ 
  options, 
  onChange, 
  placeholder = 'Select items',
  maxSelected = 5,
  searchPlaceholder = 'Search items...'
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedValues, setSelectedValues] = useState<Option[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Memoized filtered options
  const filteredOptions = useMemo(() => {
    return options.filter(option => 
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  const handleSelect = (option: Option) => {
    const isSelected = selectedValues.some(item => item.value === option.value);
    
    if (isSelected) {
      // Deselect if already selected
      const newSelectedValues = selectedValues.filter(
        item => item.value !== option.value
      );
      setSelectedValues(newSelectedValues);
      onChange?.(newSelectedValues);
    } else {
      // Select if not at max limit
      if (selectedValues.length < maxSelected) {
        const newSelectedValues = [...selectedValues, option];
        setSelectedValues(newSelectedValues);
        onChange?.(newSelectedValues);
      }
    }
  };

  const removeSelectedItem = (valueToRemove: string) => {
    const newSelectedValues = selectedValues.filter(
      item => item.value !== valueToRemove
    );
    setSelectedValues(newSelectedValues);
    onChange?.(newSelectedValues);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!open) return;
  
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prevIndex) =>
          prevIndex < filteredOptions.length - 1 ? prevIndex + 1 : 0
        );
        break;
  
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : filteredOptions.length - 1
        );
        break;
  
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
        break;
  
      case 'Escape':
        setOpen(false);
        break;
  
      default:
        break;
    }
  };

  useEffect(() => {

      setHighlightedIndex(-1);
  
  }, [open,]);

  return (
    <div 
    ref={dropdownRef} 
    tabIndex={0} 
    onKeyDown={handleKeyDown} 
    className="relative w-full"
  >
    {/* Dropdown Trigger */}
    <div 
      onClick={() => setOpen(!open)}
      className="w-full border rounded-md p-2 flex items-center justify-between cursor-pointer 
      bg-white dark:bg-gray-800 
      border-gray-300 dark:border-gray-600
      text-gray-900 dark:text-gray-100"
    >
      <div className="flex flex-wrap gap-1 items-center">
        {selectedValues.length === 0 ? (
          <span className="text-gray-500 dark:text-gray-400">{placeholder}</span>
        ) : (
          selectedValues.map((item) => (
            <span 
              key={item.value} 
              className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-md px-2 py-1 text-sm mr-1 mb-1"
            >
              {item.label}
              <X 
                className="ml-1 h-4 w-4 cursor-pointer" 
                onClick={(e) => {
                  e.stopPropagation();
                  removeSelectedItem(item.value);
                }} 
              />
            </span>
          ))
        )}
      </div>
      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </div>

    {/* Dropdown Menu */}
    {open && (
      <div 
        className="absolute z-10 w-full mt-1 border rounded-md shadow-lg 
        bg-white dark:bg-gray-800 
        border-gray-300 dark:border-gray-600"
      >
        {/* Search Input */}
        <div className="p-2">
          <input 
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded-md 
            bg-gray-50 dark:bg-gray-700
            border-gray-300 dark:border-gray-600
            text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Options List */}
        <ul 
          className="max-h-60 overflow-y-auto"
        >
          {filteredOptions.length === 0 ? (
            <li className="p-2 text-center text-gray-500 dark:text-gray-400">
              No items found
            </li>
          ) : (
            filteredOptions.map((option, index) => (
              <li
                key={option.value}
                onClick={() => handleSelect(option)}
                className={`
                  p-2 flex items-center justify-between cursor-pointer
                  hover:bg-gray-100 dark:hover:bg-gray-700
                  ${selectedValues.some(item => item.value === option.value)
                    ? 'bg-gray-200 dark:bg-gray-600'
                    : ''
                  }
                  ${highlightedIndex === index ? 'bg-blue-500 text-white' : ''}
                `}
              >
                {option.label}
                {selectedValues.some(
                  item => item.value === option.value
                ) && (
                  <Check className="h-4 w-4 text-green-500" />
                )}
              </li>
            ))
          )}
        </ul>
      </div>
    )}

    {/* Max Selection Warning */}
    {selectedValues.length >= maxSelected && (
      <p className="text-sm text-red-500 mt-1">
        Maximum {maxSelected} items can be selected
      </p>
    )}
  </div>
  );
};



export { MultiSelect };