'use client';

import styles from './EmotionAttributionBEmbedded.module.css';
import { ItemEditor, EmotionAttributionBItem } from './ItemEditor';

const newId = () =>
    globalThis.crypto?.randomUUID?.() ??
    `item_${Date.now()}_${Math.random().toString(16).slice(2)}`;

const AddIcon = () => (
    <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

export type EmotionAttributionBEmbeddedProps = {
    data: any;
    onChange: (newData: any) => void;
};

const EmotionAttributionBEmbedded = ({ data, onChange }: EmotionAttributionBEmbeddedProps) => {
    // Allows the array to remain empty by default
    const items: EmotionAttributionBItem[] = data?.items || [];

    const handleAddItem = () => {
        onChange({
            ...data,
            items: [
                ...items,
                { qid: newId(), emotion: '', scenario: '', explanation: '' }
            ]
        });
    };

    const handleRemoveItem = (indexToRemove: number) => {
        onChange({
            ...data,
            items: items.filter((_, idx) => idx !== indexToRemove)
        });
    };

    const handleUpdateItem = (index: number, updatedItem: EmotionAttributionBItem) => {
        const newItems = [...items];
        newItems[index] = updatedItem;
        onChange({ ...data, items: newItems });
    };

    return (
        <div className={styles.container}>
            {/* Top Action Button */}
            <div className={styles.headerFlex}>
                <h3 className={styles.sectionTitle}>Elementi</h3>
                <button type="button" className={styles.addBtn} onClick={handleAddItem}>
                    <AddIcon />
                    <span>Aggiungi Elemento</span>
                </button>
            </div>

            {/* Empty State Feedback */}
            {items.length === 0 && (
                <div className={styles.emptyState}>
                    <p className={styles.emptyText}>
                        Nessun elemento ancora. Clicca <b>Aggiungi Elemento</b> per iniziare.
                    </p>
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

            {/* Bottom Action Button (Dual-Placement Standard) */}
            {items.length > 0 && (
                <button
                    type="button"
                    className={`${styles.addBtn} ${styles.fullWidthBtn}`}
                    onClick={handleAddItem}
                >
                    <AddIcon />
                    <span>Aggiungi Elemento</span>
                </button>
            )}
        </div>
    );
};

export default EmotionAttributionBEmbedded;