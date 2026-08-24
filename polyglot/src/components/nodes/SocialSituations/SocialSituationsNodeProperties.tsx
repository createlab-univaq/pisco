'use client';

import TextField from '@/components/forms/TextField';
import styles from './SocialSituationsNodeProperties.module.css';
import { PolyglotNodePropertiesProps } from '@/components/ElementMapping';
import {
    SocialSituationsNode,
    SocialSituationItem,
    SocialSituationSection
} from './types';
import NodeProperties from '../NodeProperties';
import MultiSelectAnswersField from '@/components/forms/MultiSelectAnswersField';

// Genera un id con fallback (compatibile)
const newId = (prefix: string) =>
    globalThis.crypto?.randomUUID?.() ??
    `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;

// Reusable SVGs
const AddIcon = () => (
    <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);
const CloseIcon = () => (
    <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

/* ---------------- Section Editor ---------------- */
type SectionEditorProps = {
    section: SocialSituationSection;
    sectionIndex: number;
    onChange: (updatedSection: SocialSituationSection) => void;
    onRemoveSection: () => void;
};

const SectionEditor = ({ section, sectionIndex, onChange, onRemoveSection }: SectionEditorProps) => {
    return (
        <div className={styles.sectionCard}>
            <div className={styles.cardHeader}>
                <h5 className={styles.cardTitle}>Sezione #{sectionIndex + 1}</h5>
                <button type="button" className={styles.removeBtnSmall} onClick={onRemoveSection}>
                    <CloseIcon />
                    <span>Rimuovi sezione</span>
                </button>
            </div>

            {/* Testo spezzato in 3 parti: before, bold, after */}
            <TextField
                label="Testo iniziale"
                name={`section-${sectionIndex}-before`}
                value={section.before || ''}
                onChange={(e) => onChange({ ...section, before: e.target.value })}
                isTextArea
            />
            <TextField
                label="Parte in grassetto"
                name={`section-${sectionIndex}-bold`}
                value={section.bold || ''}
                onChange={(e) => onChange({ ...section, bold: e.target.value })}
            />
            <TextField
                label="Testo finale"
                name={`section-${sectionIndex}-after`}
                value={section.after || ''}
                onChange={(e) => onChange({ ...section, after: e.target.value })}
                isTextArea
            />

            <hr className={styles.innerDivider} />

            {/* 
                Assuming MultiSelectAnswersField was refactored to take controlled 
                answers arrays, correctIndexes arrays, and onChange callbacks
            */}
            <MultiSelectAnswersField
                label="Risposte"
                answers={section.answers || []}
                correctIndexes={section.correctIndexes || []}
                onAnswersChange={(newAnswers: any) => onChange({ ...section, answers: newAnswers })}
                onCorrectIndexesChange={(newIndexes: number[]) => onChange({ ...section, correctIndexes: newIndexes })}
            />
        </div>
    );
};

/* ---------------- Item Editor ---------------- */
type ItemEditorProps = {
    item: SocialSituationItem;
    itemIndex: number;
    onChange: (updatedItem: SocialSituationItem) => void;
    onRemoveItem: () => void;
};

const ItemEditor = ({ item, itemIndex, onChange, onRemoveItem }: ItemEditorProps) => {
    const sections = item.sections || [];

    const handleUpdateSection = (index: number, updatedSection: SocialSituationSection) => {
        const updatedSections = [...sections];
        updatedSections[index] = updatedSection;
        onChange({ ...item, sections: updatedSections });
    };

    const handleRemoveSection = (index: number) => {
        onChange({ ...item, sections: sections.filter((_, i) => i !== index) });
    };

    const handleAddSection = () => {
        onChange({
            ...item,
            sections: [
                ...sections,
                {
                    before: '',
                    bold: '',
                    after: '',
                    answers: [{ text: '', score: 0 }],
                    correctIndexes: [],
                }
            ]
        });
    };

    return (
        <div className={styles.itemCard}>
            <div className={styles.cardHeader}>
                <h4 className={styles.itemTitle}>Quesito #{itemIndex + 1}</h4>
                <button type="button" className={styles.removeBtnMedium} onClick={onRemoveItem}>
                    <CloseIcon />
                    <span>Rimuovi quesito</span>
                </button>
            </div>

            <div className={styles.subHeaderFlex}>
                <h5 className={styles.cardTitle}>Sezioni</h5>
                <button type="button" className={styles.addBtnSmall} onClick={handleAddSection}>
                    <AddIcon />
                    <span>Aggiungi sezione</span>
                </button>
            </div>

            <div className={styles.sectionsList}>
                {sections.map((s, sectionIndex) => (
                    <SectionEditor
                        key={sectionIndex}
                        section={s}
                        sectionIndex={sectionIndex}
                        onChange={(updated) => handleUpdateSection(sectionIndex, updated)}
                        onRemoveSection={() => handleRemoveSection(sectionIndex)}
                    />
                ))}
            </div>
        </div>
    );
};

/* ---------------- Root Component ---------------- */
const SocialSituationsNodeProperties = ({ element, onUpdateElement }: PolyglotNodePropertiesProps) => {
    const node = element as SocialSituationsNode;
    const data = node.data || {};
    const items = data.items || [];

    const handleBaseChange = (updatedBase: Partial<SocialSituationsNode>) => {
        onUpdateElement({ ...node, ...updatedBase });
    };

    const handleDataChange = (updatedData: Partial<SocialSituationsNode['data']>) => {
        onUpdateElement({
            ...node,
            data: { ...node.data, ...updatedData }
        });
    };

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
                platform={['WebApp']}
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
        </div>
    );
};

export default SocialSituationsNodeProperties;