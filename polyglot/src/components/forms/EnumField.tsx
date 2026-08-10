'use client';

import type { ChangeEventHandler, ReactNode } from 'react';
import styles from './EnumField.module.css';

export type EnumFieldProps = {
  label: string;
  name: string;
  options: ReactNode;
  width?: string;
  hidden?: boolean;
  
  // Standard React Form Props
  defaultValue?: string | number;
  value?: string | number;
  onChange?: ChangeEventHandler<HTMLSelectElement>;
  
  // Validation Props
  error?: string;
  required?: boolean;
};

const EnumField = ({
  hidden,
  label,
  name,
  options,
  width = '100%',
  defaultValue,
  value,
  onChange,
  error,
  required,
}: EnumFieldProps) => {
  
  // Golden Standard: Don't pollute the DOM with hidden elements if they aren't needed
  if (hidden) return null;

  // If an error string is passed in, mark the field as invalid
  const isInvalid = !!error;

  return (
    <div className={styles.container} style={{ width }}>
      <div className={styles.controlWrapper}>
        
        <select
          id={name}
          name={name}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          required={required}
          className={`${styles.select} ${isInvalid ? styles.selectInvalid : ''}`}
        >
          {options}
        </select>

        <label
          htmlFor={name}
          className={`${styles.label} ${isInvalid ? styles.labelInvalid : ''}`}
        >
          {label}
        </label>

        {isInvalid && (
          <span className={styles.errorText}>
            {error}
          </span>
        )}
      </div>
    </div>
  );
};

export default EnumField;