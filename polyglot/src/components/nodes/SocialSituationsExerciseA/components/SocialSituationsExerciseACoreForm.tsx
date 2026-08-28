'use client';

import { SocialSituationsExerciseAItem } from '../types';
import { ItemEditor } from './ItemEditor';
import styles from './SocialSituationsExerciseACoreForm.module.css';
import { validateSocialSituationsExerciseANode } from '../validate';
import { ValidationError } from '@/types/ValidationError';

const newId = (prefix: string) =>
    globalThis.crypto?.randomUUID?.() ??
    `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;

const AddIcon = () => (
    <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

export type SocialSituationsExerciseACoreFormProps = {
    items: SocialSituationsExerciseAItem[];
    onChange: (newItems: SocialSituationsExerciseAItem[]) => void;
    isDisabled?: boolean;
    getExternalErrors?: ValidationError[];
};

export const SocialSituationsExerciseACoreForm = ({ items = [], onChange, isDisabled, getExternalErrors }: SocialSituationsExerciseACoreFormProps) => {
    const handleAddItem = () => {
        onChange([
            ...items,
            {
                sid: newId('sid'),
                sections: [],
            }
        ]);
    };

    const handleUpdateItem = (index: number, updatedItem: SocialSituationsExerciseAItem) => {
        const updatedItems = [...items];
        updatedItems[index] = updatedItem;
        onChange(updatedItems);
    };

    const handleRemoveItem = (index: number) => {
        onChange(items.filter((_, i) => i !== index));
    };

    const localErrors = validateSocialSituationsExerciseANode({ items });
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
                <h3 className={styles.sectionTitle}>Quesiti</h3>
                <button type="button" className={styles.addBtnPrimary} onClick={handleAddItem} disabled={isDisabled}>
                    <AddIcon />
                    <span>Aggiungi quesito</span>
                </button>
            </div>

            {items.length === 0 && (
                <div className={styles.emptyState}>
                    <p className={styles.emptyText}>
                        Nessun quesito ancora. Clicca <b>Aggiungi quesito</b> per iniziare.
                    </p>
                </div>
            )}

            <div className={styles.itemsList}>
                {items.map((it, itemIndex) => (
                    <ItemEditor
                        key={it.sid || itemIndex}
                        item={it}
                        itemIndex={itemIndex}
                        onChange={(updated) => handleUpdateItem(itemIndex, updated)}
                        onRemoveItem={() => handleRemoveItem(itemIndex)}
                    />
                ))}
            </div>

            {items.length > 0 && (
                <button
                    type="button"
                    className={`${styles.addBtnPrimary} ${styles.fullWidthBtn}`}
                    onClick={handleAddItem}
                    disabled={isDisabled}
                >
                    <AddIcon />
                    <span>Aggiungi quesito</span>
                </button>
            )}
        </div>
    );
};