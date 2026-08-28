'use client';

import { SocialSituationsExerciseAItem } from '../types';
import { ItemEditor } from './ItemEditor';
import styles from './SocialSituationsExerciseACoreForm.module.css';

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
};

export const SocialSituationsExerciseACoreForm = ({ items = [], onChange, isDisabled }: SocialSituationsExerciseACoreFormProps) => {
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

    return (
        <div className={styles.container}>
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