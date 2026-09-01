'use client';

import type { ChangeEventHandler } from 'react';
import styles from './TextField.module.css';

export type TextFieldProps = {
    label: string;
    name: string;
    width?: string;
    type?: string;
    isTextArea?: boolean;
    isReadOnly?: boolean;
    isDisabled?: boolean;
    required?: boolean; // <-- Changed from isRequired to required
    placeholder?: string;

    // Standard React Form Props (replacing react-hook-form)
    value?: string | number;
    defaultValue?: string | number;
    onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;

    // Validation Props
    error?: string;
};

const TextField = ({
    label,
    name,
    type = 'text',
    isTextArea,
    isReadOnly,
    isDisabled,
    required, // <-- Changed here
    placeholder,
    width = '100%',
    value,
    defaultValue,
    onChange,
    error,
}: TextFieldProps) => {
    const isInvalid = !!error;

    // The CSS floating label trick requires a placeholder attribute to exist on the DOM node.
    // If no placeholder is provided, we default to a single space " ".
    const _placeholder = placeholder || ' ';

    const inputClass = `${styles.input} ${isTextArea ? styles.textarea : ''} ${isInvalid ? styles.inputInvalid : ''}`;

    return (
        <div className={styles.container} style={{ width }}>
            <div className={styles.controlWrapper}>

                {isTextArea ? (
                    <textarea
                        id={name}
                        name={name}
                        value={value}
                        defaultValue={defaultValue}
                        onChange={onChange}
                        readOnly={isReadOnly}
                        disabled={isDisabled}
                        required={required} // <-- Updated here
                        placeholder={_placeholder}
                        className={inputClass}
                    />
                ) : (
                    <input
                        type={type}
                        id={name}
                        name={name}
                        value={value}
                        defaultValue={defaultValue}
                        onChange={onChange}
                        readOnly={isReadOnly}
                        disabled={isDisabled}
                        required={required} // <-- Updated here
                        placeholder={_placeholder}
                        className={inputClass}
                    />
                )}

                <label
                    htmlFor={name}
                    className={`${styles.label} ${isInvalid ? styles.labelInvalid : ''}`}
                >
                    {label} {required && <span aria-hidden="true" style={{ color: '#e53e3e' }}>*</span>}
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

export default TextField;