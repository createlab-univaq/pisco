'use client';

import TextField from '@/components/forms/TextField';
import styles from './SocialSituationsExerciseANodeProperties.module.css';
import { PolyglotNodePropertiesProps } from '@/types/polyglot-elements/ElementMappingTypes';
import {
    SocialSituationsExerciseANode,
    SocialSituationsExerciseAItem,
    SocialSituationsExerciseASection,
    SocialSituationsExerciseAAnswer
} from './types';
import NodeProperties from '../NodeProperties';
import { useNodeSync } from '@/hooks/useNodeSync';

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
    section: SocialSituationsExerciseASection;
    sectionIndex: number;
    onChange: (updatedSection: SocialSituationsExerciseASection) => void;
    onRemoveSection: () => void;
};

const SectionEditor = ({ section, sectionIndex, onChange, onRemoveSection }: SectionEditorProps) => {
    // Ensure answers array always contains 4 items
    const answers = section.answers?.length === 4 ? section.answers : [
        { text: '', explanation: '' },
        { text: '', explanation: '' },
        { text: '', explanation: '' },
        { text: '', explanation: '' },
    ];

    const handleAnswerChange = (ansIndex: number, field: keyof SocialSituationsExerciseAAnswer, value: string) => {
        const updatedAnswers = [...answers] as [
            SocialSituationsExerciseAAnswer,
            SocialSituationsExerciseAAnswer,
            SocialSituationsExerciseAAnswer,
            SocialSituationsExerciseAAnswer
        ];
        updatedAnswers[ansIndex] = { ...updatedAnswers[ansIndex], [field]: value };
        onChange({ ...section, answers: updatedAnswers });
    };

    return (
        <div className={styles.sectionCard}>
            <div className={styles.cardHeader}>
                <h5 className={styles.cardTitle}>Sezione #{sectionIndex + 1}</h5>
                <button type="button" className={styles.removeBtnSmall} onClick={onRemoveSection}>
                    <CloseIcon />
                    <span>Rimuovi sezione</span>
                </button>
            </div>

            {/* Reusing the base 3-part text layout pattern */}
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

            <div>
                <label className={styles.sectionTitle} style={{ display: 'block', marginBottom: '8px' }}>
                    Risposte (4 opzioni, seleziona la corretta e inserisci la spiegazione)
                </label>
                {answers.map((ansItem, ansIdx) => (
                    <div key={ansIdx} style={{ display: 'flex', gap: '8px', marginBottom: '10px', alignItems: 'flex-start' }}>
                        <input
                            type="radio"
                            name={`correct-answer-sec-${sectionIndex}`}
                            checked={section.correctIndex === ansIdx}
                            onChange={() => onChange({ ...section, correctIndex: ansIdx })}
                            style={{ marginTop: '8px' }}
                            title="Imposta come risposta corretta"
                        />
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <input
                                type="text"
                                placeholder={`Risposta ${ansIdx + 1}`}
                                value={ansItem.text}
                                onChange={(e) => handleAnswerChange(ansIdx, 'text', e.target.value)}
                                style={{ width: '100%', padding: '4px 8px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                            />
                            <input
                                type="text"
                                placeholder={`Spiegazione per Risposta ${ansIdx + 1}`}
                                value={ansItem.explanation}
                                onChange={(e) => handleAnswerChange(ansIdx, 'explanation', e.target.value)}
                                style={{ width: '100%', padding: '4px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.8rem', background: '#f8fafc' }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

/* ---------------- Item Editor ---------------- */
type ItemEditorProps = {
    item: SocialSituationsExerciseAItem;
    itemIndex: number;
    onChange: (updatedItem: SocialSituationsExerciseAItem) => void;
    onRemoveItem: () => void;
};

const ItemEditor = ({ item, itemIndex, onChange, onRemoveItem }: ItemEditorProps) => {
    const sections = item.sections || [];

    const handleUpdateSection = (index: number, updatedSection: SocialSituationsExerciseASection) => {
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
                    answers: [
                        { text: '', explanation: '' },
                        { text: '', explanation: '' },
                        { text: '', explanation: '' },
                        { text: '', explanation: '' },
                    ],
                    correctIndex: 0,
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
const SocialSituationsExerciseANodeProperties = ({ element, onUpdateElement }: PolyglotNodePropertiesProps) => {
    const node = element as SocialSituationsExerciseANode;
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

    const handleUpdateItem = (index: number, updatedItem: SocialSituationsExerciseAItem) => {
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

export default SocialSituationsExerciseANodeProperties;