'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './SearchBar.module.css';

type SearchItems = string[];

type SearchBarProps = {
  inputValue: string;
  // Fix: Changed from Dispatch<SetStateAction<string>> to a generic callback
  setInputValue: (value: string) => void;
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
      setInputValue(''); // Clear input text after adding a tag
    } else {
      setInputValue(clearAfterSearch ? '' : value);
    }

    setIsOpen(false);
  };

  return (
    <div className={styles.container}>

      <div className={styles.autocompleteWrapper} ref={wrapperRef}>

        {/* Fix: Added the missing input element! */}
        <input
          type="text"
          className={styles.input} /* Ensure this class exists in your CSS */
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
        />

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
          {/* Magnifying Glass SVG */}
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