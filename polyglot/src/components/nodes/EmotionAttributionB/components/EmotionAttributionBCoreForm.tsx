'use client';

import { EmotionAttributionBItem } from '../types';
import { ItemEditor } from './ItemEditor';
import styles from './EmotionAttributionBCoreForm.module.css';

const AddIcon = () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

export type CoreFormProps = {
    items: EmotionAttributionBItem[];
    onChange: (newItems: EmotionAttributionBItem[]) => void;
    isDisabled?: boolean;
};

export const EmotionAttributionBCoreForm = ({ items = [], onChange, isDisabled }: CoreFormProps) => {

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

    return (
        <div className={styles.container}>
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