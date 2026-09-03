'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './SearchBar.module.css';

type SearchItems = string[];

type SearchBarProps = {
  inputValue: string;
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

  // Maintain local state so typing remains instantly responsive in the UI
  const [localValue, setLocalValue] = useState(inputValue);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Sync local value if parent updates `inputValue` externally
  useEffect(() => {
    setLocalValue(inputValue);
  }, [inputValue]);

  // 2. Debounce the parent's `setInputValue` update by 200ms
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localValue !== inputValue) {
        setInputValue(localValue);
      }
    }, 200);

    return () => {
      clearTimeout(handler);
    };
  }, [localValue, setInputValue, inputValue]);

  // Filter items based on local user input (case-insensitive)
  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(localValue.toLowerCase())
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
      setLocalValue('');
      setInputValue(''); // Clear input text immediately after adding a tag
    } else {
      const nextValue = clearAfterSearch ? '' : value;
      setLocalValue(nextValue);
      setInputValue(nextValue);
    }

    setIsOpen(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.autocompleteWrapper} ref={wrapperRef}>
        <input
          type="text"
          className={styles.input}
          value={localValue} // Controlled by local state for instant feedback
          onChange={(e) => {
            setLocalValue(e.target.value); // Updates instantly locally
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