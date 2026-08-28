'use client';

import { useState } from 'react';
import TextField from '@/components/forms/TextField';
import { ContainerNode, ContainerSection, ContainerItem } from './types';
import styles from './ContainerNodeProperties.module.css';
import NodeProperties from '../NodeProperties';
import { embeddedByType } from '@/components/nodes/Container/components/EmbeddedRegistry';
import { useNodeSync } from '@/hooks/useNodeSync';
import { PolyglotNodePropertiesProps } from '@/types/ElementMappingTypes';
import { SectionBlock } from './components/SectionBlock';

const newId = () =>
    globalThis.crypto?.randomUUID?.() ??
    Math.random().toString(36).slice(2, 10);

const AddIcon = () => (
    <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
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

const ContainerNodeProperties = ({ element, onUpdateElement }: PolyglotNodePropertiesProps) => {
    const [drill, setDrill] = useState<DrillState>({ mode: 'list' });

    const node = element as ContainerNode;
    const data = node.data || {};
    const sections = data.sections || [];
    const containerNodeId = node._id;

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
    // EDIT VIEW (Drill down into an embedded node)
    // -------------------
    if (drill.mode === 'edit') {
        const { sectionIndex, itemIndex } = drill;
        const section = sections[sectionIndex];
        const item = section?.items[itemIndex];

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
    // LIST VIEW (Parent Sections)
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

            {sections.length === 0 && (
                <div className={styles.emptyState}>
                    <p className={styles.emptyTextCenter}>
                        Nessuna sezione ancora. Clicca <b>Aggiungi sezione</b> per iniziare.
                    </p>
                </div>
            )}

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

            {/* Bottom Action Button (Dual-Placement Standard) */}
            {sections.length > 0 && (
                <button
                    type="button"
                    className={`${styles.addBtn} ${styles.fullWidthBtn}`}
                    onClick={addSection}
                >
                    <AddIcon />
                    <span>Aggiungi sezione</span>
                </button>
            )}
        </div>
    );
};

export default ContainerNodeProperties;