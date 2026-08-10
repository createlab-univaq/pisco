'use client';

import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import styles from './SearchBar.module.css';

type SearchItems = string[];

type SearchBarProps = {
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
  placeholder?: string;
  items: SearchItems;
  onSelectOption?: (value: string) => void;
  clearAfterSearch?: boolean;
  multiple?: boolean;
  removeSearchButton?: boolean;
};

export default function SearchBar({
  inputValue,
  setInputValue,
  placeholder = 'Search...',
  items,
  onSelectOption,
  clearAfterSearch,
  multiple,
  removeSearchButton,
}: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Filter items based on user input (case-insensitive)
  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(inputValue.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (value: string) => {
    onSelectOption?.(value);
    
    if (multiple) {
      if (!selectedTags.includes(value)) {
        setSelectedTags((prev) => [...prev, value]);
      }
      setInputValue(''); // Clear input text after adding a tag
    } else {
      setInputValue(clearAfterSearch ? '' : value);
    }
    
    setIsOpen(false);
  };

  const removeTag = (tagToRemove: string) => {
    setSelectedTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className={styles.container}>
      
      <div className={styles.autocompleteWrapper} ref={wrapperRef}>
        
        {/* Fake Input Container (Holds Tags + Actual Input) */}
        <div 
          className={`${styles.inputBox} ${isOpen ? styles.inputBoxFocused : ''}`}
          onClick={() => setIsOpen(true)}
        >
          {multiple && selectedTags.map((tag, id) => (
            <span key={id} className={styles.tag}>
              {tag}
              <button 
                className={styles.tagRemoveBtn} 
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(tag);
                }}
              >
                &times;
              </button>
            </span>
          ))}

          <input
            className={styles.input}
            type="text"
            placeholder={multiple && selectedTags.length > 0 ? '' : placeholder}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
          />
        </div>

        {/* Dropdown Menu */}
        {isOpen && filteredItems.length > 0 && (
          <ul className={styles.dropdownList}>
            {filteredItems.map((item, id) => (
              <li
                key={`option-${id}`}
                className={styles.dropdownItem}
                onClick={() => handleSelect(item)}
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Optional Search Button */}
      {!removeSearchButton && (
        <button
          className={styles.searchButton}
          aria-label="Search database"
          onClick={(e) => {
            e.preventDefault();
            // Trigger whatever global search logic you need here
          }}
        >
          {/* Magnifying Glass SVG (Replaces Chakra's SearchIcon) */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.searchIcon}
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      )}
      
    </div>
  );
}