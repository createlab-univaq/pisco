'use client';

import { useMemo, useState } from 'react';
import { FilesAPI } from '@/data/api';
import TextField from '@/components/forms/TextField';
import { CONTAINER_NODE_ALLOWED_TYPES, ContainerNode, ContainerSection, ContainerItem, AllowedContainerNodeType } from './types';
import styles from './ContainerNodeProperties.module.css';
import NodeProperties from '../NodeProperties';
import { embeddedByType } from '@/components/embedded/EmbeddedRegistry';
import { useNodeSync } from '@/hooks/useNodeSync';
import { PolyglotNodePropertiesProps } from '@/types/polyglot-elements/ElementMappingTypes';

const newId = () =>
    globalThis.crypto?.randomUUID?.() ??
    Math.random().toString(36).slice(2, 10);

// Reusable SVGs
const AddIcon = () => (
    <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);
const DeleteIcon = () => (
    <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);
const ArrowBackIcon = () => (
    <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

type DrillState =
    | { mode: 'list' }
    | { mode: 'edit'; sectionIndex: number; itemIndex: number };

/* ---------------- Section Block ---------------- */
type SectionBlockProps = {
    section: ContainerSection;
    sectionIndex: number;
    containerNodeId?: string;
    onUpdateSection: (updated: ContainerSection) => void;
    onRemoveSection: () => void;
    onOpenItem: (itemIndex: number) => void;
};

const SectionBlock = ({
    section,
    sectionIndex,
    containerNodeId,
    onUpdateSection,
    onRemoveSection,
    onOpenItem,
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
        const itemId = section.items[itemIndex]?.id;

        if (!containerNodeId || !itemId) {
            onUpdateSection({
                ...section,
                items: section.items.filter((_, i) => i !== itemIndex),
            });
            return;
        }

        try {
            // Delete associated files remotely first
            if ((FilesAPI as any).deleteItemFiles) {
                await (FilesAPI as any).deleteItemFiles(containerNodeId, itemId);
            }

            // Remove locally
            onUpdateSection({
                ...section,
                items: section.items.filter((_, i) => i !== itemIndex),
            });
            console.log('Nodo rimosso e file associati eliminati');
        } catch (e: any) {
            console.error('deleteItemFiles error', e);
            window.alert('Impossibile eliminare i file associati a questo item. Riprova.');
            // UX Choice: Non rimuovo l'item se non ho eliminato i file
        }
    };

    return (
        <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
                <h4 className={styles.sectionTitle}>Sezione {sectionIndex + 1}</h4>
                <button type="button" className={styles.iconBtnRed} onClick={onRemoveSection} title="Rimuovi sezione">
                    <DeleteIcon />
                </button>
            </div>

            <hr className={styles.divider} />

            <div className={styles.sectionSubHeader}>
                <h5 className={styles.subTitle}>Nodi</h5>
                <select
                    className={styles.select}
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

            {section.items.length === 0 ? (
                <p className={styles.emptyText}>Nessun nodo in questa sezione.</p>
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
        </div>
    );
};


/* ---------------- Root Component ---------------- */
const ContainerNodeProperties = ({ element, onUpdateElement }: PolyglotNodePropertiesProps) => {
    const [drill, setDrill] = useState<DrillState>({ mode: 'list' });

    const node = element as ContainerNode;
    const data = node.data || {};
    const sections = data.sections || [];
    const containerNodeId = node._id;

    // Use the shared hook
    const { handleBaseChange, handleDataChange } = useNodeSync(node, onUpdateElement);

    const addSection = () => {
        handleDataChange({
            sections: [...sections, { id: newId(), items: [] }]
        });
    };

    const handleUpdateSection = (index: number, updatedSection: ContainerSection) => {
        const newSections = [...sections];
        newSections[index] = updatedSection;
        handleDataChange({ sections: newSections });
    };

    const handleRemoveSection = (index: number) => {
        handleDataChange({
            sections: sections.filter((_, i) => i !== index)
        });
    };

    // -------------------
    // EDIT VIEW (Child)
    // -------------------
    if (drill.mode === 'edit') {
        const { sectionIndex, itemIndex } = drill;
        const section = sections[sectionIndex];
        const item = section?.items[itemIndex];

        // Safety fallback if item was deleted or state is out of sync
        if (!item) {
            return (
                <button className={styles.backBtn} onClick={() => setDrill({ mode: 'list' })}>
                    <ArrowBackIcon /> Torna alle sezioni
                </button>
            );
        }

        const def = embeddedByType[item.type];
        const Embedded = def?.component;

        const handleItemChange = (updatedItem: ContainerItem) => {
            const newSections = [...sections];
            newSections[sectionIndex].items[itemIndex] = updatedItem;
            handleDataChange({ sections: newSections });
        };

        return (
            <div className={styles.container}>
                <button className={styles.backBtn} onClick={() => setDrill({ mode: 'list' })}>
                    <ArrowBackIcon />
                    <span>Torna alle sezioni</span>
                </button>

                <div className={styles.editCard}>
                    <h4 className={styles.editTitle}>{def?.label ?? item.type}</h4>

                    <TextField
                        label="Titolo (card)"
                        name="title-field"
                        value={item.title || ''}
                        onChange={(e) => handleItemChange({ ...item, title: e.target.value })}
                    />

                    <hr className={styles.divider} />

                    {Embedded ? (
                        containerNodeId ? (
                            <Embedded
                                data={item.data}
                                onDataChange={(newData: any) => handleItemChange({ ...item, data: newData })}
                                parentNodeId={containerNodeId}
                                parentItemId={item.id}
                            />
                        ) : (
                            <p className={styles.hintText}>
                                Seleziona il nodo container nel canvas per caricare un’immagine o dati.
                            </p>
                        )
                    ) : (
                        <p className={styles.errorText}>
                            Tipo embedded non registrato: {String(item.type)}
                        </p>
                    )}
                </div>
            </div>
        );
    }

    // -------------------
    // LIST VIEW (Parent)
    // -------------------
    return (
        <div className={styles.container}>
            <NodeProperties
                title={node.title}
                description={node.description}
                onUpdateTitle={(val) => handleBaseChange({ title: val })}
                onUpdateDescription={(val) => handleBaseChange({ description: val })}
                activityDescription="Nodo contenitore: crea sezioni e inserisci nodi. Clicca una card per compilare il nodo interno."
            />

            <hr className={styles.divider} />

            <div className={styles.headerFlex}>
                <h3 className={styles.sectionTitle}>Sezioni</h3>
                <button type="button" className={styles.addBtn} onClick={addSection}>
                    <AddIcon />
                    <span>Aggiungi sezione</span>
                </button>
            </div>

            <div className={styles.sectionsList}>
                {sections.map((section, index) => (
                    <SectionBlock
                        key={section.id || index}
                        section={section}
                        sectionIndex={index}
                        containerNodeId={containerNodeId}
                        onUpdateSection={(updated) => handleUpdateSection(index, updated)}
                        onRemoveSection={() => handleRemoveSection(index)}
                        onOpenItem={(itemIndex) => setDrill({ mode: 'edit', sectionIndex: index, itemIndex })}
                    />
                ))}
            </div>
        </div>
    );
};

export default ContainerNodeProperties;