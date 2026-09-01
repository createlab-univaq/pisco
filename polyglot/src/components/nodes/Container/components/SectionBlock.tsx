'use client';

import { useMemo } from 'react';
import { deleteImageAction } from '@/lib/actions/images';
import { CONTAINER_NODE_ALLOWED_TYPES, ContainerSection, ContainerItem, AllowedContainerNodeType } from '../types';
import styles from './SectionBlock.module.css';
import { embeddedByType } from '@/components/nodes/Container/components/EmbeddedRegistry';
import { EditorCardWrapper } from '@/components/layouts/EditorCardWrapper';

const newId = () =>
    globalThis.crypto?.randomUUID?.() ??
    Math.random().toString(36).slice(2, 10);

const DeleteIcon = () => (
    <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export type SectionBlockProps = {
    section: ContainerSection;
    sectionIndex: number;
    containerNodeId?: string;
    onUpdateSection: (updated: ContainerSection) => void;
    onRemoveSection: () => void;
    onOpenItem: (itemIndex: number) => void;
    error?: string; // Added error prop
};

export const SectionBlock = ({
    section,
    sectionIndex,
    containerNodeId,
    onUpdateSection,
    onRemoveSection,
    onOpenItem,
    error,
}: SectionBlockProps) => {

    const allowedDefs = useMemo(() => {
        return CONTAINER_NODE_ALLOWED_TYPES.map((t) => {
            const def = embeddedByType[t];
            return def ? { ...def } : null;
        }).filter(Boolean) as any[];
    }, []);

    const addItem = (type: AllowedContainerNodeType) => {
        const def = embeddedByType[type];
        const newItem: ContainerItem = {
            id: newId(),
            type,
            title: def?.label ?? type,
            data: def?.createDefaultData?.() ?? {},
        };
        onUpdateSection({ ...section, items: [...section.items, newItem] });
    };

    const removeItem = async (itemIndex: number) => {
        const item = section.items[itemIndex];
        const itemId = item?.id;

        if (!containerNodeId || !itemId) {
            onUpdateSection({
                ...section,
                items: section.items.filter((_, i) => i !== itemIndex),
            });
            return;
        }

        try {
            if (item.data?.imageId) {
                await deleteImageAction(item.data.imageId);
            }

            onUpdateSection({
                ...section,
                items: section.items.filter((_, i) => i !== itemIndex),
            });
        } catch (e: any) {
            console.error('delete item files error', e);
            window.alert('Impossibile eliminare i file associati a questo item. Riprova.');
        }
    };

    return (
        <EditorCardWrapper
            title={`Sezione ${sectionIndex + 1}`}
            onRemove={onRemoveSection}
            removeLabel="Rimuovi sezione"
        >
            <div className={styles.sectionSubHeader}>
                <h5 className={styles.subTitle}>Nodi</h5>
                <select
                    className={`${styles.select} ${error ? styles.selectInvalid : ''}`}
                    value=""
                    onChange={(e) => {
                        const type = e.target.value as AllowedContainerNodeType;
                        if (type) addItem(type);
                    }}
                >
                    <option value="" disabled>Aggiungi nodo...</option>
                    {allowedDefs.map((d) => (
                        <option key={d.type} value={d.type}>
                            {d.label}
                        </option>
                    ))}
                </select>
            </div>

            {error && <div className={styles.errorText}>{error}</div>}

            {section.items.length === 0 ? (
                <div className={`${styles.emptyState} ${error ? styles.emptyStateInvalid : ''}`}>
                    <p className={styles.emptyText}>Nessun nodo in questa sezione.</p>
                </div>
            ) : (
                <div className={styles.itemsList}>
                    {section.items.map((item, itemIndex) => {
                        const def = embeddedByType[item.type];
                        return (
                            <div
                                key={item.id}
                                className={styles.itemCard}
                                onClick={() => onOpenItem(itemIndex)}
                            >
                                <div className={styles.itemCardLeft}>
                                    {def?.icon && (
                                        <img src={def.icon} alt={def.label} className={styles.itemIcon} />
                                    )}
                                    <span className={styles.itemTitle}>
                                        {item.title || def?.label || item.type}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    className={styles.iconBtnRed}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        void removeItem(itemIndex);
                                    }}
                                    title="Rimuovi nodo"
                                >
                                    <DeleteIcon />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </EditorCardWrapper>
    );
};