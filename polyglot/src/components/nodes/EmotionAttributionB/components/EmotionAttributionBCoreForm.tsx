'use client';

import { EmotionAttributionBItem } from '../types';
import { ItemEditor } from './ItemEditor';
import styles from './EmotionAttributionBCoreForm.module.css';
import { validateEmotionAttributionBNode } from '../validate';
import { ValidationError } from '@/types/ValidationError';

const AddIcon = () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

export type CoreFormProps = {
    items: EmotionAttributionBItem[];
    onChange: (newItems: EmotionAttributionBItem[]) => void;
    isDisabled?: boolean;
    getExternalErrors?: ValidationError[];
};

export const EmotionAttributionBCoreForm = ({ items = [], onChange, isDisabled, getExternalErrors }: CoreFormProps) => {
    const handleAddItem = () => {
        onChange([...items, { emotion: '', scenario: '', explanation: '' }]);
    };

    const handleUpdateItem = (index: number, updatedItem: EmotionAttributionBItem) => {
        const newItems = [...items];
        newItems[index] = updatedItem;
        onChange(newItems);
    };

    const handleRemoveItem = (index: number) => {
        onChange(items.filter((_, i) => i !== index));
    };

    // Autonomous local validation fallback
    const localErrors = validateEmotionAttributionBNode({ items });
    const activeErrors = getExternalErrors || localErrors;

    return (
        <div className={styles.container}>
            {activeErrors.length > 0 && !getExternalErrors && (
                <div style={{ padding: '0 0.5rem', marginBottom: '0.5rem', color: '#e53e3e', fontSize: '0.875rem' }}>
                    <strong>Validation Errors:</strong>
                    <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                        {activeErrors.map((err, idx) => (
                            <li key={idx}>[{err.path}]: {err.message}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className={styles.headerFlex}>
                <h4 className={styles.heading}>Elementi</h4>
                <button type="button" className={styles.addBtn} onClick={handleAddItem} disabled={isDisabled}>
                    <AddIcon /> Aggiungi
                </button>
            </div>

            {items.length === 0 && (
                <div className={styles.emptyState}>
                    <p className={styles.emptyText}>Nessun elemento inserito. Clicca <b>Aggiungi</b> per iniziare.</p>
                </div>
            )}

            <div className={styles.itemsList}>
                {items.map((item, index) => (
                    <ItemEditor
                        key={item.qid || index}
                        item={item}
                        index={index}
                        onChange={(updated) => handleUpdateItem(index, updated)}
                        onRemove={() => handleRemoveItem(index)}
                    />
                ))}
            </div>

            {items.length > 0 && (
                <button
                    type="button"
                    className={`${styles.addBtn} ${styles.fullWidthBtn}`}
                    onClick={handleAddItem}
                    disabled={isDisabled}
                >
                    <AddIcon /> Aggiungi
                </button>
            )}
        </div>
    );
};