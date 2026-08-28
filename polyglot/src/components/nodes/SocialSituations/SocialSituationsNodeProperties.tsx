'use client';

import styles from './SocialSituationsNodeProperties.module.css';
import { PolyglotNodePropertiesProps } from '@/types/ElementMappingTypes';
import { SocialSituationsNode, SocialSituationItem } from './types';
import NodeProperties from '../NodeProperties';
import { useNodeSync } from '@/hooks/useNodeSync';
import { ItemEditor } from './components/ItemEditor';

const newId = (prefix: string) =>
    globalThis.crypto?.randomUUID?.() ??
    `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;

const AddIcon = () => (
    <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

const SocialSituationsNodeProperties = ({ element, onUpdateElement }: PolyglotNodePropertiesProps) => {
    const node = element as SocialSituationsNode;
    const data = node.data || {};
    const items = data.items || [];

    const { handleBaseChange, handleDataChange } = useNodeSync(node, onUpdateElement);

    const handleAddItem = () => {
        handleDataChange({
            items: [
                ...items,
                {
                    sid: newId('sid'),
                    sections: [],
                }
            ]
        });
    };

    const handleUpdateItem = (index: number, updatedItem: SocialSituationItem) => {
        const updatedItems = [...items];
        updatedItems[index] = updatedItem;
        handleDataChange({ items: updatedItems });
    };

    const handleRemoveItem = (index: number) => {
        handleDataChange({
            items: items.filter((_, i) => i !== index)
        });
    };

    return (
        <div className={styles.container}>
            <NodeProperties
                title={node.title}
                description={node.description}
                onUpdateTitle={(val) => handleBaseChange({ title: val })}
                onUpdateDescription={(val) => handleBaseChange({ description: val })}
            />

            <hr className={styles.divider} />

            <div className={styles.headerFlex}>
                <h3 className={styles.sectionTitle}>Quesiti</h3>
                <button type="button" className={styles.addBtnPrimary} onClick={handleAddItem}>
                    <AddIcon />
                    <span>Aggiungi quesito</span>
                </button>
            </div>

            {/* Root Empty State Feedback */}
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

            {/* Root Bottom Action Button (Dual-Placement Standard) */}
            {items.length > 0 && (
                <button
                    type="button"
                    className={`${styles.addBtnPrimary} ${styles.fullWidthBtn}`}
                    onClick={handleAddItem}
                >
                    <AddIcon />
                    <span>Aggiungi quesito</span>
                </button>
            )}
        </div>
    );
};

export default SocialSituationsNodeProperties;