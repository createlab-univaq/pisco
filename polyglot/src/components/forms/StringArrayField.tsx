'use client';

import styles from './StringArrayField.module.css';
import TextField from './TextField';

// Reusable SVG Icons replacing @chakra-ui/icons
const CloseIcon = () => (
    <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const AddIcon = () => (
    <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

export type StringArrayFieldProps = {
    values: string[];
    onChange: (values: string[]) => void;
    itemLabel?: string;
    addLabel?: string;
    placeholder?: string;
    defaultItemValue?: string;
    keepAtLeastOne?: boolean;
    isDisabled?: boolean;
};

const StringArrayField = ({
    values = [],
    onChange,
    itemLabel = 'Elemento',
    addLabel = 'Aggiungi',
    placeholder,
    defaultItemValue = '',
    keepAtLeastOne = false,
    isDisabled = false,
}: StringArrayFieldProps) => {

    const handleUpdateText = (index: number, newText: string) => {
        const updatedValues = [...values];
        updatedValues[index] = newText;
        onChange(updatedValues);
    };

    const handleRemove = (index: number) => {
        const updatedValues = values.filter((_, i) => i !== index);
        onChange(updatedValues);
    };

    const handleAdd = () => {
        onChange([...values, defaultItemValue]);
    };

    return (
        <div className={styles.container}>
            {values.map((value, index) => {
                // If keepAtLeastOne is true, disable removal when only 1 item is left
                const canRemove = keepAtLeastOne ? values.length > 1 : true;

                return (
                    <div key={index} className={styles.row}>
                        <div className={styles.inputWrapper}>
                            {/* Assumes TextField has been refactored to take value/onChange */}
                            <TextField
                                label={`${itemLabel} ${index + 1}`}
                                name={`array-item-${index}`}
                                value={value}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpdateText(index, e.target.value)}
                                placeholder={placeholder}
                                isDisabled={isDisabled}
                            />
                        </div>

                        <button
                            type="button"
                            className={styles.removeBtn}
                            disabled={!canRemove || isDisabled}
                            onClick={() => handleRemove(index)}
                            aria-label="Rimuovi"
                            title="Rimuovi elemento"
                        >
                            <CloseIcon />
                        </button>
                    </div>
                );
            })}

            <button
                type="button"
                className={styles.addBtn}
                onClick={handleAdd}
                disabled={isDisabled}
            >
                <AddIcon />
                <span>{addLabel}</span>
            </button>
        </div>
    );
};

export default StringArrayField;